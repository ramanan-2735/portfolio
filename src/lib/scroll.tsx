"use client";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef } from "react";
import { prefersReducedMotion } from "./hooks";

let instance: Lenis | null = null;

/** Smoothly scroll to a section id (or "top"). Falls back to native scrolling when Lenis is off. */
export function scrollToTarget(target: string, offset = 0) {
  const el = target === "top" ? document.body : document.getElementById(target);
  if (!el) return;
  if (instance) {
    const l = instance;
    const settle = () => {
      if (target === "top") return;
      const d = el.getBoundingClientRect().top - offset;
      if (Math.abs(d) > 4) l.scrollTo(l.scroll + d, { immediate: true, force: true });
    };
    l.scrollTo(target === "top" ? 0 : el, { offset, duration: 1.4, onComplete: settle });
  }
  else window.scrollTo({ top: target === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY + offset, behavior: "auto" });
}

export function lockScroll(lock: boolean) {
  if (instance) {
    if (lock) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

const Ctx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(Ctx);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.1, smoothWheel: true });
    ref.current = l;
    instance = l;
    let raf = requestAnimationFrame(function tick(t) {
      l.raf(t);
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      instance = null;
    };
  }, []);
  return <Ctx.Provider value={ref.current}>{children}</Ctx.Provider>;
}
