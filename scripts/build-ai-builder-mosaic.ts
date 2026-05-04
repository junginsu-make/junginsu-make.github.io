import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SAAS_CAPTURES = [
  "public/captured/tickpoint/home/desktop.jpg",
  "public/captured/lumio/home/desktop.jpg",
  "public/captured/os-agent/home/desktop.jpg",
  "public/captured/mkt-automation/home/desktop.jpg",
  "public/captured/propintel/home/desktop.jpg",
  "public/captured/architect/home/desktop.jpg",
];

const TILE_W = 600;
const TILE_H = 375;
const COLS = 2;
const ROWS = 3;

async function main() {
  await mkdir("public/ai-builder", { recursive: true });

  // 각 캡처를 600x375 thumbnail로 cover-fit 리사이즈
  const thumbs = await Promise.all(
    SAAS_CAPTURES.map((src) =>
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

  // webp + avif 파생본 생성
  await sharp("public/ai-builder/saas-mosaic.jpg")
    .webp({ quality: 85 })
    .toFile("public/ai-builder/saas-mosaic.webp");

  await sharp("public/ai-builder/saas-mosaic.jpg")
    .avif({ quality: 70 })
    .toFile("public/ai-builder/saas-mosaic.avif");

  console.log(
    `Mosaic done: ${width}x${height} (${COLS} x ${ROWS} = ${SAAS_CAPTURES.length} SaaS)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
