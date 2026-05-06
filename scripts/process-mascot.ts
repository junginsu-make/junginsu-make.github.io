import sharp from "sharp";
import path from "path";
import fs from "fs";

// 정인수 캐릭터 스프라이트 시트 처리
//   1. image/image (6).png — 1536x1024 시트 (idle 4 + walk-left 6 + walk-right 6)
//   2. 우측 워킹 6프레임 추출 → 흰 배경 투명화 → 사이즈 정규화
//   3. 단일 이미지(정면 idle)도 별도 저장
//
// 출력:
//   - public/chat-mascot.png         — 정면 idle (FAB 호버/정지 상태)
//   - public/chat-mascot-walk.png    — 우측 워킹 6프레임 가로 strip
//
// 1회 실행: pnpm dlx tsx scripts/process-mascot.ts

const SHEET = path.resolve("image/image (6).png");
const OUT_IDLE = path.resolve("public/chat-mascot.png");
const OUT_WALK = path.resolve("public/chat-mascot-walk.png");

// 시트 레이아웃 (실측 + 추정)
const SHEET_W = 1536;
const SHEET_H = 1024;
const ROW_H = Math.floor(SHEET_H / 3);

// 워킹 행: 왼쪽 라벨 영역 ~180px, 6프레임 균등 분할
const WALK_LABEL_W = 180;
const WALK_FRAMES = 6;
const WALK_ROW_Y_RIGHT = ROW_H * 2; // row 3
// 라벨 우측 + 안전 여유 → 6프레임 균등
const WALK_FRAME_W = Math.floor((SHEET_W - WALK_LABEL_W) / WALK_FRAMES);

// idle 행: 4프레임 균등, 라벨은 상단
const IDLE_FRAMES = 4;
const IDLE_LABEL_H = 90; // 상단 라벨 + 여유 (50→90)
const IDLE_FRAME_W = Math.floor(SHEET_W / IDLE_FRAMES);

// 출력 프레임 정규화 크기 (단일 캐릭터 박스)
const OUT_FRAME = 160;

// 백그라운드 흰색만 투명화 (캐릭터 흰 셔츠는 유지). 더 보수적인 임계값.
const WHITE_THRESHOLD = 250;
const SOFT_THRESHOLD = 240;

// 흰색(외곽 배경)만 → 투명 처리. 캐릭터 셔츠 흰색은 보존하기 위해
// 가장자리(에지)에서만 flood-fill 방식이 이상적이지만, 여기선 단순 임계로 처리.
// 임계값을 250까지 올려서 진짜 순백 픽셀만 투명화.
function whiteToAlpha(data: Buffer, width: number, height: number) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minRgb = Math.min(r, g, b);
    if (minRgb >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    } else if (minRgb >= SOFT_THRESHOLD) {
      const t = (minRgb - SOFT_THRESHOLD) / (WHITE_THRESHOLD - SOFT_THRESHOLD);
      data[i + 3] = Math.round(255 * (1 - t));
    }
  }
  return { data, width, height };
}

// 캐릭터 바운딩 박스 찾기 (alpha > 16인 영역)
function findBoundingBox(data: Buffer, width: number, height: number) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function processFrame(
  left: number,
  top: number,
  width: number,
  height: number,
): Promise<Buffer> {
  const cell = await sharp(SHEET)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const alphaApplied = whiteToAlpha(cell.data, cell.info.width, cell.info.height);
  const bbox = findBoundingBox(alphaApplied.data, alphaApplied.width, alphaApplied.height);

  // 캐릭터만 추출
  return await sharp(alphaApplied.data, {
    raw: { width: alphaApplied.width, height: alphaApplied.height, channels: 4 },
  })
    .extract({ left: bbox.left, top: bbox.top, width: bbox.width, height: bbox.height })
    // 정사각 OUT_FRAME 박스에 비율 유지로 contain
    .resize({
      width: OUT_FRAME,
      height: OUT_FRAME,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(SHEET)) {
    console.error("Sprite sheet not found:", SHEET);
    process.exit(1);
  }

  console.log("Sheet:", SHEET_W, "x", SHEET_H);
  console.log("Walk frame size estimate:", WALK_FRAME_W, "x", ROW_H);

  // 1) 정면 idle (row 1, frame 0)
  const idleBuf = await processFrame(
    0,
    IDLE_LABEL_H,
    IDLE_FRAME_W,
    ROW_H - IDLE_LABEL_H,
  );
  await sharp(idleBuf).toFile(OUT_IDLE);
  const idleStat = fs.statSync(OUT_IDLE);
  console.log(`✓ ${OUT_IDLE} (${(idleStat.size / 1024).toFixed(1)} KB)`);

  // 2) 우측 워킹 6프레임을 가로 strip으로 합성
  const walkFrames: Buffer[] = [];
  for (let i = 0; i < WALK_FRAMES; i++) {
    const frame = await processFrame(
      WALK_LABEL_W + i * WALK_FRAME_W,
      WALK_ROW_Y_RIGHT,
      WALK_FRAME_W,
      ROW_H,
    );
    walkFrames.push(frame);
  }

  const stripWidth = OUT_FRAME * WALK_FRAMES;
  const composites = walkFrames.map((buf, i) => ({
    input: buf,
    left: i * OUT_FRAME,
    top: 0,
  }));

  await sharp({
    create: {
      width: stripWidth,
      height: OUT_FRAME,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(OUT_WALK);
  const walkStat = fs.statSync(OUT_WALK);
  console.log(`✓ ${OUT_WALK} (${(walkStat.size / 1024).toFixed(1)} KB, ${stripWidth}x${OUT_FRAME})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
