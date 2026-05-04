/**
 * 개인 포토폴리오-23.03.02.pdf → public/marketing-portfolio/page-NN.{png,jpg,webp,avif}
 *
 * pdf-to-img 사용 (pdfjs-dist 기반, 시스템 deps 불필요).
 * 차트 가독성 위해 scale 3 (대략 216 DPI 수준).
 */
import { pdf } from "pdf-to-img";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const PDF_PATH =
  "/home/a20616050/projects/A/포토폴리오-260503/개인 포토폴리오-23.03.02.pdf";
const OUT_DIR = "public/marketing-portfolio";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const document = await pdf(PDF_PATH, { scale: 3 });
  let pageNum = 1;

  for await (const image of document) {
    const baseName = `page-${pageNum.toString().padStart(2, "0")}`;
    const pngPath = join(OUT_DIR, `${baseName}.png`);
    const jpgPath = join(OUT_DIR, `${baseName}.jpg`);
    const webpPath = join(OUT_DIR, `${baseName}.webp`);
    const avifPath = join(OUT_DIR, `${baseName}.avif`);

    // 원본 PNG (pdf-to-img 가 PNG Buffer 반환)
    await writeFile(pngPath, image);

    // sharp 로 jpg/webp/avif 변환 (max width 2400, 차트 선명도 유지)
    const pipe = sharp(image).resize({
      width: 2400,
      withoutEnlargement: true,
    });
    await pipe.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(jpgPath);
    await pipe.clone().webp({ quality: 85 }).toFile(webpPath);
    await pipe.clone().avif({ quality: 70 }).toFile(avifPath);

    console.log(`  ${baseName} (PNG + JPG + WebP + AVIF)`);
    pageNum++;
  }

  console.log(`Total pages: ${pageNum - 1}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
