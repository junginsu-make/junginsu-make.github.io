// 포트폴리오 라이브 사이트 → 섹션 단위 슬라이드 PDF 변환
// 사용: pnpm pdf  (BASE_URL 환경변수로 캡처 대상 변경 가능)
// 출력: portfolio.pdf (프로젝트 루트)
//
// 동작: Playwright로 각 라우트 방문 → 스크롤 reveal 트리거 → 풀페이지 PNG →
//       DOM에서 main의 직접 자식을 섹션으로 측정 → 한 섹션 = 한 슬라이드
//       (PDF 페이지 크기를 섹션 실제 크기에 맞춤, 내부는 절대 자르지 않음).
//       슬라이드마다 비율은 다르지만 콘텐츠 짤림·중복은 없음.

import { chromium, type Browser } from "playwright";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import sharp from "sharp";
import { writeFile } from "fs/promises";

const BASE_URL = process.env.BASE_URL ?? "https://junginsu-portfolio.pages.dev";
const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;
const DEVICE_SCALE = 1.5; // 선명도 — 물리 픽셀 2160 wide
const SLIDE_WIDTH = 1440; // PDF 페이지 논리 폭(pt) — 모든 슬라이드 공통
const OUT_PATH = "portfolio.pdf";

// 1페이지 우측 하단 — 라이브 사이트로 이동하는 클릭 배지
const LINK_URL = BASE_URL;
const LINK_TEXT = "클릭 시 상세한 내용을 직접 확인 가능합니다 →";

type SectionRect = { top: number; height: number };

const ROUTES: Array<{ path: string; label: string }> = [
  { path: "/", label: "홈" },
  { path: "/about/", label: "About" },
  { path: "/career/", label: "Career" },
  { path: "/marketing/", label: "Marketing" },
  { path: "/marketing/content/", label: "Marketing — Content" },
  { path: "/marketing/teaching/", label: "Marketing — Teaching" },
  { path: "/builder/", label: "AI Builder" },
  { path: "/builder/scenarios/", label: "AI Builder — Scenarios" },
  { path: "/builder/tickpoint/", label: "AI Builder — Tickpoint" },
  { path: "/builder/lumio/", label: "AI Builder — Lumio" },
  { path: "/builder/os-agent/", label: "AI Builder — OS Agent" },
  { path: "/builder/mkt-automation/", label: "AI Builder — MKT Automation" },
  { path: "/builder/propintel/", label: "AI Builder — PropIntel" },
  { path: "/builder/architect/", label: "AI Builder — Architect" },
];

// PDF에서 노이즈 제거 — 채팅 위젯·스크롤탑·바텀 시트
const HIDE_CSS = `
  [aria-label="정인수 AI 채팅 열기"],
  [aria-label="AI 채팅"],
  [aria-label="페이지 맨 위로"] { display: none !important; }
`;

type CaptureResult = { image: Buffer; sections: SectionRect[] };

async function captureRoute(
  browser: Browser,
  route: { path: string; label: string },
): Promise<CaptureResult> {
  const ctx = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE,
  });
  const page = await ctx.newPage();
  // tsx가 evaluate 함수에 주입하는 __name 헬퍼를 브라우저 컨텍스트에 no-op으로 정의
  await page.addInitScript(() => {
    // @ts-expect-error — tsx helper polyfill
    if (typeof globalThis.__name !== "function") globalThis.__name = (fn) => fn;
  });

  await page.goto(`${BASE_URL}${route.path}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await page.addStyleTag({ content: HIDE_CSS });

  // GSAP ScrollTrigger / IntersectionObserver reveal 트리거 — 천천히 끝까지 스크롤 후 복귀
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const total = document.documentElement.scrollHeight;
    const step = Math.max(window.innerHeight * 0.7, 400);
    for (let y = 0; y < total; y += step) {
      window.scrollTo({ top: y, behavior: "auto" });
      await sleep(220);
    }
    await sleep(800);
    window.scrollTo({ top: 0, behavior: "auto" });
    await sleep(500);
  });

  // 섹션 경계 측정 — main의 직접 자식을 섹션으로 간주, 페이지를 빈틈없이 타일링
  const sections = await page.evaluate(() => {
    const main = document.querySelector("main");
    if (!main) return [] as Array<{ top: number; height: number }>;
    const children = Array.from(main.children) as HTMLElement[];
    const totalHeight = document.documentElement.scrollHeight;
    const rects = children
      .filter((el) => el.offsetHeight > 0)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: r.height };
      });
    // 빈틈 없이 타일링 — 각 섹션은 다음 섹션 시작 직전까지, 마지막은 페이지 끝까지
    return rects.map((r, i) => {
      const top = i === 0 ? 0 : Math.round(rects[i - 1].top + rects[i - 1].height);
      const next = rects[i + 1];
      const bottom = next ? Math.round(next.top) : totalHeight;
      return { top, height: bottom - top };
    });
  });

  const buf = (await page.screenshot({ fullPage: true, type: "png" })) as Buffer;
  await ctx.close();
  return { image: buf, sections };
}

// 섹션 단위로 슬라이스. 한 섹션 = 한 슬라이드, 내부는 절대 자르지 않음.
// 각 슬라이드의 PDF 페이지 높이를 섹션 실제 높이에 맞춰 가변으로 만듦.
type Slide = { buffer: Buffer; widthPx: number; heightPx: number };

async function sliceBySections(
  imgBuffer: Buffer,
  sections: SectionRect[],
): Promise<Slide[]> {
  const meta = await sharp(imgBuffer).metadata();
  if (!meta.width || !meta.height) throw new Error("이미지 크기 측정 실패");
  const imgWidth = meta.width;
  const imgHeight = meta.height;

  // 섹션 측정 실패 시 fallback — 전체 페이지를 하나의 슬라이드로
  if (sections.length === 0) {
    return [{ buffer: imgBuffer, widthPx: imgWidth, heightPx: imgHeight }];
  }

  // 스크린샷이 deviceScale 만큼 커진 상태. 섹션은 CSS 픽셀이므로 scale 환산 필요
  const scale = imgWidth / VIEWPORT_WIDTH;

  const slides: Slide[] = [];
  for (const sec of sections) {
    const topPx = Math.max(0, Math.round(sec.top * scale));
    const endPx = Math.min(imgHeight, Math.round((sec.top + sec.height) * scale));
    const heightPx = endPx - topPx;
    if (heightPx <= 0) continue;

    const buffer = await sharp(imgBuffer)
      .extract({ left: 0, top: topPx, width: imgWidth, height: heightPx })
      .png()
      .toBuffer();
    slides.push({ buffer, widthPx: imgWidth, heightPx });
  }

  return slides;
}

// 클릭 배지 렌더링 — Playwright로 HTML을 렌더링해 PNG로 추출
// (Pretendard CDN을 사용해 한글 폰트 보장)
async function renderLinkBadge(browser: Browser): Promise<Buffer> {
  const ctx = await browser.newContext({
    viewport: { width: 800, height: 200 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const html = `<!DOCTYPE html>
    <html lang="ko">
    <head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
      <style>
        html, body { margin: 0; padding: 0; background: transparent; }
        body { display: inline-block; }
        .badge {
          display: inline-flex;
          align-items: center;
          font-family: "Pretendard Variable", -apple-system, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #0A0A0A;
          background: #FF7A1F;
          padding: 14px 22px;
          border-radius: 999px;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 24px rgba(255, 122, 31, 0.35);
          white-space: nowrap;
        }
      </style>
    </head>
    <body><span class="badge">${LINK_TEXT}</span></body>
    </html>`;
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(600); // 폰트 로드 안정화
  const badge = await page.locator(".badge");
  const buf = (await badge.screenshot({ type: "png", omitBackground: true })) as Buffer;
  await ctx.close();
  return buf;
}

(async () => {
  console.log(`Capturing ${ROUTES.length} routes from ${BASE_URL}`);
  const browser = await chromium.launch();
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("정인수 포트폴리오");
  pdfDoc.setAuthor("Jung In-Soo");
  pdfDoc.setSubject("Marketer · AI Builder · AI SaaS");
  pdfDoc.setCreationDate(new Date());

  let okCount = 0;
  let totalSlides = 0;
  for (const route of ROUTES) {
    process.stdout.write(`  ${route.label.padEnd(34)} ${route.path} ... `);
    try {
      const { image, sections } = await captureRoute(browser, route);
      const slides = await sliceBySections(image, sections);
      for (const slide of slides) {
        const img = await pdfDoc.embedPng(slide.buffer);
        // PDF 페이지 폭은 SLIDE_WIDTH(pt)로 고정, 높이는 섹션 비율에 맞춰 가변
        const pageHeight = (slide.heightPx / slide.widthPx) * SLIDE_WIDTH;
        const page = pdfDoc.addPage([SLIDE_WIDTH, pageHeight]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: SLIDE_WIDTH,
          height: pageHeight,
        });
      }
      okCount += 1;
      totalSlides += slides.length;
      console.log(`OK (${slides.length} slides)`);
    } catch (e) {
      console.log(`FAIL — ${String(e).slice(0, 120)}`);
    }
  }
  // 1페이지 우측 하단에 클릭 배지 + URI 링크 어노테이션 추가
  if (pdfDoc.getPageCount() > 0) {
    try {
      const badgeBuf = await renderLinkBadge(browser);
      const badgeImg = await pdfDoc.embedPng(badgeBuf);
      const firstPage = pdfDoc.getPage(0);
      const pageW = firstPage.getWidth();
      const badgeW = 420; // pt
      const badgeH = badgeW * (badgeImg.height / badgeImg.width);
      const margin = 32;
      const x = pageW - badgeW - margin;
      const y = margin;
      firstPage.drawImage(badgeImg, { x, y, width: badgeW, height: badgeH });

      const linkAnnotation = pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: [x, y, x + badgeW, y + badgeH],
          Border: [0, 0, 0],
          A: {
            Type: "Action",
            S: "URI",
            URI: PDFString.of(LINK_URL),
          },
        }),
      );
      firstPage.node.set(
        PDFName.of("Annots"),
        pdfDoc.context.obj([linkAnnotation]),
      );
      console.log(`  + 1페이지에 링크 배지 추가 (${LINK_URL})`);
    } catch (e) {
      console.log(`  ! 링크 배지 추가 실패 — ${String(e).slice(0, 120)}`);
    }
  }

  await browser.close();

  const bytes = await pdfDoc.save();
  await writeFile(OUT_PATH, bytes);
  console.log(
    `\nSaved ${OUT_PATH} — ${okCount}/${ROUTES.length} routes, ${totalSlides} slides total`,
  );
  process.exit(okCount === ROUTES.length ? 0 : 1);
})();
