"use client";

import { FaBars, FaHamburger } from "react-icons/fa";
import { useEffect, useReducer, useRef, useState } from "react";

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
  const [isMenuOpen, toggleMenuOpen] = useReducer(
    (isMenuOpen) => !isMenuOpen,
    false
  );
  return (
    <div className="sticky top-[-1px] pt-3 z-10 -mt-3" ref={navRef}>
      <nav className="rounded bg-white p-3 border-2 border-black mt-[1px]">
        <button
          className="text-xs flex content-center items-center gap-2 w-full justify-end -mt-2 p-2 pb-0 text-neutral-500 hover:text-neutral-700 sm:hidden"
          onClick={toggleMenuOpen}
        >
          <span>Menu</span>
          <FaBars />
        </button>
        <ul
          className={`menu grid gap-1 text-sm font-bold ${
            isMenuOpen ? "menu-open" : ""
          }`}
        >
          <li>
            <a href="#a-concise-demonstration">A Concise Demonstration</a>
          </li>
          <li>
            <a href="#installation">Installation</a>
          </li>
          <li>
            <a href="#ids-classes">ID&apos;s & Classes</a>
          </li>
          <li>
            <a href="#creating-edges-with-labels">Creating Edges with Labels</a>
          </li>
          <li>
            <a href="#class-connections">Class Connections</a>
          </li>
          <li>
            <a href="#attributes">Attributes</a>
          </li>
          <li>
            <a href="#d3-bar-graph">D3 Bar Graph</a>
          </li>
          <li>
            <a href="#sankey-diagram">Sankey Diagram</a>
          </li>
          <li>
            <a href="#images">Images</a>
          </li>
          <li>
            <a href="#tabular-data">Tabular Data</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
