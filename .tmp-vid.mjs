import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(6000);
const s = await p.evaluate(() => {
  const el = document.querySelector("video");
  return { 재생중: !el.paused, 소스: (el.currentSrc || "").split("/").pop() };
});
console.log("모바일:", JSON.stringify(s));
await p.screenshot({ path: ".tmp-hv/mobile.jpg", type: "jpeg", quality: 88 });
await b.close();
