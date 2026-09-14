import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// 7 SaaS 모자이크 — MCS 를 상단 전체 폭 타일로 얹고, 기존 6개는 아래 2x3 그대로 둔다.
// 기존 6개 구성은 사용자 정정(Lumio 2026-05-04 10.45.53 · PropIntel 14.14.21)을 보존한다.
const HERO_SOURCE = "public/captured/mcs/home/desktop.jpg";

const SAAS_SOURCES = [
  "public/captured/tickpoint/home/desktop.jpg",
  "public/saas-folders/lumio/Screenshot 2026-05-04 at 10.45.53.JPG",
  "public/captured/os-agent/home/desktop.jpg",
  "public/captured/mkt-automation/home/desktop.jpg",
  "public/saas-folders/propintel/Screenshot 2026-05-03 at 14.14.21.JPG",
  "public/captured/architect/home/desktop.jpg",
];

const TILE_W = 600;
const TILE_H = 375;
const COLS = 2;
const ROWS = 3;
/**
 * 상단 MCS 타일은 배너형(2.4:1)이다.
 * 원본 16:10 을 그대로 쓰면 랜딩 하단의 검은 여백이 타일 1/3 을 먹는다.
 * 그래서 결과물이 실제로 보이는 구간만 같은 2.4:1 로 먼저 잘라낸다.
 */
const HERO_RATIO = 2.4;
const HERO_W = TILE_W * COLS;
const HERO_H = Math.round(HERO_W / HERO_RATIO);
/** 원본 높이 대비 잘라낼 구간의 시작점 — 헤더 바로 아래. */
const HERO_CROP_TOP_RATIO = 0.07;

async function main() {
  await mkdir("public/ai-builder", { recursive: true });

  const thumbs = await Promise.all(
    SAAS_SOURCES.map((src) =>
      sharp(src)
        .resize(TILE_W, TILE_H, { fit: "cover", position: "top" })
        .toBuffer(),
    ),
  );

  const heroMeta = await sharp(HERO_SOURCE).metadata();
  const bandHeight = Math.round(heroMeta.width! / HERO_RATIO);
  const bandTop = Math.min(
    Math.round(heroMeta.height! * HERO_CROP_TOP_RATIO),
    heroMeta.height! - bandHeight,
  );
  const hero = await sharp(HERO_SOURCE)
    .extract({ left: 0, top: bandTop, width: heroMeta.width!, height: bandHeight })
    .resize(HERO_W, HERO_H, { fit: "cover" })
    .toBuffer();

  const width = TILE_W * COLS;
  const height = HERO_H + TILE_H * ROWS;

  const composite = [
    { input: hero, left: 0, top: 0 },
    ...thumbs.map((buf, i) => ({
      input: buf,
      left: (i % COLS) * TILE_W,
      top: HERO_H + Math.floor(i / COLS) * TILE_H,
    })),
  ];

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 10, g: 10, b: 10 },
    },
  })
    .composite(composite)
    .jpeg({ quality: 88 })
    .toFile("public/ai-builder/saas-mosaic.jpg");

  await sharp("public/ai-builder/saas-mosaic.jpg")
    .webp({ quality: 85 })
    .toFile("public/ai-builder/saas-mosaic.webp");

  await sharp("public/ai-builder/saas-mosaic.jpg")
    .avif({ quality: 70 })
    .toFile("public/ai-builder/saas-mosaic.avif");

  console.log(
    `Mosaic done: ${width}x${height} (MCS 히어로 + ${COLS} x ${ROWS} = ${SAAS_SOURCES.length + 1} SaaS)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
