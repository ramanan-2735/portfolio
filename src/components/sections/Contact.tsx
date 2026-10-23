"use client";
import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

/** Each letter hops when the cursor passes over it. */
function Hop({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) =>
        ch === " " ? " " : (
          <span key={i} className="hop" aria-hidden="true" onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.classList.remove("go");
            void el.offsetWidth;
            el.classList.add("go");
          }}>{ch}</span>
        ),
      )}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  };
  const ring = "SAY HELLO · SAY HELLO · SAY HELLO · ";

  return (
    <footer id="contact" className="ct cv" aria-labelledby="ct-h">
      <style>{`
        .ct{padding-top:var(--sec-pad);padding-bottom:36px}
        .ct-h{font-weight:700;letter-spacing:-.05em;line-height:.98;font-size:clamp(44px,9.4vw,152px)}
        .ct-line{display:block}
        .ct-line.serif{color:var(--mute);letter-spacing:-.03em}
        .hop{display:inline-block;transition:none}
        .hop.go{animation:hop .6s var(--ease)}
        @keyframes hop{0%{transform:translateY(0)}35%{transform:translateY(-.16em)}70%{transform:translateY(.02em)}100%{transform:translateY(0)}}
        .ct-row{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap;margin-top:clamp(40px,8vh,88px)}
        .ct-main{flex:1 1 420px;min-width:0}
        .ct-mail{display:flex;align-items:center;flex-wrap:wrap;gap:14px}
        .ct-email{font-size:clamp(22px,3.6vw,52px);font-weight:600;letter-spacing:-.04em;line-height:1.1;border-bottom:2px solid var(--ink);overflow-wrap:anywhere;transition:color .4s,border-color .4s}
        .ct-email:hover{color:var(--mute);border-color:var(--mute)}
        .ct-copy{height:34px;padding:0 14px;border-radius:999px;font-size:12px;letter-spacing:.04em;box-shadow:inset 0 0 0 1px rgba(13,13,13,.25);transition:background .4s var(--ease),color .4s var(--ease)}
        .ct-copy:hover{background:var(--ink);color:#fff}
        .ct-links{margin-top:32px;border-top:1px solid var(--line);max-width:560px}
        .ct-links li{display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--line);font-weight:500}
        .ct-links .mono{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding-top:3px}
        .ct-links a{overflow-wrap:anywhere;text-align:right;transition:color .3s}
        .ct-links a:hover{color:var(--mute)}
        .ct-badge{position:relative;width:176px;height:176px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:background .5s var(--ease),color .5s var(--ease)}
        .ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 22s linear infinite}
        .ct-badge text{font-size:13.5px;letter-spacing:.22em;fill:currentColor}
        .ct-badge>span{font-size:30px;transition:transform .5s var(--ease)}
        .ct-badge:hover{background:var(--ink);color:#fff}
        .ct-badge:hover>span{transform:rotate(45deg)}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ct-foot{margin-top:clamp(64px,12vh,120px);padding-top:22px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:12px;letter-spacing:.04em;color:var(--mute)}
        .ct-foot a:hover{color:var(--ink)}
        .ct .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
        @media (max-width:640px){.ct-badge{width:132px;height:132px}.ct-badge text{font-size:15px}.ct-links li{flex-direction:column;gap:2px}.ct-links a{text-align:left}}
      `}</style>
      <div className="wrap">
        <p className="tag rv"><b>07</b> — Contact</p>
        <h2 id="ct-h" className="ct-h" aria-label="Let's build something together.">
          <span className="ct-line"><Hop text="Let's build" /></span>
          <span className="ct-line serif"><Hop text="something together." /></span>
        </h2>

        <div className="ct-row">
          <div className="ct-main">
            <div className="ct-mail rv">
              <a className="ct-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button type="button" className="ct-copy mono" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
              <span className="sr" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
            </div>
            <ul className="ct-links rv" style={{ ["--i" as string]: 1 }}>
              <li><span className="mono">Phone</span><a href={PROFILE.phoneHref}>{PROFILE.phone}</a></li>
              <li><span className="mono">GitHub</span><a href={PROFILE.github} target="_blank" rel="noopener noreferrer">{PROFILE.githubLabel} ↗</a></li>
              <li><span className="mono">LinkedIn</span><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">{PROFILE.linkedinLabel} ↗</a></li>
            </ul>
          </div>

          <a className="ct-badge" href={`mailto:${PROFILE.email}`} aria-label={`${ring.trim()} — send an email`}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs><path id="ct-circ" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" /></defs>
              <text className="mono"><textPath href="#ct-circ">{ring}</textPath></text>
            </svg>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="ct-foot mono">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget("top"); }}>Back to top ↑</a>
          <span>Built with Next.js</span>
        </div>
      </div>

    </footer>
  );
}
