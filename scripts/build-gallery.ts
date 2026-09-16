import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

/**
 * 원본 폴더 → public/gallery/ 로 굽는다.
 *
 * 이 스크립트가 파일명에 `-w2` 를 붙여 준다. 가로로 긴 것은 격자에서 두 칸을
 * 차지해야 제 크기로 보이는데, 빌드 때 이미지를 하나하나 열어 재는 대신 이름에
 * 적어 둔다(lib/gallery.ts 가 읽는다).
 *
 * 다시 돌리면 public/gallery/ 를 비우고 새로 굽는다 — 원본 폴더가 곧 정답이다.
 */

const SRC_DIRS = [
  { dir: "C:/Users/Administrator/Desktop/포토폴리오 자료/생성된 콘텐츠", tag: "made" },
];

/** 플랫폼 화면 — 폴더당 몇 장만 골라 중간중간 끼운다. */
const PLATFORM_DIR = "C:/Users/Administrator/Desktop/포토폴리오 자료/플랫폼 레퍼런스";
const PLATFORM_PICK: Record<string, number[]> = {
  lumio: [4, 10],
  "MKT Automation": [1, 6],
  "OS Agent": [1, 5],
  propintel: [5, 8],
  tickpoint: [1, 9],
  "아키텍처 시스템": [4, 6],
};

const OUT = path.join(process.cwd(), "public", "gallery");

const IMAGE = /\.(png|jpe?g|webp)$/i;
const VIDEO = /\.(mp4|mov|webm)$/i;

/** 이 비율보다 가로로 길면 두 칸을 준다. */
const WIDE = 1.45;
/**
 * 이 비율보다 세로로 길면 잘라낸다.
 *
 * 처음엔 0.62 로 잡아 세로로 긴 것을 다 잘랐는데, 그러면 격자 아래쪽에 생기는
 * 길쭉한 빈 자리를 메울 타일이 없어진다. 긴 것은 긴 채로 두는 편이 낫다.
 * 다만 0.3 짜리 풀페이지 스크린샷은 한 열을 통째로 삼키므로 거기까지만 막는다.
 */
const TOO_TALL = 0.4;
/** 잘라낼 때 맞출 비율 — 길쭉하되 한 열을 삼키지는 않는 정도. */
const CROP_TO = 0.45;

/** 걸지 않을 파일 — 비슷한 것이 이미 있다. */
const EXCLUDE = new Set(["KakaoTalk_20260911_134543202.mp4"]);

type Job = { src: string; tag: string };

async function hasFfmpeg() {
  try {
    await run("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

function listImages(dir: string): string[] {
  return readdirSync(dir).filter((f) => IMAGE.test(f)).sort();
}

async function main() {
  const ffmpeg = await hasFfmpeg();
  if (!ffmpeg) console.log("⚠ ffmpeg 없음 — 영상은 건너뜁니다.\n");

  // 굽기 전에 비운다. 원본 폴더가 정답이고 여기는 산출물이다.
  if (existsSync(OUT)) {
    for (const f of readdirSync(OUT)) {
      if (f === "README.txt") continue;
      rmSync(path.join(OUT, f), { force: true });
    }
  } else {
    mkdirSync(OUT, { recursive: true });
  }

  // 1) 결과물 이미지 + 영상
  const images: Job[] = [];
  const videos: Job[] = [];
  for (const { dir, tag } of SRC_DIRS) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).sort()) {
      if (EXCLUDE.has(f)) {
        console.log(`제외: ${f}`);
        continue;
      }
      const full = path.join(dir, f);
      if (IMAGE.test(f)) images.push({ src: full, tag });
      else if (VIDEO.test(f)) videos.push({ src: full, tag });
    }
  }

  // 2) 플랫폼 화면 — 폴더당 지정한 장만
  const platform: Job[] = [];
  for (const [folder, picks] of Object.entries(PLATFORM_PICK)) {
    const dir = path.join(PLATFORM_DIR, folder);
    if (!existsSync(dir)) continue;
    const files = listImages(dir);
    for (const i of picks) {
      if (files[i - 1]) platform.push({ src: path.join(dir, files[i - 1]), tag: "app" });
    }
  }

  // 같은 그림이 두 번 걸리지 않게 내용으로 거른다.
  // 「생성된 콘텐츠」 폴더에 플랫폼 스크린샷이 일부 섞여 있어, 「플랫폼 레퍼런스」
  // 에서 고른 것과 겹쳤다. 파일명이 달라도 내용이 같으면 같은 그림이다.
  const seen = new Set<string>();
  const dedup = (list: Job[]) =>
    list.filter((j) => {
      const h = createHash("md5").update(readFileSync(j.src)).digest("hex");
      if (seen.has(h)) return false;
      seen.add(h);
      return true;
    });

  const beforeDedup = images.length + platform.length;
  const imagesU = dedup(images);
  const platformU = dedup(platform);
  const dropped = beforeDedup - imagesU.length - platformU.length;
  if (dropped) console.log(`중복 ${dropped}장 제외\n`);
  images.length = 0;
  images.push(...imagesU);
  platform.length = 0;
  platform.push(...platformU);

  // 3) 섞는다 — 결과물 사이사이에 플랫폼 화면과 영상이 고르게 퍼지도록
  const order: Job[] = [];
  const pools = [
    { list: images, i: 0 },
    { list: videos, i: 0 },
    { list: platform, i: 0 },
  ];
  const total = pools.reduce((n, p) => n + p.list.length, 0);
  while (order.length < total) {
    // 남은 비율이 가장 큰 쪽에서 하나씩 꺼낸다 — 한쪽이 뒤에 몰리지 않는다.
    const next = pools
      .filter((p) => p.i < p.list.length)
      .sort((a, b) => (b.list.length - b.i) / b.list.length - (a.list.length - a.i) / a.list.length)[0];
    order.push(next.list[next.i++]);
  }

  let n = 0;
  let bytes = 0;
  let cropped = 0;
  let wide = 0;

  for (const job of order) {
    n++;
    const idx = String(n).padStart(2, "0");
    const isVideo = VIDEO.test(job.src);

    if (isVideo) {
      if (!ffmpeg) continue;
      const probe = await run("ffprobe", [
        "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height", "-of", "csv=p=0", job.src,
      ]);
      const [w, h] = probe.stdout.trim().split(",").map(Number);
      const span = w / h >= WIDE ? "-w2" : "";
      if (span) wide++;

      const base = `${idx}-${job.tag}${span}-r${Math.round((w / h) * 100)}`;
      const webm = path.join(OUT, `${base}.webm`);
      const poster = path.join(OUT, `${base}-poster.jpg`);

      // 세로로 긴 숏폼이 100MB 에 가깝다. 폭을 제한하고 다시 인코딩한다.
      const maxW = w / h >= WIDE ? 1280 : 720;
      await run("ffmpeg", [
        "-y", "-v", "error", "-i", job.src,
        "-vf", `scale='min(${maxW},iw)':-2`,
        "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
        "-an", "-row-mt", "1", "-cpu-used", "4",
        webm,
      ]);
      await run("ffmpeg", ["-y", "-v", "error", "-ss", "0.5", "-i", job.src, "-frames:v", "1", "-vf", `scale='min(${maxW},iw)':-2`, "-q:v", "5", poster]);

      const before = statSync(job.src).size;
      const after = statSync(webm).size;
      bytes += after;
      console.log(
        `${base.padEnd(16)} 영상 ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB  ${path.basename(job.src).slice(0, 34)}`,
      );
      continue;
    }

    const meta = await sharp(job.src).metadata();
    const ratio = meta.width! / meta.height!;

    let pipe = sharp(job.src);
    let finalRatio = ratio;
    if (ratio < TOO_TALL) {
      // 너무 길다 — 위에서부터 CROP_TO 비율만큼만 쓴다.
      const keep = Math.min(Math.round(meta.width! / CROP_TO), meta.height!);
      pipe = pipe.extract({ left: 0, top: 0, width: meta.width!, height: keep });
      finalRatio = meta.width! / keep;
      cropped++;
    }

    // 자른 뒤의 비율로 판정한다 — 원본 0.18 이 잘려서 0.70 이 되는 식이다.
    const span = finalRatio >= WIDE ? "-w2" : "";
    if (span) wide++;

    // 비율을 이름에 적는다 — 브라우저가 이미지를 받기 전에 자리를 잡아야
    // 격자가 흔들리지 않는다(lib/gallery.ts 가 읽는다).
    const base = `${idx}-${job.tag}${span}-r${Math.round(finalRatio * 100)}`;
    const out = path.join(OUT, `${base}.webp`);
    await pipe.resize(1400, null, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);

    const after = statSync(out).size;
    bytes += after;
    console.log(
      `${base.padEnd(20)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(5)} ${ratio.toFixed(2)}${ratio < TOO_TALL ? " ✂" : ""}  ${(after / 1024).toFixed(0)}KB  ${path.basename(job.src).slice(0, 30)}`,
    );
  }

  console.log("\n---");
  console.log(`${n}개 / 합계 ${(bytes / 1048576).toFixed(1)}MB`);
  console.log(`두 칸(가로) ${wide}개 · 잘라낸 것 ${cropped}장`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
