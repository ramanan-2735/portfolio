// Rough main-thread probe under 4x CPU throttle. usage: node scripts/perf-probe.mjs
import { chromium } from "playwright";
const variants = { base: "", noAnim: "*{animation:none!important;transition:none!important}", noRvMask: ".rv-mask>span{transition:none!important}", noSticky: ".ach-pin{position:static!important}" };
const b = await chromium.launch();
for (const [name, css] of Object.entries(variants)) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true });
  const p = await ctx.newPage();
  const c = await ctx.newCDPSession(p);
  await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await c.send("Performance.enable");
  if (css) await p.addInitScript((css) => document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); }), css);
  await p.goto("http://localhost:3100", { waitUntil: "load" });
  await p.waitForTimeout(3500);
  const m = Object.fromEntries((await c.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
  console.log("counts", m.LayoutCount, m.RecalcStyleCount, "nodes", m.Nodes); console.log(name.padEnd(9), "layout", (m.LayoutDuration * 1000).toFixed(0), "style", (m.RecalcStyleDuration * 1000).toFixed(0), "script", (m.ScriptDuration * 1000).toFixed(0), "task", (m.TaskDuration * 1000).toFixed(0), "ms");
  await ctx.close();
}
await b.close();

