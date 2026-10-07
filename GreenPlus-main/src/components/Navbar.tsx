import gsap from "gsap";
import { useEffect, useRef } from "react";


interface MenuItem {
  path:string;
  label: string;
  color: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Home", color: "#000000" , path:"/"},
  { label: "About", color: "#6F6F6F",path:"/about" },
  { label: "Feedback", color: "#6F6F6F",path:"/feedback" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      {
        y: -50,
        opacity: 0,
        duration:1
      },
      { y: 0, opacity: 1 },
    );
  });

  return (
    <nav
      ref={navRef}
      className="flex sticky justify-between items-center px-8 py-6 w-full mx-auto w"
    >
      <a
        href="/"
        className="font-serif text-3xl tracking-tight font-medium"
        style={{ color: "#000000" }}
      >
        Green<span style={{ color: "#4CAF50" }}>Pulse</span>
      </a>

      <ul className="hidden md:flex items-center gap-10 font-sans text-sm">
        {MENU_ITEMS.map((item) => (
          <li key={item.label}>
            <a
              href={item.path}
              className="transition-colors duration-200 hover:text-black"
              style={{ color: item.color }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="rounded-full bg-black px-6 py-2.5 font-sans text-sm text-white transition-transform duration-300 ease-out hover:scale-[1.03]"
      >
        <button onClick={() => {
  window.location.href = "http://localhost:3000";
}}>Move to dashboard</button>
     
      </button>
    </nav>
  );
}
