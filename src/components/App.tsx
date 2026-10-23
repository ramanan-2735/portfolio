"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
const Skills = dynamic(() => import("./sections/Skills"));
const Work = dynamic(() => import("./sections/Work"));
const Certifications = dynamic(() => import("./sections/Certifications"));
const Experience = dynamic(() => import("./sections/Experience"));
const Achievements = dynamic(() => import("./sections/Achievements"));
const Contact = dynamic(() => import("./sections/Contact"));

/** Adds .is-in to .rv / .rv-mask the first time they enter the viewport. */
function useRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".rv, .rv-mask").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useRevealObserver();
  return (
    <SmoothScroll>
      <a href="#about" className="skip">Skip to content</a>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
      </main>
      <Contact />
      <style>{`.skip{position:fixed;left:16px;top:-60px;z-index:200;background:var(--ink);color:#fff;padding:10px 18px;border-radius:999px;transition:top .3s var(--ease)}.skip:focus{top:14px}`}</style>
    </SmoothScroll>
  );
}
