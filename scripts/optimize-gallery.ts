import { execFile } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const DIR = path.join(process.cwd(), "public", "gallery");

/**
 * 갤러리 영상을 webm(VP9)으로 다시 인코딩하고 포스터를 뽑는다.
 *
 * 히어로 영상에서 확인한 대로, 이런 결과물 영상은 원본이 헐겁게 인코딩돼 있어
 * 화질 손실 없이 80~90% 가 줄어든다. 방문자는 webm 하나만 받고, mp4 는 VP9 를
 * 못 읽는 브라우저용 폴백으로 남는다.
 *
 * ffmpeg 가 없으면 그냥 건너뛴다 — 최적화는 선택이고, 없어도 페이지는 돈다.
 */
async function hasFfmpeg() {
  try {
    await run("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!existsSync(DIR)) {
    console.log("public/gallery/ 가 없습니다. 만들 것이 없습니다.");
    return;
  }
  if (!(await hasFfmpeg())) {
    console.log("ffmpeg 를 찾지 못했습니다. 영상 최적화를 건너뜁니다.");
    return;
  }

  const files = (await readdir(DIR)).filter((f) => /\.mp4$/i.test(f)).sort();
  if (!files.length) {
    console.log("mp4 가 없습니다.");
    return;
  }

  for (const f of files) {
    const base = f.replace(/\.mp4$/i, "");
    const src = path.join(DIR, f);
    const webm = path.join(DIR, `${base}.webm`);
    const poster = path.join(DIR, `${base}-poster.jpg`);

    if (!existsSync(webm)) {
      // -an: 배경으로 깔리므로 소리는 버린다. 자동재생은 어차피 무음이어야 한다.
      await run("ffmpeg", [
        "-y", "-v", "error", "-i", src,
        "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
        "-an", "-row-mt", "1", "-cpu-used", "2",
        webm,
      ]);
      const before = (await stat(src)).size;
      const after = (await stat(webm)).size;
      const cut = Math.round((1 - after / before) * 100);
      console.log(
        `${base}  ${(before / 1048576).toFixed(2)}MB → ${(after / 1048576).toFixed(2)}MB (${cut}% 절감)`,
      );
    }

    if (!existsSync(poster)) {
      await run("ffmpeg", ["-y", "-v", "error", "-ss", "0.2", "-i", src, "-frames:v", "1", "-q:v", "4", poster]);
    }
  }
  console.log("끝났습니다.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
