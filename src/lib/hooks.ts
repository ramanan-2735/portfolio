"use client";
import { RefObject, useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true once the element has been inside the viewport (or always, if `once` is false: tracks live state). */
export function useInView<T extends Element>(ref: RefObject<T | null>, opts: { threshold?: number; margin?: string; once?: boolean } = {}) {
  const { threshold = 0.2, margin = "0px", once = true } = opts;
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        } else if (!once) setSeen(false);
      },
      { threshold, rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, margin, once]);
  return seen;
}

/** 0 → 1 as the element travels through the viewport. `start`/`end` are viewport fractions (0 = top, 1 = bottom). */
export function useScrollProgress<T extends Element>(ref: RefObject<T | null>, start = 0.8, end = 0.3) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start;
      const to = vh * end;
      const v = (from - r.top) / (r.height + from - to);
      const c = Math.min(1, Math.max(0, v));
      setP((o) => (Math.abs(o - c) < 0.002 ? o : c));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, start, end]);
  return p;
}

/**
 * Runs a callback on every scroll frame (no React re-render).
 * With `gate`, frames are skipped while that element is more than a viewport away, which keeps layout reads off the hot path.
 */
export function useScrollFrame(fn: () => void, gate?: RefObject<Element | null>) {
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const g = gate?.current;
      if (g) {
        const r = g.getBoundingClientRect();
        if (r.bottom < -window.innerHeight || r.top > window.innerHeight * 2) return;
      }
      fn();
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useMedia(q: string, initial = false) {
  const [m, setM] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}
