// Chrome trace of page load under 4x CPU throttle; prints the heaviest main-thread events.
import { chromium } from "playwright";
import { readFileSync } from "fs";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true });
const p = await ctx.newPage();
const c = await ctx.newCDPSession(p);
await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });
if (process.env.CSS) await p.addInitScript((css) => document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); }), process.env.CSS);
await b.startTracing(p, { path: "shots/trace.json", categories: ["devtools.timeline", "v8.execute", "disabled-by-default-devtools.timeline"] });
await p.goto("http://localhost:3100", { waitUntil: "load" });
await p.waitForTimeout(3500);
await b.stopTracing();
const t = JSON.parse(readFileSync("shots/trace.json", "utf8")).traceEvents.filter((e) => e.ph === "X" && e.dur > 20000);
t.sort((a, b) => b.dur - a.dur);
for (const e of t.slice(0, 25)) console.log((e.dur / 1000).toFixed(0).padStart(5), "ms", e.name, e.args?.data?.url?.slice(-50) ?? e.args?.beginData?.dirtyObjects ?? "", (e.args?.data?.functionName ?? ""));
await b.close();
