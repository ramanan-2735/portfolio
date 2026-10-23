"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { useScrollFrame } from "@/lib/hooks";

const SECTION_IDS = ["about", "skills", "work", "certifications", "experience", "achievements", "contact"];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    setScrolled(window.scrollY > 40);
  });

  // active section
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(NAV.some((n) => n.id === e.target.id) ? e.target.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "-45% 0px -50% 0px" });
    if (hero) heroIo.observe(hero);
    return () => { io.disconnect(); heroIo.disconnect(); };
  }, []);

  // sliding indicator
  const place = useCallback(() => {
    const p = pill.current, l = list.current;
    if (!p || !l) return;
    const a = active ? (l.querySelector(`[data-id="${active}"]`) as HTMLElement | null) : null;
    if (!a) { p.style.opacity = "0"; return; }
    p.style.opacity = "1";
    p.style.width = `${a.offsetWidth}px`;
    p.style.transform = `translateX(${a.offsetLeft}px)`;
  }, [active]);
  useLayoutEffect(place, [place, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  // mobile overlay
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const opener = menuBtn.current;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToTarget(id), open ? 60 : 0);
  };

  return (
    <header className={`nv ${scrolled ? "is-scrolled" : ""}`}>
      <style>{`
        .nv{position:fixed;inset:0 0 auto 0;z-index:100;pointer-events:none}
        .nv-prog{position:absolute;top:0;left:0;right:0;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;z-index:4}
        .nv-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px var(--gutter);position:relative;z-index:2}
        .nv-row>*{pointer-events:auto}
        .nv-brand{display:flex;align-items:center;gap:12px;border-radius:999px}
        .nv-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:15px;letter-spacing:-.03em;box-shadow:inset 0 0 0 1.5px var(--ink);background:transparent;color:var(--ink);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nv.is-scrolled .nv-mark{background:var(--ink);color:#fff}
        .nv-brand:hover .nv-mark{transform:rotate(360deg)}
        .nv-name{font-weight:600;letter-spacing:-.02em;font-size:15px;transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .nv.is-scrolled .nv-name{opacity:0;transform:translateX(-8px);pointer-events:none}
        .nv-pill{border-radius:999px;padding:5px;transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nv.is-scrolled .nv-pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -16px rgba(13,13,13,.25)}
        .nv-pill ul{display:flex;position:relative;margin:0}
        .nv-pill a{position:relative;z-index:1;display:block;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .4s var(--ease)}
        .nv-pill a:hover{color:var(--ink)}
        .nv-pill a.on{color:#fff}
        .nv-ind{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
        .nv-menu{display:none;height:44px;padding:0 22px;border-radius:999px;background:var(--ink);color:#fff;font-weight:500;font-size:14px}
        .nv-ov{position:fixed;inset:0;background:var(--paper);display:flex;flex-direction:column;padding:18px var(--gutter) 28px;clip-path:inset(0 0 100% 0);transition:clip-path .8s var(--ease);pointer-events:none;visibility:hidden;z-index:3}
        .nv-ov.open{clip-path:inset(0 0 0 0);pointer-events:auto;visibility:visible}
        .nv-ov-top{display:flex;justify-content:space-between;align-items:center;height:44px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--mute)}
        .nv-close{height:44px;padding:0 20px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);font-size:14px;color:var(--ink)}
        .nv-ov ol{margin:auto 0;display:flex;flex-direction:column;gap:4px}
        .nv-ov li{overflow:hidden}
        .nv-ov li a{display:flex;align-items:baseline;gap:16px;font-size:clamp(44px,13vw,84px);font-weight:700;letter-spacing:-.045em;line-height:1.08;transform:translateY(110%);transition:transform .9s var(--ease) calc(var(--i)*70ms + .15s)}
        .nv-ov.open li a{transform:none}
        .nv-ov li a .mono{font-size:12px;font-weight:400;letter-spacing:.06em;color:var(--mute)}
        .nv-ov-foot{font-size:13px;color:var(--mute)}
        @media (max-width:860px){.nv-pill{display:none}.nv-menu{display:block}.nv.is-scrolled .nv-name{opacity:1;transform:none;pointer-events:auto}}
      `}</style>
      <div className="nv-prog" ref={bar} aria-hidden="true" />
      <div className="nv-row">
        <a href="#top" className="nv-brand" onClick={go("top")}>
          <span className="nv-mark" aria-hidden="true">{PROFILE.initials}</span>
          <span className="nv-name">{PROFILE.name}</span>
        </a>

        <nav className="nv-pill" aria-label="Primary">
          <ul ref={list}>
            <span className="nv-ind" ref={pill} aria-hidden="true" />
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} data-id={n.id} className={active === n.id ? "on" : ""} aria-current={active === n.id ? "true" : undefined} onClick={go(n.id)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button ref={menuBtn} className="nv-menu" aria-expanded={open} aria-controls="nv-overlay" onClick={() => setOpen(true)}>
          Menu
        </button>
      </div>

      <div id="nv-overlay" className={`nv-ov ${open ? "open" : ""}`} aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div className="nv-ov-top">
          <span className="mono">Menu</span>
          <button className="nv-close" onClick={() => setOpen(false)} aria-label="Close menu">Close ✕</button>
        </div>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} ref={i === 0 ? firstLink : undefined} onClick={go(n.id)}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="mono nv-ov-foot">{PROFILE.email}</p>
      </div>

    </header>
  );
}
