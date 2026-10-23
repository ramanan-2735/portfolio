"use client";
import { useState, type ComponentType } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import TechLogo from "../ui/TechLogo";

const bar = (w: string, h = 8) => <i className="ui-bar" style={{ width: w, height: h }} />;

/** Pure CSS/JSX mock of what the product does. Not a screenshot. */
function PatientUI() {
  return (
    <div className="ui ui-win">
      <div className="ui-top"><i /><i /><i /><span className="ui-url mono">patients</span></div>
      <div className="ui-main">
        <div className="ui-side">{[0, 1, 2, 3].map((i) => <span key={i} className={i === 1 ? "on" : ""} />)}</div>
        <div className="ui-col">
          <div className="ui-row ui-head">{bar("38%", 10)}<span className="ui-pill">Appointments</span></div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="ui-row"><span className="ui-av" />{bar(`${46 - i * 8}%`)}<span className="ui-chip" /></div>
          ))}
          <div className="ui-xray" aria-hidden="true">
            <svg viewBox="0 0 160 90" width="100%" height="100%">
              <rect width="160" height="90" fill="#1a1a1a" />
              <path d="M50 78c-6-24-4-46 10-58 8-6 16-6 22 0 12 10 16 34 10 58" fill="none" stroke="#6a6a6a" strokeWidth="2" />
              <path d="M66 28v50M78 24v54M90 28v50" stroke="#4a4a4a" strokeWidth="1.4" />
              <circle cx="82" cy="40" r="14" fill="none" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d="m94 30 22-12" stroke="#fff" strokeWidth="1.2" />
            </svg>
            <span className="ui-tag mono">X-ray annotation</span>
          </div>
          <div className="ui-row ui-actions"><span className="ui-btn">Prescription PDF</span><span className="ui-btn ghost">WhatsApp</span></div>
        </div>
      </div>
    </div>
  );
}

function TempleUI() {
  const bars = ["46%", "72%", "58%", "88%", "64%", "78%"];
  return (
    <div className="ui ui-win">
      <div className="ui-top"><i /><i /><i /><span className="ui-url mono">dashboard</span></div>
      <div className="ui-main">
        <div className="ui-side">{[0, 1, 2, 3].map((i) => <span key={i} className={i === 0 ? "on" : ""} />)}</div>
        <div className="ui-col">
          <div className="ui-row ui-head">{bar("34%", 10)}<span className="ui-pill">Reports</span></div>
          <div className="ui-chart" aria-hidden="true">
            {bars.map((h, i) => <i key={i} style={{ height: h }} />)}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="ui-row"><span className="ui-av sq" />{bar(`${52 - i * 9}%`)}<span className="ui-chip" /></div>
          ))}
          <div className="ui-row ui-actions"><span className="ui-btn">Invoice PDF</span><span className="ui-btn ghost">Excel</span><span className="ui-btn ghost">Receipt</span></div>
          <div className="ui-roles mono"><span>Super Admin</span><span>Admin</span><span>Staff</span></div>
        </div>
      </div>
    </div>
  );
}

/** Security scan card: email in, threat score and signal chips out. */
function NetraUI() {
  const factors = [["Sender", 62], ["Links", 41], ["Urgency", 28], ["Wording", 18]];
  return (
    <div className="ui ui-win">
      <div className="ui-top"><i /><i /><i /><span className="ui-url mono">scan / inbound</span></div>
      <div className="ui-col">
        <div className="ui-mail">
          <span className="mono ui-lbl">Subject</span>
          <span className="ui-mail-s">Your invoice for March is ready</span>
        </div>
        <div className="ui-score">
          <div>
            <span className="mono ui-lbl">Threat score</span>
            <span className="ui-num">0.04</span>
          </div>
          <span className="ui-pill">Legitimate</span>
        </div>
        <div className="ui-meter" aria-hidden="true"><i style={{ width: "4%" }} /></div>
        <div className="ui-chips">
          <span className="ui-chip2">SPF / DKIM: <b>Pass</b></span>
          <span className="ui-chip2">Lookalike: <b>None</b></span>
          <span className="ui-chip2">TLD: <b>Low risk</b></span>
        </div>
        <div className="ui-factors" aria-hidden="true">
          {factors.map(([k, v]) => (
            <div key={k} className="ui-frow"><span className="mono">{k}</span><div><i style={{ width: `${v}%` }} /></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Editorial practice card with a consultation booking preview. */
function KhirbhaUI() {
  return (
    <div className="ui ui-win">
      <div className="ui-top"><i /><i /><i /><span className="ui-url mono">practice</span></div>
      <div className="ui-col">
        <div className="ui-row ui-head">
          <span className="ui-serif">Practice areas</span>
          <span className="ui-badge mono"><i aria-hidden="true">✓</i> Verified advocate</span>
        </div>
        <div className="ui-areas">
          {["Civil", "Criminal", "Corporate"].map((a, i) => (
            <div key={a} className={`ui-area ${i === 1 ? "on" : ""}`}><span className="mono">0{i + 1}</span>{a}</div>
          ))}
        </div>
        <div className="ui-modal">
          <span className="mono ui-lbl">Book a consultation</span>
          <div className="ui-field" />
          <div className="ui-field short" />
          <div className="ui-row ui-actions"><span className="ui-btn">Request slot</span><span className="ui-btn ghost">Call</span></div>
        </div>
      </div>
    </div>
  );
}

/** Barber booking interface with service picks, slots and owner controls. */
function SalonUI() {
  return (
    <div className="ui ui-win">
      <div className="ui-top"><i /><i /><i /><span className="ui-url mono">book</span></div>
      <div className="ui-col">
        <div className="ui-row ui-head">
          <span className="ui-serif">Services</span>
          <span className="ui-status mono">Confirmed</span>
        </div>
        <div className="ui-svc">
          <span className="on">Haircut &amp; Beard trim</span>
          <span>Beard trim</span>
          <span>Hot towel</span>
        </div>
        <span className="mono ui-lbl">Pick a time</span>
        <div className="ui-slots">
          <span>10:00 AM</span><span className="on">11:30 AM</span><span>1:00 PM</span><span>3:15 PM</span>
        </div>
        <div className="ui-owner">
          <span className="mono ui-lbl">Owner</span>
          <div className="ui-row ui-actions"><span className="ui-btn">Approve</span><span className="ui-btn ghost">Reschedule</span></div>
        </div>
      </div>
    </div>
  );
}

const UI_BY_ID: Record<Project["id"], ComponentType> = {
  "central-railway": PatientUI,
  "temple-erp": TempleUI,
  netra: NetraUI,
  "khirbha-portfolio": KhirbhaUI,
  "black-head-salon": SalonUI,
};

function Panel({ p, open, onOpen }: { p: Project; open: boolean; onOpen: () => void }) {
  const Illustration = UI_BY_ID[p.id];
  return (
    <article className={`wk-p ${open ? "open" : ""}`} onMouseEnter={() => window.matchMedia("(hover:hover)").matches && onOpen()}>
      <button type="button" className="wk-spine" onClick={onOpen} onFocus={onOpen} aria-expanded={open} aria-controls={`wk-${p.id}`} tabIndex={open ? -1 : 0}>
        <span className="wk-sn mono">{p.index}</span>
        <span className="wk-st">{p.title}</span>
        <span className="wk-plus" aria-hidden="true">+</span>
      </button>

      <div className="wk-open" id={`wk-${p.id}`} {...(!open ? { inert: true } : {})}>
        <div className="wk-in">
          <div className="wk-l">
            <p className="mono wk-k"><b>{p.index}</b> — {p.kicker}</p>
            <h3>{p.title}</h3>
            <p className="wk-d">{p.description}</p>
            <ul className="wk-f">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <ul className="wk-t" aria-label="Technologies">
              {p.tech.map((t) => (
                <li key={t.name}><TechLogo logo={t.logo} concept="ejs" size={15} />{t.name}</li>
              ))}
            </ul>
            {p.github && <a className="btn btn-primary wk-gh" href={p.github} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>}
          </div>
          <div className="wk-r">
            <div className="wk-ui"><Illustration /></div>
            <p className="mono wk-cap">Illustrative UI</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" className="sec work cv" aria-labelledby="work-h">
      <style>{`
        .wk{display:flex;gap:10px;height:min(84svh,660px);margin-top:clamp(40px,6vh,72px)}
        .wk-p{position:relative;flex:1;min-width:0;border-radius:26px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex .9s var(--ease),box-shadow .6s var(--ease)}
        .wk-p.open{flex:8;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -44px rgba(13,13,13,.35)}
        .wk-spine{position:absolute;inset:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 0;transition:opacity .4s var(--ease),background .4s;cursor:pointer}
        .wk-p.open .wk-spine{opacity:0;pointer-events:none}
        .wk-p:not(.open) .wk-spine:hover{background:#faf9f6}
        .wk-sn{font-size:12px;color:var(--mute);letter-spacing:.06em}
        .wk-st{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:clamp(13px,1.15vw,17px);letter-spacing:-.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:72%}
        .wk-plus{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:22px;line-height:1;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:transform .6s var(--ease),background .4s,color .4s}
        .wk-spine:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
        .wk-open{position:absolute;inset:0;opacity:0;transition:opacity .4s var(--ease)}
        .wk-p.open .wk-open{opacity:1;transition:opacity .7s var(--ease) .35s}
        .wk-in{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(20px,3vw,48px);height:100%;min-width:720px;padding:clamp(24px,3vw,44px)}
        .wk-l{display:flex;flex-direction:column;min-height:0;overflow-y:auto;scrollbar-width:none}
        .wk-l::-webkit-scrollbar{display:none}
        .wk-k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:16px}
        .wk-k b{color:var(--ink);font-weight:500}
        .wk-l h3{font-weight:700;font-size:clamp(26px,3.1vw,46px);letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
        .wk-d{margin-top:12px;color:var(--ink-2);font-size:14.5px;line-height:1.45;max-width:54ch}
        .wk-f{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:5px 20px;font-size:13px;color:var(--ink-2);line-height:1.3}
        .wk-f li{padding-left:16px;position:relative}
        .wk-f li::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:1px;background:var(--ink)}
        .wk-t{margin-top:auto;padding-top:14px;display:flex;flex-wrap:wrap;gap:6px}
        .wk-t li{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px 0 9px;border-radius:999px;font-size:12.5px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);background:#fcfbf9}
        .wk-t svg{width:15px;height:15px}
        .wk-gh{align-self:flex-start;margin-top:12px;height:42px}
        .wk-r{position:relative;display:flex;flex-direction:column;min-height:0}
        .wk-ui{flex:1;min-height:0;border-radius:20px;background:var(--paper);padding:clamp(12px,1.6vw,22px);display:grid;place-items:center;clip-path:inset(0 100% 0 0 round 20px);transition:clip-path 1.1s var(--ease) .3s;overflow:hidden}
        .wk-p.open .wk-ui{clip-path:inset(0 0 0 0 round 20px)}
        .wk-cap{margin-top:10px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);text-align:right}

        .ui{width:100%;max-width:470px;border-radius:14px;background:#fff;box-shadow:0 20px 40px -24px rgba(13,13,13,.4),inset 0 0 0 1px var(--line);overflow:hidden}
        .ui-top{display:flex;align-items:center;gap:5px;height:28px;padding:0 12px;background:#f1efeb;border-bottom:1px solid var(--line)}
        .ui-top i{width:8px;height:8px;border-radius:50%;background:#cfccc6}
        .ui-url{margin-left:10px;font-size:9.5px;color:var(--mute);background:#fff;border-radius:99px;padding:2px 12px}
        .ui-main{display:flex}
        .ui-side{width:44px;padding:12px 0;display:flex;flex-direction:column;align-items:center;gap:10px;border-right:1px solid var(--line);background:#faf9f6}
        .ui-side span{width:18px;height:18px;border-radius:6px;background:#dedbd5}
        .ui-side span.on{background:var(--ink)}
        .ui-col{flex:1;min-width:0;padding:14px;display:flex;flex-direction:column;gap:9px}
        .ui-row{display:flex;align-items:center;gap:9px}
        .ui-head{justify-content:space-between}
        .ui-bar{display:block;border-radius:99px;background:#dedbd5}
        .ui-pill{font-size:9.5px;font-weight:600;padding:4px 10px;border-radius:99px;background:var(--ink);color:#fff}
        .ui-av{width:20px;height:20px;border-radius:50%;background:#bdb9b2;flex:none}
        .ui-av.sq{border-radius:6px}
        .ui-chip{margin-left:auto;width:34px;height:14px;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2)}
        .ui-xray{position:relative;height:96px;border-radius:10px;overflow:hidden}
        .ui-tag{position:absolute;left:8px;bottom:6px;font-size:8.5px;color:#fff;background:rgba(255,255,255,.16);padding:2px 7px;border-radius:99px}
        .ui-actions{gap:6px;flex-wrap:wrap}
        .ui-btn{font-size:9.5px;font-weight:600;padding:6px 11px;border-radius:99px;background:var(--ink);color:#fff}
        .ui-btn.ghost{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px rgba(13,13,13,.25)}
        .ui-chart{height:92px;display:flex;align-items:flex-end;gap:8px;padding:8px;border-radius:10px;background:#faf9f6;box-shadow:inset 0 0 0 1px var(--line)}
        .ui-chart i{flex:1;border-radius:4px 4px 0 0;background:#bdb9b2}
        .ui-chart i:nth-child(4){background:var(--ink)}
        .ui-roles{display:flex;gap:5px;font-size:8.5px;letter-spacing:.04em;color:var(--mute)}
        .ui-roles span{padding:3px 8px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line)}
        .ui-mail{display:flex;flex-direction:column;gap:4px;padding:12px 14px;border-radius:10px;background:#faf9f6;box-shadow:inset 0 0 0 1px var(--line)}
        .ui-lbl{font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .ui-mail-s{font-size:12.5px;font-weight:600;letter-spacing:-.01em}
        .ui-score{display:flex;justify-content:space-between;align-items:flex-end;gap:10px}
        .ui-score>div{display:flex;flex-direction:column;gap:2px}
        .ui-num{font-size:34px;font-weight:700;letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums}
        .ui-meter{height:6px;border-radius:99px;background:#e6e3dd;overflow:hidden}
        .ui-meter i{display:block;height:100%;border-radius:99px;background:var(--ink)}
        .ui-chips{display:flex;flex-wrap:wrap;gap:5px}
        .ui-chip2{font-size:9px;padding:4px 9px;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);color:var(--ink-2)}
        .ui-chip2 b{font-weight:600;color:var(--ink)}
        .ui-factors{display:flex;flex-direction:column;gap:5px}
        .ui-frow{display:grid;grid-template-columns:58px 1fr;align-items:center;gap:8px;font-size:8.5px;color:var(--mute)}
        .ui-frow div{height:7px;border-radius:99px;background:#e6e3dd;overflow:hidden}
        .ui-frow i{display:block;height:100%;border-radius:99px;background:var(--ink)}
        .ui-serif{font-family:var(--f-serif),Georgia,serif;font-style:italic;font-size:17px;letter-spacing:-.01em}
        .ui-badge{display:inline-flex;align-items:center;gap:5px;font-size:8.5px;padding:4px 9px;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2)}
        .ui-badge i{font-style:normal;width:13px;height:13px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:8px}
        .ui-areas{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
        .ui-area{display:flex;flex-direction:column;gap:14px;padding:10px;border-radius:10px;font-size:11.5px;font-weight:600;box-shadow:inset 0 0 0 1px var(--line);background:#fff}
        .ui-area span{font-size:8px;font-weight:400;color:var(--mute)}
        .ui-area.on{background:var(--ink);color:#fff;box-shadow:none}
        .ui-area.on span{color:#bbb}
        .ui-modal{display:flex;flex-direction:column;gap:7px;padding:12px;border-radius:12px;background:#faf9f6;box-shadow:inset 0 0 0 1px var(--line)}
        .ui-field{height:18px;border-radius:6px;background:#fff;box-shadow:inset 0 0 0 1px rgba(13,13,13,.14)}
        .ui-field.short{width:60%}
        .ui-status{font-size:8.5px;padding:4px 9px;border-radius:99px;background:var(--ink);color:#fff}
        .ui-svc{display:flex;flex-direction:column;gap:5px}
        .ui-svc span{font-size:10.5px;padding:7px 10px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--line);background:#fff;color:var(--ink-2)}
        .ui-svc span.on{box-shadow:inset 0 0 0 1.5px var(--ink);color:var(--ink);font-weight:600}
        .ui-slots{display:flex;flex-wrap:wrap;gap:5px}
        .ui-slots span{font-size:9.5px;padding:5px 10px;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2)}
        .ui-slots span.on{background:var(--ink);color:#fff;box-shadow:none}
        .ui-owner{display:flex;flex-direction:column;gap:6px;padding-top:6px;border-top:1px solid var(--line)}

        @media (max-width:900px){
          .wk{flex-direction:column;height:auto;gap:8px}
          .wk-p,.wk-p.open{flex:none;transition:box-shadow .6s var(--ease)}
          .wk-spine{position:relative;inset:auto;flex-direction:row;height:76px;padding:0 18px;gap:14px;justify-content:flex-start}
          .wk-p.open .wk-spine{display:none}
          .wk-st{writing-mode:horizontal-tb;transform:none;max-height:none;font-size:16px;flex:1;text-align:left;white-space:normal;line-height:1.15}
          .wk-open{position:relative;inset:auto;display:grid;grid-template-rows:0fr;opacity:1;transition:grid-template-rows .8s var(--ease)}
          .wk-p.open .wk-open{grid-template-rows:1fr;transition:grid-template-rows .8s var(--ease)}
          .wk-open>.wk-in{overflow:hidden;min-height:0}
          .wk-in{min-width:0;grid-template-columns:minmax(0,1fr);height:auto;padding:0 20px}
          .wk-p.open .wk-in{padding:24px 20px}
          .wk-l{overflow:visible}
          .wk-f{grid-template-columns:1fr}
          .wk-ui{height:300px;flex:none}
          .wk-in{align-content:start}
        }
      `}</style>
      <div className="wrap">
        <p className="tag rv"><b>03</b> — Selected work</p>
        <h2 id="work-h" className="h2">
          <span className="rv-mask"><span>Things I&apos;ve</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><em>built.</em></span></span>
        </h2>
        <div className="wk rv" style={{ ["--i" as string]: 2 }}>
          {PROJECTS.map((p, i) => <Panel key={p.id} p={p} open={open === i} onOpen={() => setOpen(i)} />)}
        </div>
      </div>

    </section>
  );
}
