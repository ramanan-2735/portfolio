import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  const n = CERTIFICATIONS.length;
  return (
    <section id="certifications" className="cert cv" aria-labelledby="cert-h">
      <style>{`
        .cert{background:#fff;border-block:1px solid var(--line);padding-block:var(--sec-pad)}
        .cert-in{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
        .cert-l{position:sticky;top:110px}
        .cert-count{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-top:28px}
        .cert-list{border-top:1px solid var(--line)}
        .cert-list li{border-bottom:1px solid var(--line)}
        .cert-list a{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) auto 28px;align-items:center;gap:18px;padding:30px 20px;overflow:hidden;isolation:isolate;transition:color .5s var(--ease)}
        .cert-list a::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
        .cert-list a:hover,.cert-list a:focus-visible{color:#fff}
        .cert-list a:hover::before,.cert-list a:focus-visible::before{transform:scaleX(1)}
        .cert-list a:focus-visible{outline-offset:-3px;outline-color:var(--faint)}
        .cert-n{font-size:12px;color:var(--mute);transition:color .5s}
        .cert-t{font-size:clamp(20px,2.2vw,30px);font-weight:600;letter-spacing:-.03em;line-height:1.1}
        .cert-i{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);transition:color .5s}
        .cert-a{font-size:22px;transform:translate(-14px,14px);opacity:0;transition:transform .6s var(--ease),opacity .5s var(--ease)}
        .cert-list a:hover .cert-a,.cert-list a:focus-visible .cert-a{transform:none;opacity:1}
        .cert-list a:hover .cert-n,.cert-list a:hover .cert-i,.cert-list a:focus-visible .cert-n,.cert-list a:focus-visible .cert-i{color:#bbb}
        @media (max-width:860px){
          .cert-in{grid-template-columns:minmax(0,1fr)}
          .cert-l{position:static}
          .cert-list a{grid-template-columns:34px minmax(0,1fr) 24px;padding:24px 14px}
          .cert-i{grid-column:2;grid-row:2}
        }
      `}</style>
      <div className="wrap cert-in">
        <div className="cert-l">
          <p className="tag rv"><b>04</b> — Certifications</p>
          <h2 id="cert-h" className="h2">
            <span className="rv-mask"><span>Always</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><em>learning.</em></span></span>
          </h2>
          <p className="mono cert-count rv" style={{ ["--i" as string]: 2 }}>{String(n).padStart(2, "0")} {n === 1 ? "certificate" : "certificates"} earned</p>
        </div>
        <ol className="cert-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="rv" style={{ ["--i" as string]: i }}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.title}, ${c.issuer} (opens certificate)`}>
                <span className="cert-n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="cert-t">{c.title}</span>
                <span className="cert-i mono">{c.issuer}</span>
                <span className="cert-a" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

    </section>
  );
}
