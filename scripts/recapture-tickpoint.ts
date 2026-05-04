import { chromium } from "playwright";
import sharp from "sharp";

const TARGET_URL = "https://tickpoint.co.kr/";
const OUT_DIR = "public/captured/tickpoint/home";

const CLOSE_SELECTORS = [
  'button[aria-label="close"]',
  'button[aria-label="Close"]',
  'button[aria-label="닫기"]',
  'button:has-text("나중에")',
  'button:has-text("닫기")',
  'button:has-text("취소")',
  'button:has-text("×")',
  '[role="dialog"] button:last-child',
  '.modal-close',
  '.close-button',
  '[class*="close" i]',
  '[class*="modal"] [class*="close"]',
];

async function dismissModal(page: import("playwright").Page) {
  // Try various close-button patterns
  for (const sel of CLOSE_SELECTORS) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
        await el.click({ timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(500);
      }
    } catch {
      // ignore
    }
  }
  // Try Escape key
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
  // Try clicking outside the modal (top-left of body)
  await page.mouse.click(10, 10).catch(() => {});
  await page.waitForTimeout(300);
}

(async () => {
  const browser = await chromium.launch();
  try {
    // Desktop
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto(TARGET_URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(2000);
    await dismissModal(page);
    await page.waitForTimeout(800);

    await page.screenshot({
      path: `${OUT_DIR}/desktop.jpg`,
      fullPage: false,
      type: "jpeg",
      quality: 88,
    });
    console.log("Desktop captured");
    await ctx.close();

    // Mobile
    const mctx = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const mpage = await mctx.newPage();
    await mpage.goto(TARGET_URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await mpage.waitForTimeout(2000);
    await dismissModal(mpage);
    await mpage.waitForTimeout(800);

    await mpage.screenshot({
      path: `${OUT_DIR}/mobile.jpg`,
      fullPage: false,
      type: "jpeg",
      quality: 88,
    });
    console.log("Mobile captured");
    await mctx.close();
  } finally {
    await browser.close();
  }

  // Re-encode webp/avif
  for (const v of ["desktop", "mobile"]) {
    const src = `${OUT_DIR}/${v}.jpg`;
    await sharp(src).webp({ quality: 85 }).toFile(`${OUT_DIR}/${v}.webp`);
    await sharp(src).avif({ quality: 70 }).toFile(`${OUT_DIR}/${v}.avif`);
    console.log(`${v} → webp + avif`);
  }

  console.log("Tickpoint recapture done");
})();
