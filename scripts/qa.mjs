// Playwright QA: screenshots + overflow + console errors. usage: node scripts/qa.mjs [outDir]
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const out = process.argv[2] ?? "shots";
mkdirSync(out, { recursive: true });
const sizes = [
  { n: "desktop", w: 1440, h: 900 },
  { n: "mobile", w: 390, h: 844, touch: true },
  { n: "narrow", w: 360, h: 740, touch: true },
  { n: "wide", w: 1920, h: 1080 },
];
const stops = ["top", "about", "skills", "work", "certifications", "experience", "achievements", "contact"];
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, hasTouch: !!s.touch, isMobile: !!s.touch });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto("http://localhost:3100", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  for (const id of stops) {
    await page.evaluate((id) => {
      const el = id === "top" ? document.body : document.getElementById(id);
      window.scrollTo(0, id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - (id === "achievements" ? 0 : 0));
    }, id);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${out}/${s.n}-${id}.png` });
  }
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  console.log(s.n, m, m.sw === m.iw ? "NO OVERFLOW" : "OVERFLOW", errs.length ? errs : "no console errors");
  await ctx.close();
}
await browser.close();
