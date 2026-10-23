/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const BARS = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2];

function Lanyard() {
  const swing = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);

  // damped pendulum: pointer velocity -> angular velocity, spring pulls back, idle sway on top
  useEffect(() => {
    const el = swing.current;
    if (!el || prefersReducedMotion()) return;
    const s = { a: 0, v: 0, px: -1, pt: 0, last: performance.now(), t: 0 };
    let raf = 0;
    let live = false;
    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - s.last) / 1000);
      s.last = now;
      s.t += dt;
      s.v += (-26 * s.a - 2.6 * s.v) * dt;
      s.a += s.v * dt;
      s.a = Math.max(-16, Math.min(16, s.a));
      const idle = Math.sin(s.t * 1.1) * 1.1 + Math.sin(s.t * 0.47) * 0.6;
      el.style.transform = `rotate(${(s.a + idle).toFixed(3)}deg)`;
      raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      const now = performance.now();
      if (s.px >= 0) {
        const dx = e.clientX - s.px;
        const dt = Math.max(8, now - s.pt) / 1000;
        s.v += Math.max(-30, Math.min(30, (dx / dt) * 0.012));
      }
      s.px = e.clientX;
      s.pt = now;
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !live) { live = true; s.last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting && live) { live = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    window.addEventListener("pointermove", move, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);

  const strapText = `${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `;

  return (
    <div className="ln">
      <div className="ln-swing" ref={swing}>
        <span id="idc-hint" className="sr-only">Press to flip the ID card.</span>
        <div className="ln-strap" aria-hidden="true">
          <div className="ln-strap-in">
            <span>{strapText.repeat(6)}</span>
            <span>{strapText.repeat(6)}</span>
          </div>
        </div>
        <div className="ln-clip" aria-hidden="true"><i /></div>

        <button type="button" className={`idc ${flip ? "is-flip" : ""}`} onClick={() => setFlip((f) => !f)} aria-pressed={flip} aria-describedby="idc-hint">
          <span className="idc-in">
            <span className="idc-face idc-front" aria-hidden={flip}>
              <span className="idc-band"><i /> DEVELOPER ID</span>
              <span className="idc-photo">
                <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={128} height={156} draggable={false} />
              </span>
              <span className="idc-name">{PROFILE.name}</span>
              <span className="idc-role mono">{PROFILE.role}</span>
              <span className="idc-rows mono">
                <span><b>Dept.</b><em>CSE</em></span>
                <span><b>CGPA</b><em>{PROFILE.cgpa.split("/")[0]}</em></span>
                <span><b>Valid till</b><em>{PROFILE.gradYear}</em></span>
              </span>
              <span className="idc-foot">
                <span className="idc-bars" aria-hidden="true">{BARS.map((w, i) => <i key={i} style={{ width: w }} />)}</span>
                <span className="idc-holo" aria-hidden="true" />
              </span>
            </span>
            <span className="idc-face idc-back" aria-hidden={!flip}>
              <span className="idc-band"><i /> WHAT I AM</span>
              <span className="idc-list">
                <span><b className="mono">Role</b>{PROFILE.role}</span>
                <span><b className="mono">Degree</b>B.Tech CSE · CGPA {PROFILE.cgpa} · Expected {PROFILE.gradYear}</span>
                <span><b className="mono">Built</b>Central Railway Patient Management System · Temple ERP &amp; Donation Platform</span>
                <span><b className="mono">Honours</b>1st Place, Web Designing Competition · Letter of Appreciation from Central Railway</span>
              </span>
              <span className="idc-sign serif">{PROFILE.name}</span>
              <span className="idc-found mono">If found, say hello · {PROFILE.email}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function About() {
  const facts = [
    { k: "Education", v: `${PROFILE.degree.replace("B.Tech in ", "B.Tech · ")}, Bharati Vidyapeeth (DU) — expected ${PROFILE.gradYear}` },
    { k: "Currently", v: `${PROFILE.currentRole} · ${PROFILE.currentPlace}` },
    { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { k: "Phone", v: PROFILE.phone, href: PROFILE.phoneHref },
  ];
  return (
    <section id="about" className="sec about" aria-labelledby="about-h">
      <style>{`
        .about{padding-top:calc(var(--sec-pad) + 20px);overflow-x:clip}
        .about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:stretch}
        .about-l,.about-r{display:flex;flex-direction:column}
        .about-h{font-size:clamp(44px,5.4vw,84px);margin-bottom:30px}
        .about-p{color:var(--ink-2);font-size:17px;max-width:46ch}
        .about-p+.about-p{margin-top:14px}
        .about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}
        .about-btns .btn{height:48px;padding:0 22px}
        .about-m{position:relative;height:560px}
        .about-rt{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin:6px 0 14px}
        .about-facts>div{padding:16px 0;border-top:1px solid var(--line)}
        .about-facts>div:last-child{border-bottom:1px solid var(--line)}
        .about-facts dt{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:4px}
        .about-facts dd{font-size:16px;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
        .about-facts a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
        .about-facts a:hover{background-size:100% 1px}
        .about-q{margin:auto 0 0;padding-top:28px;font-size:clamp(22px,2.1vw,30px);line-height:1.2;color:var(--ink-2)}

        /* lanyard */
        .ln{position:absolute;left:50%;top:calc(-1 * (var(--sec-pad) + 20px));width:300px;margin-left:-150px}
        .ln-swing{transform-origin:150px 0;will-change:transform;display:flex;flex-direction:column;align-items:center}
        .ln-strap{width:30px;height:calc(var(--sec-pad) + 20px + 52px);overflow:hidden;background:var(--ink);position:relative;box-shadow:inset 3px 0 0 rgba(255,255,255,.07),inset -3px 0 0 rgba(255,255,255,.07)}
        .ln-strap-in{position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;animation:lnscroll 18s linear infinite}
        .ln-strap-in span{writing-mode:vertical-rl;font:500 9px/30px var(--f-mono),monospace;letter-spacing:.18em;color:#d8d6d0;white-space:nowrap;padding:12px 0;transform:rotate(180deg)}
        @keyframes lnscroll{to{transform:translateY(-50%)}}
        .ln-clip{width:26px;height:34px;margin-top:-2px;position:relative;z-index:2;display:grid;justify-items:center}
        .ln-clip::before{content:"";width:22px;height:20px;border-radius:4px 4px 7px 7px;background:linear-gradient(90deg,#8a8a8a,#f2f2f2 45%,#9a9a9a);box-shadow:0 1px 0 rgba(0,0,0,.25)}
        .ln-clip i{position:absolute;bottom:0;width:12px;height:14px;border:2.5px solid #8d8d8d;border-top:0;border-radius:0 0 8px 8px}
        .idc{display:block;width:300px;height:404px;margin-top:-6px;perspective:1400px;text-align:left;border-radius:22px;cursor:pointer}
        .idc-in{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
        .idc.is-flip .idc-in{transform:rotateY(180deg)}
        @media (hover:hover){.idc:hover .idc-in{transform:rotateY(180deg)}.idc.is-flip:hover .idc-in{transform:rotateY(180deg)}}
        .idc-face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;border-radius:22px;background:#fff;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -34px rgba(13,13,13,.4),0 10px 24px -12px rgba(13,13,13,.18)}
        .idc-back{transform:rotateY(180deg);align-items:stretch}
        .idc-band{width:100%;height:44px;background:var(--ink);color:#fff;font:500 11px/44px var(--f-mono),monospace;letter-spacing:.2em;text-align:center;position:relative;flex:none}
        .idc-band i{position:absolute;left:50%;top:-1px;width:46px;height:9px;margin-left:-23px;border-radius:0 0 8px 8px;background:var(--paper)}
        .idc-photo{margin-top:16px;width:128px;height:156px;border-radius:24px;padding:4px;background:linear-gradient(160deg,#fafafa,#8c8a85 55%,#d9d6d0);position:relative;flex:none}
        .idc-photo::before{content:"";position:absolute;inset:-14px;border-radius:34px;background:radial-gradient(closest-side,rgba(13,13,13,.1),transparent);z-index:-1}
        .idc-photo{overflow:hidden;isolation:isolate}
        .idc-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 20%;border-radius:20px;transition:transform 1.2s var(--ease)}
        .idc:hover .idc-photo img{transform:scale(1.07)}
        .idc-name{margin-top:12px;font-weight:700;font-size:18px;letter-spacing:-.03em;line-height:1.1}
        .idc-role{margin-top:4px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .idc-rows{width:calc(100% - 44px);margin-top:12px;display:flex;flex-direction:column;font-size:10.5px}
        .idc-rows>span{display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--line)}
        .idc-rows b{font-weight:400;color:var(--mute);text-transform:uppercase;letter-spacing:.08em}
        .idc-rows em{font-style:normal;color:var(--ink)}
        .idc-foot{width:calc(100% - 44px);margin-top:auto;margin-bottom:14px;display:flex;align-items:flex-end;justify-content:space-between}
        .idc-bars{display:flex;gap:2px;height:24px;align-items:stretch}
        .idc-bars i{display:block;background:var(--ink)}
        .idc-holo{width:30px;height:30px;border-radius:50%;background:conic-gradient(from 20deg,#d9d6d0,#fff,#9a9893,#f1efea,#bdbab4,#fff,#d9d6d0);box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);animation:holo 6s linear infinite}
        @keyframes holo{to{transform:rotate(360deg)}}
        .idc-list{display:flex;flex-direction:column;gap:8px;padding:16px 22px 0;font-size:12.5px;line-height:1.3;color:var(--ink-2)}
        .idc-list>span{display:flex;flex-direction:column;gap:2px}
        .idc-list b{font-weight:400;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .idc-sign{margin:auto 22px 0;font-size:23px;white-space:nowrap;line-height:1;color:var(--ink);border-bottom:1px solid var(--line);padding-bottom:8px}
        .idc-found{margin:10px 22px 18px;font-size:9.5px;letter-spacing:.04em;color:var(--mute);overflow-wrap:anywhere}

        @media (max-width:1060px){
          .about-grid{grid-template-columns:minmax(0,1fr) 300px}
          .about-r{grid-column:1/-1;order:3}
          .about-m{order:2}
        }
        @media (max-width:760px){
          .about{padding-top:var(--sec-pad)}
          .about-grid{grid-template-columns:minmax(0,1fr)}
          .about-m{height:480px;margin-top:40px}
          .ln{top:-60px}
          .ln-strap{height:130px}
          .idc{transform-origin:top center}
        }
        @media (prefers-reduced-motion:reduce){.ln-strap-in,.idc-holo{animation:none}}
      `}</style>
      <div className="wrap about-grid">
        <div className="about-l">
          <p className="tag rv"><b>01</b> — About</p>
          <h2 id="about-h" className="h2 about-h">
            <span className="rv-mask"><span>Hi, I&apos;m</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><em>{PROFILE.first}.</em></span></span>
          </h2>
          <p className="about-p rv" style={{ ["--i" as string]: 2 }}>{PROFILE.resumeSummary}</p>
          <p className="about-p rv" style={{ ["--i" as string]: 3 }}>{PROFILE.extraLine}</p>
          <div className="about-btns rv" style={{ ["--i" as string]: 4 }}>
            <a className="btn btn-primary" href={PROFILE.resume} download>Résumé ↓</a>
            <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>

        <div className="about-m"><Lanyard /></div>

        <div className="about-r">
          <p className="mono about-rt rv">Quick facts</p>
          <dl className="about-facts">
            {facts.map((f, i) => (
              <div key={f.k} className="rv" style={{ ["--i" as string]: i }}>
                <dt className="mono">{f.k}</dt>
                <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="about-q rv" style={{ ["--i" as string]: 5 }}>
            <span className="serif">&ldquo;{PROFILE.quote}&rdquo;</span>
          </blockquote>
        </div>
      </div>

    </section>
  );
}
