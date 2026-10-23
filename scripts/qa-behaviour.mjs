// Behavioural checks: hero audio/pause, ID card flip, pinned horizontal scroll + counters, mobile menu.
import { chromium } from "playwright";
const out = process.argv[2] ?? "shots";
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
const vs = () => p.evaluate(() => { const v = document.querySelector("video"); return { paused: v.paused, muted: v.muted, t: +v.currentTime.toFixed(2), dur: +v.duration.toFixed(2) }; });
console.log("hero at load", await vs());
await p.evaluate(() => window.scrollTo(0, 1100)); await p.waitForTimeout(900);
console.log("after scroll past hero (expect paused)", await vs());
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(900);
console.log("back at top (expect playing)", await vs());
console.log("button label", await p.getByRole("button", { name: /intro/i }).getAttribute("aria-label"));
await p.getByRole("button", { name: /intro/i }).click(); await p.waitForTimeout(300);
console.log("after toggle", await vs(), await p.getByRole("button", { name: /intro/i }).getAttribute("aria-label"));

// ID card
await p.evaluate(() => window.scrollTo(0, document.getElementById("about").offsetTop)); await p.waitForTimeout(1200);
await p.mouse.move(300, 300); await p.mouse.move(900, 320, { steps: 6 }); await p.waitForTimeout(250);
await p.screenshot({ path: `${out}/behav-swing.png` });
await p.locator(".idc").focus(); await p.keyboard.press("Enter"); await p.mouse.move(10, 10); await p.waitForTimeout(1300);
console.log("card flipped via keyboard:", await p.locator(".idc").getAttribute("aria-pressed"));
await p.screenshot({ path: `${out}/behav-card-back.png` });

// achievements
const top = await p.evaluate(() => { const s = document.getElementById("achievements"); return { top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight }; });
for (const f of [0.5, 1]) {
  await p.evaluate((y) => window.scrollTo(0, y), top.top + (top.h - 900) * f); await p.waitForTimeout(2200);
  console.log("ach progress", f, await p.evaluate(() => [...document.querySelectorAll(".ac-num")].map((e) => e.textContent)));
  await p.screenshot({ path: `${out}/behav-ach-${f}.png` });
}
await ctx.close();

// mobile menu
const m = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const mp = await m.newPage();
await mp.goto("http://localhost:3100", { waitUntil: "networkidle" }); await mp.waitForTimeout(800);
await mp.getByRole("button", { name: "Menu" }).click(); await mp.waitForTimeout(1300);
await mp.screenshot({ path: `${out}/behav-menu.png` });
await mp.keyboard.press("Escape"); await mp.waitForTimeout(900);
console.log("menu closed:", await mp.locator("#nv-overlay").getAttribute("aria-hidden"));
await mp.getByRole("button", { name: "Menu" }).click(); await mp.waitForTimeout(900);
await mp.getByRole("link", { name: /Contact/ }).click(); await mp.waitForTimeout(2500);
console.log("scrolled to contact:", await mp.evaluate(() => Math.round(document.getElementById("contact").getBoundingClientRect().top)));
await b.close();
