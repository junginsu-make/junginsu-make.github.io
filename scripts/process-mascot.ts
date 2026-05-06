import sharp from "sharp";
import path from "path";
import fs from "fs";

// 정인수 캐릭터 이미지 — 흰 배경 → 투명 변환 후 public/chat-mascot.png 저장
// 1회 실행: pnpm dlx tsx scripts/process-mascot.ts

const SRC = path.resolve("image/image-1778054986339.jpg");
const DST = path.resolve("public/chat-mascot.png");

// 흰색 임계값 — RGB 전부 이 값보다 크면 투명 처리
const WHITE_THRESHOLD = 240;
// 부분 투명 영역 (안티에일리어싱) — 임계값과 흰색 사이는 점진적 투명
const SOFT_THRESHOLD = 220;

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("Source image not found:", SRC);
    process.exit(1);
  }

  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .resize({ width: 256, height: 256, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // RGBA 픽셀 순회 — 흰색 영역 투명 처리
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minRgb = Math.min(r, g, b);

    if (minRgb >= WHITE_THRESHOLD) {
      data[i + 3] = 0; // 완전 투명
    } else if (minRgb >= SOFT_THRESHOLD) {
      // 점진적 투명도 — 가장자리 부드럽게
      const t = (minRgb - SOFT_THRESHOLD) / (WHITE_THRESHOLD - SOFT_THRESHOLD);
      data[i + 3] = Math.round(255 * (1 - t));
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: false })
    .toFile(DST);

  const stat = fs.statSync(DST);
  console.log(`✓ Saved: ${DST} (${(stat.size / 1024).toFixed(1)} KB, ${info.width}x${info.height})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
