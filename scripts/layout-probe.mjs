// Which section costs the most to lay out? (4x CPU throttle, forced full relayouts)
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true });
const p = await ctx.newPage();
const c = await ctx.newCDPSession(p);
await c.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await p.goto("http://localhost:3100", { waitUntil: "load" });
await p.waitForTimeout(3000);
const res = await p.evaluate(() => {
  const time = () => {
    let best = 1e9;
    for (let i = 0; i < 4; i++) {
      document.body.style.paddingRight = i % 2 ? "1px" : "2px";
      const t = performance.now();
      void document.body.offsetHeight;
      best = Math.min(best, performance.now() - t);
    }
    return +best.toFixed(1);
  };
  const out = { all: time() };
  const parts = [...document.querySelectorAll("header, main > *, footer")];
  for (const el of parts) {
    const d = el.style.display;
    el.style.display = "none";
    out[(el.id || el.className || el.tagName).toString().slice(0, 18)] = +(out.all - time()).toFixed(1);
    el.style.display = d;
  }
  return out;
});
console.log(res);
await b.close();
