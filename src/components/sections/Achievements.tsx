"use client";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion, useInView, useScrollFrame } from "@/lib/hooks";
import TechLogo from "../ui/TechLogo";

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function Count({ spec, run }: { spec: NonNullable<Achievement["count"]>; run: boolean }) {
  const [v, setV] = useState(prefersReducedMotion() ? spec.to : 0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) { setV(spec.to); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setV(spec.to * easeOutQuart(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, spec.to]);
  const d = spec.decimals ?? 0;
  return (
    <span className="ac-num" role="img" aria-label={`${spec.prefix ?? ""}${spec.to.toFixed(d)}${spec.suffix ?? ""}`}>
      <span aria-hidden="true">{spec.prefix}{v.toFixed(d)}{spec.suffix}</span>
    </span>
  );
}

function Card({ a, i, active }: { a: Achievement; i: number; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { threshold: 0.45 });
  return (
    <li ref={ref} className={`ac-card ${active ? "is-active" : ""}`}>
      <div className="ac-top">
        <span className="ac-logo"><TechLogo concept={a.icon} size={34} /></span>
        <span className="mono ac-idx">{String(i + 1).padStart(2, "0")} / {String(ACHIEVEMENTS.length).padStart(2, "0")}</span>
      </div>
      <div className="ac-bot">
        <div className="ac-txt">
          <p className="mono ac-label">{a.label}</p>
          <p className="ac-cap">{a.caption}</p>
          <p className="mono ac-det">{a.detail}</p>
        </div>
        {a.count ? <Count spec={a.count} run={seen} /> : <span className="ac-word serif">{a.word}</span>}
      </div>
    </li>
  );
}

export default function Achievements() {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const travel = useRef(0);
  const [active, setActive] = useState(0);

  const measure = () => {
    const s = sec.current, t = track.current;
    if (!s || !t) return;
    travel.current = Math.max(0, t.scrollWidth - window.innerWidth);
    s.style.height = `${window.innerHeight + travel.current}px`;
  };

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    const late = setTimeout(measure, 600); // after fonts settle
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); clearTimeout(late); };
  }, []);

  useScrollFrame(() => {
    const s = sec.current, t = track.current;
    if (!s || !t) return;
    const top = s.getBoundingClientRect().top;
    const p = travel.current > 0 ? Math.min(1, Math.max(0, -top / travel.current)) : 0;
    t.style.transform = `translate3d(${(-p * travel.current).toFixed(1)}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    const mid = window.innerWidth / 2;
    let best = 0, bd = Infinity;
    t.querySelectorAll<HTMLElement>(".ac-card").forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    setActive((o) => (o === best ? o : best));
  }, sec);

  return (
    <section id="achievements" ref={sec} className="ach" aria-labelledby="ach-h" style={{ minHeight: "260svh" }}>
      <style>{`
        .ach{position:relative}
        .ach-pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,5vh,56px);overflow:hidden;padding-top:72px}
        .ach-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
        .ach-head .tag{margin-bottom:18px}
        .ach-h{font-size:clamp(36px,5vw,72px)}
        .ach-prog{display:flex;align-items:center;gap:14px;padding-bottom:10px}
        .ach-prog .mono{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .ach-prog div{width:clamp(80px,14vw,180px);height:2px;background:var(--line);border-radius:2px;overflow:hidden}
        .ach-prog i{display:block;height:100%;background:var(--ink);transform:scaleX(0);transform-origin:0 50%}
        .ach-track{display:flex;align-items:center;gap:clamp(14px,2vw,28px);padding:24px var(--gutter);width:max-content;will-change:transform}
        .ac-card{flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);padding:22px 24px 24px;border-radius:28px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 14px 30px -24px rgba(13,13,13,.2);display:flex;flex-direction:column;justify-content:space-between;position:relative;isolation:isolate;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
        .ac-card.is-active{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 44px 70px -34px rgba(13,13,13,.38)}
        .ac-top{display:flex;justify-content:space-between;align-items:flex-start}
        .ac-logo{position:relative;width:72px;height:72px;border-radius:20px;display:grid;place-items:center;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
        .ac-logo::before{content:"";position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.07),transparent);opacity:.5;transition:opacity .8s var(--ease);z-index:-1}
        .ac-card.is-active .ac-logo::before{opacity:1}
        .ac-idx{font-size:11px;letter-spacing:.08em;color:var(--mute)}
        .ac-bot{display:flex;align-items:flex-end;justify-content:space-between;gap:12px 16px;flex-wrap:wrap}
        .ac-txt{flex:1 1 150px;min-width:0}
        .ac-label{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);margin-bottom:6px}
        .ac-cap{font-size:14px;line-height:1.35;color:var(--ink-2);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .ac-det{font-size:10.5px;letter-spacing:.05em;color:var(--mute);margin-top:8px}
        .ac-num{font-weight:700;font-size:clamp(56px,7vw,104px);letter-spacing:-.06em;line-height:.85;font-variant-numeric:tabular-nums}
        .ac-word{font-size:clamp(34px,3.6vw,52px);line-height:.9;color:var(--ink);letter-spacing:-.02em}
        .ac-end{flex:none;padding:0 clamp(20px,6vw,100px) 0 24px;font-size:clamp(36px,5vw,72px);color:var(--mute);white-space:nowrap}
        @media (max-width:640px){.ach-prog{display:none}.ac-card{width:min(86vw,360px);padding:18px 20px 20px}}
      `}</style>
      <div className="ach-pin">
        <div className="wrap ach-head">
          <div>
            <p className="tag"><b>06</b> — Achievements</p>
            <h2 id="ach-h" className="h2 ach-h">
              <span className="rv-mask"><span>Moments that <em>counted.</em></span></span>
            </h2>
          </div>
          <div className="ach-prog" aria-hidden="true"><span className="mono">Scroll</span><div><i ref={bar} /></div></div>
        </div>
        <ul className="ach-track" ref={track}>
          {ACHIEVEMENTS.map((a, i) => <Card key={a.label} a={a} i={i} active={active === i} />)}
          <li className="ac-end serif" aria-hidden="true">and counting →</li>
        </ul>
      </div>

    </section>
  );
}
