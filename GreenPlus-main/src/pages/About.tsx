import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { useEffect, useRef } from "react";
gsap.registerPlugin(SplitText);

function About() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const heading2Ref = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => {
    const heading = new SplitText(headingRef.current, { type: "words" });
    const para = new SplitText(paraRef.current, { type: "lines" });

    let tl = gsap.timeline();
    tl.from(heading.words, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
    });

    tl.fromTo(
      heading2Ref.current,
      {
        y: 50,
        opacity: 0,
        duration: 0.1,
        ease: "power3.out",
      },
      {
        y: 0,
        opacity: 1,
      },
    );
    tl.from(para.lines,{
      y:50,
      opacity:0,
      duration:0.8,
      stagger:0.2,
      ease:"bounceIn"
    })
  });

  return (
    <section className="flex flex-col items-center justify-center px-6 pb-60 text-center">
      {" "}
      <h1 ref={headingRef} className="font-semiblod text-3xl sm:text-8xl font-serif">
        About <span style={{ color: "#4CAF50" }}>Green</span>Pulse
      </h1>
      <h2 ref={heading2Ref} className="mt-3 font-meduim  text-4xl gap-1">
        Making <span style={{ color: "#4CAF50" }}>Nature</span> Visible Before
        It’s Too Late
      </h2>
      <p
        ref={paraRef}
        className="  font-serif
      animate-fade-rise-delay
      mt-8
      max-w-2xl
      font-sans
      text-xl
      leading-relaxed
      sm:text-lg"
      >
        GreenPulse is a hyperlocal ecological intelligence platform built for
        tourism-pressured and ecologically sensitive sites in Meghalaya. We
        continuously observe environmental conditions through real-world sensor
        nodes and turn that data into a simple Ecological Monitoring Score
        (EMS)—helping local authorities understand ecological stress as it
        happens, rather than after visible damage has already occurred. From
        trail erosion and root-system stress to changing environmental
        conditions, GreenPulse brings real-time situational awareness to the
        places that need it most.
      </p>
    </section>
  );
}

export default About;
