// Reproduce / log layout shifts on load. usage: node scripts/cls-probe.mjs [runs]
import { chromium } from "playwright";
const b = await chromium.launch();
const runs = +(process.argv[2] ?? 6);
for (let n = 0; n < runs; n++) {
  const ctx = await b.newContext({ viewport: { width: 1350, height: 940 } });
  const p = await ctx.newPage();
  if (process.env.THROTTLE) {
    const c = await ctx.newCDPSession(p);
    await c.send("Network.enable");
    await c.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  await p.addInitScript(() => {
    window.__ls = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__ls.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), s: e.sources.map((s) => ({ n: s.node?.className || s.node?.id || s.node?.nodeName, from: [s.previousRect.x, s.previousRect.y, s.previousRect.width, s.previousRect.height].map(Math.round), to: [s.currentRect.x, s.currentRect.y, s.currentRect.width, s.currentRect.height].map(Math.round) })) });
    }).observe({ type: "layout-shift", buffered: true });
  });
  await p.goto("http://localhost:3100", { waitUntil: "load" });
  await p.waitForTimeout(6000);
  console.log(n, JSON.stringify(await p.evaluate(() => window.__ls)));
  await ctx.close();
}
await b.close();
