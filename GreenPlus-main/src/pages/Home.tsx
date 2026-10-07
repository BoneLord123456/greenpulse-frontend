import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
gsap.registerPlugin(SplitText);


export default function Home() {
  const headingRef = useRef<HTMLHeadingElement|null>(null)
    const paragarphRef = useRef<HTMLHeadingElement|null>(null)
  useEffect(()=>{
const heading = new SplitText(headingRef.current,{type:"words"})
const paragarph = new SplitText(paragarphRef.current,{
  type:"lines"
})
let tl  = gsap.timeline()
   tl.from(heading.words, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
    });
tl.from(paragarph.lines,{
  y:50,
  opacity:0,
  stagger:0.1,
  ease:"power3.out"
})
  })

  return (
    <section
      className="flex flex-col items-center justify-center px-6 pb-40 text-center"
      style={{ paddingTop: 'calc(8rem - 75px)' }}
    >
      <h1 ref={headingRef}
        className="animate-fade-rise max-w-none max-w-7xl font-serif text-5xl font-normal sm:text-7xl md:text-8xl"
        style={{ lineHeight: 0.95, letterSpacing: '-2.46px', color: '#000000' }}
      >
        Beyond <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>the noise,</em>{' '}
        we measure <em style={{ color: '#6F6F6F', fontStyle: 'italic' }}>what matters.</em>
      </h1>

      <p ref={paragarphRef}
        className="animate-fade-rise-delay max-w-none mt-8 max-w-2xl font-sans text-base leading-relaxed sm:text-lg"
        style={{ color: '#6F6F6F' }}
      >
        Turning environmental data into clearer decisions for healthier, smarter communities. <br></br>
        From real-time sensing to intelligent predictions, we build technology that helps cities
        understand what they breathe.
      </p>

      <button
        type="button"
        className="animate-fade-rise-delay-2 mt-12 rounded-full px-14 py-5 font-sans text-base transition-transform duration-300 ease-out hover:scale-[1.03]"
        style={{ backgroundColor: '#000000', color: '#FFFFFF' }} onClick={() => {
  window.location.href = "http://localhost:3000";
}}
      >
        Begin Journey
      </button>
    </section>
  );
}
