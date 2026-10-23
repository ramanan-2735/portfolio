"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO, PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/hooks";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visible = useRef(true);
  const [ready, setReady] = useState(false);

  const tryPlay = useCallback(async () => {
    const v = vid.current;
    if (!v) return;
    try {
      v.muted = false;
      await v.play();
      setSoundOn(true);
      setBlocked(false);
    } catch {
      // autoplay with sound refused: play muted, wait for a gesture
      v.muted = true;
      setSoundOn(false);
      setBlocked(true);
      v.play().catch(() => {});
    }
  }, []);

  // initial autoplay (sound if allowed)
  useEffect(() => {
    if (!HERO.useVideo) return;
    if ((vid.current?.readyState ?? 0) >= 2) setReady(true);
    if (prefersReducedMotion()) { setBlocked(true); return; }
    tryPlay();
  }, [tryPlay]);

  // unlock sound on the first gesture
  useEffect(() => {
    if (!HERO.useVideo || !blocked || prefersReducedMotion()) return;
    const unlock = () => {
      const v = vid.current;
      if (!v) return;
      v.muted = false;
      v.play().then(() => { setSoundOn(true); setBlocked(false); }).catch(() => { v.muted = true; });
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    evs.forEach((e) => window.addEventListener(e, unlock, { once: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, unlock));
  }, [blocked]);

  // pause (and silence) when the hero is mostly out of view
  useEffect(() => {
    const el = root.current;
    if (!HERO.useVideo || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = vid.current;
        if (!v) return;
        const show = e.intersectionRatio >= 0.35;
        visible.current = show;
        if (!show) v.pause();
        else if (v.paused && !prefersReducedMotion()) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.muted || v.paused) {
      v.muted = false;
      v.play().then(() => { setSoundOn(true); setBlocked(false); }).catch(() => {});
    } else {
      v.muted = true;
      setSoundOn(false);
    }
  };

  return (
    <section id="top" ref={root} className="hero" aria-label="Introduction">
      <style>{`
        .hero{position:relative;min-height:100svh;overflow:clip;display:flex;flex-direction:column;justify-content:flex-end}
        .hero-ghost{position:absolute;left:0;right:0;top:50%;transform:translateY(-68%);text-align:center;font-weight:800;font-size:19.5vw;line-height:.8;letter-spacing:-.05em;color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.16);user-select:none;pointer-events:none;white-space:nowrap}
        .hero-stage{position:absolute;inset:0;display:flex;justify-content:center;align-items:flex-end;pointer-events:none}
        .hero-frame{position:relative;height:min(96svh,1040px);aspect-ratio:768/960}
        .hero-video{display:block;height:100%;width:100%;max-width:none;object-fit:cover;mix-blend-mode:multiply}
        .hero-poster{position:absolute;inset:0}
        .hero-poster.off{visibility:hidden}
        .hero-frame video{position:relative}
        .hero-copy{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-bottom:clamp(28px,6vh,64px)}
        .hero-text{max-width:min(46vw,560px)}
        .hero-kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:22px}
        .hero h1{font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(46px,6.2vw,96px)}
        .hero h1 .rv-mask{padding-bottom:.16em;margin-bottom:-.12em}
        .hero h1 em{color:var(--mute);letter-spacing:-.02em}
        .hero-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:34px}
        .hero-side{display:flex;flex-direction:column;align-items:flex-end;gap:18px}
        .hero-scroll{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .hero-sound{position:relative;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease),background .4s}
        .hero-sound:hover{transform:scale(1.08);background:#2a2a2a}
        .hero-sound.ping::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:hping 2s var(--ease) infinite}
        @keyframes hping{0%{transform:scale(1);opacity:.55}100%{transform:scale(2.1);opacity:0}}
        .hero .rv-mask>span{animation:hrise 1.1s var(--ease) calc(var(--i,0)*90ms + 60ms) both}
        .hero .rv{animation:hfade 1s var(--ease) calc(var(--i,0)*80ms + 120ms) both}
        @keyframes hrise{from{transform:translateY(112%)}to{transform:none}}
        @keyframes hfade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
        @media (max-width:860px){
          .hero{justify-content:flex-start;padding-top:84px}
          .hero-ghost{top:calc(84px + 31svh);font-size:19.5vw}
          .hero-stage{position:relative;inset:auto;align-items:flex-start}
          .hero-frame{height:62svh}
          .hero-copy{position:static;flex-direction:column;align-items:flex-start;padding-top:8px;padding-bottom:44px}
          .hero-text{max-width:none}
          .hero h1{font-size:clamp(44px,13vw,72px)}
          .hero-cta{margin-top:24px}
          .hero-side{position:absolute;right:var(--gutter);top:100px;z-index:3}
          .hero-scroll{display:none}
        }
      `}</style>
      <div className="hero-ghost" aria-hidden="true">{PROFILE.first.toUpperCase()}</div>

      <div className="hero-stage">
        <div className="hero-frame">
        {!HERO.useVideo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-video" src="/hero/still.webp" alt={`Portrait of ${PROFILE.name}`} width={768} height={960} fetchPriority="high" decoding="async" />
        ) : (
        <>
        {/* still shown (and used for LCP) until the first video frame is ready */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`hero-video hero-poster ${ready ? "off" : ""}`} src="/hero/poster.webp" alt="" width={768} height={960} fetchPriority="high" decoding="async" />
        <video
          ref={vid}
          onLoadedData={() => setReady(true)}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/poster.webp"
          aria-label={`${PROFILE.name} introducing themself`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        </>
        )}
        </div>
      </div>

      <div className="wrap hero-copy">
        <div className="hero-text">
          <p className="mono hero-kicker rv">Portfolio · {PROFILE.name}</p>
          <h1>
            <span className="sr">{PROFILE.name} — </span>
            <span className="rv-mask" style={{ ["--i" as string]: 0 }}><span>Full Stack</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><em className="serif">Developer.</em></span></span>
          </h1>
          <div className="hero-cta rv" style={{ ["--i" as string]: 3 }}>
            <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("work"); }}>Explore work</a>
            <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>Let&apos;s talk</a>
            <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé ↓</a>
          </div>
        </div>

        <div className="hero-side">
          {HERO.useVideo && (
          <button
            type="button"
            className={`hero-sound ${blocked ? "ping" : ""}`}
            onClick={toggle}
            aria-label={soundOn ? "Mute intro" : "Play intro with sound"}
          >
            {soundOn ? (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.6" height="12" rx="1" fill="currentColor" /><rect x="9.4" y="2" width="3.6" height="12" rx="1" fill="currentColor" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.4v11.2c0 .5.5.8.9.5l8.6-5.6c.4-.3.4-.8 0-1.1L4.9 1.9c-.4-.3-.9 0-.9.5Z" fill="currentColor" /></svg>
            )}
          </button>
          )}
          <span className="mono hero-scroll" aria-hidden="true">Scroll ↓</span>
        </div>
      </div>

    </section>
  );
}
