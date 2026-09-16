import fs from "node:fs";
import path from "node:path";

/**
 * public/gallery/ 를 훑어 갤러리에 걸 목록을 만든다.
 *
 * **파일을 넣기만 하면 페이지에 뜬다.** 목록을 코드에 적어두면 결과물을 추가할
 * 때마다 코드를 고쳐야 한다. SaaS 상세 갤러리가 쓰는 방식과 같다.
 *
 * 빌드 시점에 한 번 읽는다(서버 컴포넌트). 파일을 넣은 뒤에는 배포해야 반영된다.
 */

export type GalleryItem = {
  /** public 기준 경로 */
  src: string;
  kind: "image" | "video";
  /** 영상일 때 같은 이름의 webm 이 있으면 그 경로 — 먼저 시도한다 */
  webm?: string;
  /** 영상일 때 같은 이름의 포스터가 있으면 그 경로 */
  poster?: string;
};

const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const VIDEO = /\.(mp4|webm)$/i;

/** 영상에 딸린 파생 파일 — 목록에 따로 세우지 않는다. */
const DERIVED = /-poster\.(jpe?g|png|webp)$/i;

export function getGalleryItems(): GalleryItem[] {
  const dir = path.join(process.cwd(), "public", "gallery");

  let files: string[];
  try {
    files = fs.readdirSync(dir).sort();
  } catch {
    // 폴더가 아직 없을 수 있다. 빈 목록이면 페이지가 안내 문구를 띄운다.
    return [];
  }

  const has = new Set(files);
  const items: GalleryItem[] = [];

  for (const f of files) {
    if (DERIVED.test(f)) continue;

    if (VIDEO.test(f)) {
      // mp4 와 webm 이 둘 다 있으면 mp4 쪽만 한 번 세우고 webm 을 우선 소스로 단다.
      const base = f.replace(VIDEO, "");
      if (/\.webm$/i.test(f) && has.has(`${base}.mp4`)) continue;

      const webm = has.has(`${base}.webm`) ? `/gallery/${encodeURIComponent(`${base}.webm`)}` : undefined;
      const poster = ["jpg", "jpeg", "png", "webp"]
        .map((ext) => `${base}-poster.${ext}`)
        .find((name) => has.has(name));

      items.push({
        src: `/gallery/${encodeURIComponent(f)}`,
        kind: "video",
        webm,
        poster: poster ? `/gallery/${encodeURIComponent(poster)}` : undefined,
      });
      continue;
    }

    if (IMAGE.test(f)) {
      items.push({ src: `/gallery/${encodeURIComponent(f)}`, kind: "image" });
    }
  }

  return items;
}
