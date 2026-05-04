import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// 6 SaaS 모자이크 — 사용자 정정에 따라 Lumio (2026-05-04 10.45.53) + PropIntel (14.14.21) 신규 적용
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

async function main() {
  await mkdir("public/ai-builder", { recursive: true });

  const thumbs = await Promise.all(
    SAAS_SOURCES.map((src) =>
      sharp(src)
        .resize(TILE_W, TILE_H, { fit: "cover", position: "top" })
        .toBuffer(),
    ),
  );

  const width = TILE_W * COLS;
  const height = TILE_H * ROWS;

  const composite = thumbs.map((buf, i) => ({
    input: buf,
    left: (i % COLS) * TILE_W,
    top: Math.floor(i / COLS) * TILE_H,
  }));

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
    `Mosaic done: ${width}x${height} (${COLS} x ${ROWS} = ${SAAS_SOURCES.length} SaaS)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
