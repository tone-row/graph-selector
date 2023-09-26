"use client";

import { FaBars } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const links: { href: string; text: string }[] = [
  { href: "#a-concise-demonstration", text: "A Concise Demonstration" },
  { href: "#installation", text: "Installation" },
  { href: "#ids-classes", text: "ID's & Classes" },
  { href: "#creating-edges-with-labels", text: "Creating Edges with Labels" },
  { href: "#class-connections", text: "Class Connections" },
  { href: "#attributes", text: "Attributes" },
  { href: "#d3-bar-graph", text: "D3 Bar Graph" },
  { href: "#sankey-diagram", text: "Sankey Diagram" },
  { href: "#images", text: "Images" },
  { href: "#tabular-data", text: "Tabular Data" },
];

const MOBILE_BREAKPOINT = 640;

export function Nav() {
  const navRef = useRef<HTMLDivElement>(null);
  /* watch when nav becomes sticky and add a class */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.target.classList.toggle("is-pinned", !entry.isIntersecting);
      },
      { threshold: [1] }
    );
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  /**
   * Intercept link click, check if on mobile
   * If on mobile, close the menu, find the location of the target
   * Subtract 100px to account for the sticky nav
   * Scroll to the target
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) return;
    e.preventDefault();

    const target = e.currentTarget.getAttribute("href");
    if (target) {
      const targetEl = document.querySelector(target);
      if (targetEl) {
        if (isMenuOpen) setIsMenuOpen(false);
        // defer, so the menu can close first
        setTimeout(() => {
          const targetY = targetEl.getBoundingClientRect().top;
          window.scrollBy({ top: targetY - 80, behavior: "smooth" });
        }, 100);
      }
    }
  };
  return (
    <div className="sticky top-[-1px] pt-3 z-10 -mt-3" ref={navRef}>
      <nav className="rounded bg-white p-3 mt-[1px]">
        <button
          className="text-xs flex content-center items-center gap-2 w-full justify-end -mt-2 p-2 pb-0 text-neutral-500 hover:text-neutral-700 sm:hidden"
          onClick={() => {
            setIsMenuOpen((s) => !s);
          }}
        >
          <span>Menu</span>
          <FaBars />
        </button>
        <ul
          className={`menu grid gap-1 text-sm font-bold ${
            isMenuOpen ? "menu-open" : ""
          }`}
        >
          {links.map(({ href, text }) => (
            <li key={href}>
              <a href={href} onClick={handleClick}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
