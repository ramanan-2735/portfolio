"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, SKILL_GROUPS } from "@/lib/data";
import { useInView, useMedia } from "@/lib/hooks";
import TechLogo, { glowOf, isBrand } from "../ui/TechLogo";

export default function Skills() {
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInView(grid, { threshold: 0.12 });
  const mobile = useMedia("(max-width: 860px)");
  const cols = mobile ? 4 : 8;
  const [family, setFamily] = useState<string>("All");
  const [sel, setSel] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, [seen]);

  const tiles = useMemo(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family, n: ++n })));
  }, []);
  const cur = tiles[sel];
  const used = (cur.projects ?? []).map((id) => PROJECTS.find((p) => p.id === id)?.title).filter(Boolean) as string[];

  return (
    <section id="skills" className="sec skills cv" aria-labelledby="skills-h">
      <style>{`
        .sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin:44px 0 28px}
        .sk-chips button{height:38px;padding:0 16px;border-radius:999px;font-size:13.5px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .sk-chips button:hover{transform:translateY(-1px);background:#fff}
        .sk-chips button.on{background:var(--ink);color:#fff;box-shadow:none}
        .sk-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:28px;align-items:start}
        .sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
        .sk-tile{position:relative;aspect-ratio:1/1.08;min-width:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);padding:9px 10px;text-align:left;display:flex;flex-direction:column;overflow:hidden;
          opacity:0;transform:translateY(14px) scale(.96);transition:opacity .8s var(--ease),transform .8s var(--ease),background .4s var(--ease),color .4s var(--ease),box-shadow .4s}
        .sk-tile.in{opacity:1;transform:none}
        .sk-tile.in.dim{opacity:.22;transform:scale(.97)}
        .sk-tile.in:hover,.sk-tile.sel{background:var(--ink);color:#fff;transform:translateY(-3px)}
        .sk-tile.dim:hover{opacity:.7}
        .sk-n{font-size:10px;color:var(--mute);transition:color .3s}
        .sk-sym{font-weight:700;font-size:clamp(20px,2.6vw,34px);letter-spacing:-.04em;line-height:1;margin-top:auto}
        .sk-name{font-size:11px;font-weight:500;line-height:1.15;margin-top:5px;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .sk-fam{font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sk-tile:hover .sk-n,.sk-tile.sel .sk-n,.sk-tile:hover .sk-fam,.sk-tile.sel .sk-fam{color:#c4c2bc}
        .sk-insp{position:sticky;top:96px;padding:24px;min-height:440px;display:flex;flex-direction:column;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -36px rgba(13,13,13,.3)}
        .sk-logo{height:190px;display:grid;place-items:center;position:relative;margin-bottom:12px}
        .sk-logo::before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--g) 18%,transparent),transparent);transition:background .6s}
        .sk-pop{position:relative;animation:skpop .7s var(--ease)}
        @keyframes skpop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}
        .sk-i-n{font-size:11px;letter-spacing:.08em;color:var(--mute)}
        .sk-insp h3{font-size:28px;font-weight:700;letter-spacing:-.04em;line-height:1.05;margin-top:6px}
        .sk-i-f{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-top:8px}
        .sk-i-p{margin-top:auto;padding-top:20px;border-top:1px solid var(--line)}
        .sk-i-p .mono{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:6px}
        .sk-i-p li{font-size:14px;line-height:1.3;padding:3px 0;font-weight:500}
        .sk-none{font-size:14px;color:var(--mute)}
        @media (max-width:1100px){.sk-name{font-size:10px}}
        @media (max-width:860px){
          .sk-body{grid-template-columns:minmax(0,1fr)}
          .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
          .sk-insp{position:static;min-height:0;order:2}
          .sk-sym{font-size:24px}
        }
      `}</style>
      <div className="wrap">
        <p className="tag rv"><b>02</b> — Skills</p>
        <h2 id="skills-h" className="h2">
          <span className="rv-mask"><span>The periodic table</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span>of my <em>stack.</em></span></span>
        </h2>

        <div className="sk-chips rv" role="group" aria-label="Filter skills by family" style={{ ["--i" as string]: 2 }}>
          {["All", ...SKILL_GROUPS.map((g) => g.family)].map((f) => (
            <button key={f} type="button" className={family === f ? "on" : ""} aria-pressed={family === f} onClick={() => setFamily(f)}>{f}</button>
          ))}
        </div>

        <div className="sk-body">
          <div className="sk-grid" ref={grid} role="list">
            {tiles.map((t, i) => {
              const dim = family !== "All" && t.family !== family;
              const delay = ((Math.floor(i / cols)) + (i % cols)) * 40;
              return (
                <button
                  key={t.name}
                  role="listitem"
                  type="button"
                  className={`sk-tile ${seen ? "in" : ""} ${dim ? "dim" : ""} ${sel === i ? "sel" : ""}`}
                  style={{ transitionDelay: seen && !done ? `${delay}ms, ${delay}ms, 0s` : "0s" }}
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  onClick={() => setSel(i)}
                  aria-label={`${t.name}, ${t.family}`}
                >
                  <span className="sk-n mono">{t.n}</span>
                  <span className="sk-sym">{t.symbol}</span>
                  <span className="sk-name">{t.name}</span>
                  <span className="sk-fam mono">{t.family}</span>
                </button>
              );
            })}
          </div>

          <aside className="sk-insp card" aria-live="polite" aria-label="Skill inspector">
            <div className="sk-logo" style={{ ["--g" as string]: glowOf(cur.logo) }}>
              <div key={cur.name} className="sk-pop"><TechLogo logo={cur.logo} concept={cur.concept} size={150} title={cur.name} /></div>
            </div>
            <p className="mono sk-i-n">{String(cur.n).padStart(2, "0")} · {cur.symbol}</p>
            <h3>{cur.name}</h3>
            <p className="mono sk-i-f">{cur.family}{isBrand(cur.logo) ? "" : " · concept"}</p>
            <div className="sk-i-p">
              <p className="mono">Used in</p>
              {used.length ? <ul>{used.map((u) => <li key={u}>{u}</li>)}</ul> : <p className="sk-none">Listed under Technical Skills.</p>}
            </div>
          </aside>
        </div>
      </div>

    </section>
  );
}
