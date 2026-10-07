import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

/** Seconds spent fading in at the start / fading out before the end. */
const FADE_SECONDS = 0.5;
/** Pause between the video ending and the manual restart. */
const RESTART_DELAY_MS = 100;

/**
 * Renders the fullscreen looping background video.
 *
 * Native <video loop> jump-cuts on restart, so instead we drive opacity
 * by hand: a requestAnimationFrame loop reads currentTime/duration every
 * frame and fades the video in over the first 0.5s and out over the last
 * 0.5s. When the video actually ends we drop to opacity 0, wait 100ms so
 * the fade-out is fully settled, then reset currentTime and play() again
 * — producing a seamless, flicker-free loop.
 */
export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      const { currentTime, duration } = video;

      if (duration && Number.isFinite(duration)) {
        let nextOpacity = 1;

        if (currentTime < FADE_SECONDS) {
          // Fade in: 0 -> 1 over the first FADE_SECONDS
          nextOpacity = currentTime / FADE_SECONDS;
        } else if (currentTime > duration - FADE_SECONDS) {
          // Fade out: 1 -> 0 over the last FADE_SECONDS
          nextOpacity = (duration - currentTime) / FADE_SECONDS;
        }

        setOpacity(Math.min(1, Math.max(0, nextOpacity)));
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      setOpacity(0);
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, RESTART_DELAY_MS);
    };

    video.addEventListener('ended', handleEnded);
    void video.play();
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener('ended', handleEnded);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute z-0" style={{ inset: 'auto 0 0 0', top: '250px' }}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        style={{ opacity, transition: 'opacity 50ms linear' }}
        src={VIDEO_SRC}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}
