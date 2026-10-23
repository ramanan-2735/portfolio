"use client";
import { useRef } from "react";
import { EDUCATION, EXPERIENCE, PROFILE } from "@/lib/data";
import { useScrollFrame } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const STOPS = [...EXPERIENCE, ...EDUCATION];

export default function Experience() {
  const tl = useRef<HTMLOListElement>(null);

  // spine height follows the reading line (60% of viewport); stops light up once the spine passes their dot
  useScrollFrame(() => {
    const el = tl.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const fill = Math.max(0, Math.min(r.height, window.innerHeight * 0.6 - r.top));
    el.style.setProperty("--fill", `${fill}px`);
    el.querySelectorAll<HTMLElement>(".xp-stop").forEach((s) => s.classList.toggle("lit", s.offsetTop + 14 <= fill));
  }, tl);

  return (
    <section id="experience" className="sec xp cv" aria-labelledby="xp-h">
      <style>{`
        .xp-tl{position:relative;margin-top:clamp(48px,8vh,96px);padding-left:0;--fill:0px}
        .xp-tl::before{content:"";position:absolute;left:226px;top:0;bottom:0;width:1px;background:var(--line)}
        .xp-tl::after{content:"";position:absolute;left:225px;top:0;width:3px;border-radius:3px;height:var(--fill);background:var(--ink)}
        .xp-stop{position:relative;display:grid;grid-template-columns:200px minmax(0,1fr);gap:0 56px;padding-bottom:clamp(48px,8vh,88px)}
        .xp-stop:last-child{padding-bottom:0}
        .xp-dot{position:absolute;left:218px;top:7px;width:17px;height:17px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1.5px var(--faint);transition:background .6s var(--ease),box-shadow .6s var(--ease),transform .6s var(--ease)}
        .xp-stop.lit .xp-dot{background:var(--ink);box-shadow:0 0 0 6px rgba(13,13,13,.08);transform:scale(1)}
        .xp-when{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding-top:8px;text-align:right;transition:color .6s var(--ease)}
        .xp-stop.lit .xp-when{color:var(--ink)}
        .xp-body{padding-left:34px;opacity:.7;transform:translateY(10px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
        .xp-stop.lit .xp-body{opacity:1;transform:none}
        .xp-kind{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
        .xp-body h3{font-size:clamp(24px,3vw,40px);font-weight:700;letter-spacing:-.04em;line-height:1.05}
        .xp-place{margin-top:6px;font-size:17px;color:var(--mute);font-weight:500}
        .xp-body ul{margin-top:16px;display:flex;flex-direction:column;gap:9px;max-width:62ch}
        .xp-body li{position:relative;padding-left:18px;color:var(--ink-2);font-size:15.5px;line-height:1.5}
        .xp-body li::before{content:"";position:absolute;left:0;top:.7em;width:8px;height:1px;background:var(--ink)}
        .xp-card{margin-left:34px;display:flex;flex-direction:column;gap:6px;padding:28px 32px;border-radius:26px;border:1.5px dashed rgba(13,13,13,.28);max-width:520px;transition:background .5s var(--ease),border-color .5s var(--ease),transform .6s var(--ease)}
        .xp-card:hover{background:#fff;border-color:var(--ink);transform:translateY(-3px)}
        .xp-card .mono{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .xp-card strong{font-size:clamp(30px,4vw,52px);font-weight:700;letter-spacing:-.045em;line-height:1}
        .xp-card em{color:var(--mute)}
        .xp-mail{font-size:14px;color:var(--ink-2);margin-top:4px;overflow-wrap:anywhere}
        @media (max-width:760px){
          .xp-tl::before{left:7px}.xp-tl::after{left:6px}
          .xp-stop{grid-template-columns:minmax(0,1fr);padding-left:34px}
          .xp-dot{left:0}
          .xp-when{text-align:left;padding:0 0 8px}
          .xp-body{padding-left:0}
          .xp-card{margin-left:0}
        }
      `}</style>
      <div className="wrap">
        <p className="tag rv"><b>05</b> — Experience &amp; education</p>
        <h2 id="xp-h" className="h2">
          <span className="rv-mask"><span>One path,</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span>step by <em>step.</em></span></span>
        </h2>

        <ol className="xp-tl" ref={tl}>
          {STOPS.map((s) => (
            <li key={s.title + s.when} className="xp-stop">
              <span className="xp-dot" aria-hidden="true" />
              <div className="xp-when mono">{s.when}</div>
              <div className="xp-body">
                <p className="xp-kind mono">{s.kind}</p>
                <h3>{s.title}</h3>
                <p className="xp-place">{s.place}</p>
                <ul>{s.detail.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            </li>
          ))}
          <li className="xp-stop xp-next">
            <span className="xp-dot" aria-hidden="true" />
            <div className="xp-when mono">Next</div>
            <a className="xp-card" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>
              <span className="mono">Next —</span>
              <strong>Your <em className="serif">team?</em></strong>
              <span className="xp-mail">{PROFILE.email} →</span>
            </a>
          </li>
        </ol>
      </div>

    </section>
  );
}
