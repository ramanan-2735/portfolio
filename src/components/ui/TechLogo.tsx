/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

/** Official devicon "original" SVGs, copied to /public/logos (MIT, see LICENSE-devicon.txt). value = tint for the soft glow. */
export const BRAND: Record<string, string> = {
  typescript: "#3178c6", javascript: "#f7df1e", python: "#3776ab", react: "#61dafb", nextjs: "#0d0d0d",
  html5: "#e34f26", css3: "#1572b6", tailwindcss: "#38bdf8", nodejs: "#5fa04e", express: "#0d0d0d",
  postgresql: "#336791", prisma: "#0c344b", docker: "#2496ed", linux: "#fcc624", git: "#f05032",
  github: "#0d0d0d", postman: "#ff6c37", google: "#4285f4", railway: "#0d0d0d",
  antigravity: "#1a73e8", claude: "#d97757", n8n: "#ea4b71",
  pytorch: "#ee4c2c", fastapi: "#009688", playwright: "#2ead33", vercel: "#0d0d0d",
};

const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Thin 24px line icons for skills that have no brand mark, plus achievement icons. */
export const CONCEPT: Record<string, ReactNode> = {
  database: (<g {...L}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></g>),
  api: (<g {...L}><path d="M8 7 3 12l5 5M16 7l5 5-5 5M14 5l-4 14" /></g>),
  layers: (<g {...L}><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12.5l9 5 9-5M3 16.5l9 5 9-5" /></g>),
  gauge: (<g {...L}><path d="M4 17a8 8 0 1 1 16 0" /><path d="m12 17 4-6" /><circle cx="12" cy="17" r="1" /></g>),
  key: (<g {...L}><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M16 7l3 3M14 9l2 2" /></g>),
  shield: (<g {...L}><path d="M12 3 4 6v6c0 4.5 3.3 8 8 9 4.7-1 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></g>),
  rocket: (<g {...L}><path d="M12 3c3.5 2 5 5.5 5 9l-2 3H9l-2-3c0-3.5 1.5-7 5-9Z" /><circle cx="12" cy="10" r="1.6" /><path d="m7 13-3 3 3 .5M17 13l3 3-3 .5M10 18.5 12 22l2-3.5" /></g>),
  cloud: (<g {...L}><path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17 9.5a4.2 4.2 0 0 1 0 8.5H7Z" /></g>),
  check: (<g {...L}><rect x="4" y="4" width="16" height="16" rx="4" /><path d="m8.5 12.3 2.6 2.6 4.6-5.4" /></g>),
  bug: (<g {...L}><rect x="8" y="8" width="8" height="12" rx="4" /><path d="M9 8a3 3 0 0 1 6 0M4 13h4M16 13h4M5 7l3 3M19 7l-3 3M5 20l3-3M19 20l-3-3M12 12v8" /></g>),
  scale: (<g {...L}><path d="M4 20V14M10 20V9M16 20V5M3 20h18" /><path d="m4 10 6-4 6-2" strokeDasharray="1 2.5" /></g>),
  trophy: (<g {...L}><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4c0 3 1.2 4.5 4 5M16 6h4c0 3-1.2 4.5-4 5M12 13v4M8.5 20h7M10 17h4" /></g>),
  railway: (<g {...L}><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M6 11h12M9 20l-2 1.5M15 20l2 1.5M9 20h6" /><circle cx="9.5" cy="14" r=".6" /><circle cx="14.5" cy="14" r=".6" /></g>),
  school: (<g {...L}><path d="m3 9 9-5 9 5-9 5-9-5ZM7 11.5V16c0 1.3 2.2 2.5 5 2.5s5-1.2 5-2.5v-4.5" /></g>),
  users: (<g {...L}><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.4-3 2.7-5 5.5-5s5.1 2 5.5 5M16 5.2a3 3 0 0 1 0 5.6M17.5 14.3c1.8.6 3 2.2 3.3 4.7" /></g>),
  cap: (<g {...L}><path d="m3 9 9-5 9 5-9 5-9-5ZM6 11v5c3 2.5 9 2.5 12 0v-5M21 9v6" /></g>),
  paper: (<g {...L}><path d="M6 3h8l4 4v14H6V3ZM14 3v4h4M9 12h6M9 15.5h6M9 8.5h2" /></g>),
  ejs: (<g {...L}><path d="M8 7 3 12l5 5M16 7l5 5-5 5" /></g>),
};

export const isBrand = (k?: string): k is string => !!k && k in BRAND;
export const isConcept = (k?: string): k is string => !!k && k in CONCEPT;

export function glowOf(k?: string) {
  return isBrand(k) ? BRAND[k] : "#0d0d0d";
}

export default function TechLogo({ logo, concept, size = 32, title }: { logo?: string; concept?: string; size?: number; title?: string }) {
  if (isBrand(logo)) {
    return <img src={`/logos/${logo}.svg`} width={size} height={size} alt={title ?? ""} aria-hidden={title ? undefined : true} draggable={false} style={{ width: size, height: size }} />;
  }
  const c = isConcept(concept) ? concept : "ejs";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} style={{ color: "var(--ink-2)" }}>
      {CONCEPT[c]}
    </svg>
  );
}
