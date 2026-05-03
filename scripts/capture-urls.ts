import { chromium, type Browser } from "playwright";
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";

type Target = { slug: string; url: string };
type CapturedMeta = {
  slug: string;
  url: string;
  capturedAt: string;
  ok: boolean;
  error?: string;
};

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

async function captureOne(
  browser: Browser,
  target: Target,
  viewport: (typeof VIEWPORTS)[number],
): Promise<CapturedMeta> {
  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await ctx.newPage();
  const outPath = join("public/captured", `${target.slug}/${viewport.name}.jpg`);
  await mkdir(dirname(outPath), { recursive: true });
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: outPath,
      fullPage: true,
      type: "jpeg",
      quality: 80,
    });
    await ctx.close();
    return {
      slug: `${target.slug}/${viewport.name}`,
      url: target.url,
      capturedAt: new Date().toISOString(),
      ok: true,
    };
  } catch (e) {
    await ctx.close().catch(() => {});
    return {
      slug: `${target.slug}/${viewport.name}`,
      url: target.url,
      capturedAt: new Date().toISOString(),
      ok: false,
      error: String(e).slice(0, 200),
    };
  }
}

(async () => {
  const targets: Target[] = JSON.parse(
    await readFile("scripts/url-list.json", "utf-8"),
  );
  const browser = await chromium.launch();
  const results: CapturedMeta[] = [];
  for (const target of targets) {
    for (const vp of VIEWPORTS) {
      const result = await captureOne(browser, target, vp);
      console.log(`${result.ok ? "OK" : "FAIL"} ${result.slug}`);
      results.push(result);
    }
  }
  await browser.close();
  await writeFile("lib/captured-meta.json", JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log(`\nTotal: ${ok} success / ${fail} failed`);
  // exit OK even if some failed (OS Agent / Naver 봇 차단 가능)
  process.exit(0);
})();
