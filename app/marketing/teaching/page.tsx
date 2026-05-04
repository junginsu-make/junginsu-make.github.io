import fs from "node:fs";
import path from "node:path";
import { TeachingHero } from "@/components/marketing/teaching-hero";
import { TeachingTiers } from "@/components/marketing/teaching-tiers";

export const metadata = {
  title: "Teaching — 정인수",
  description:
    "7년 6개월 마케팅 강의. 정부 부처·대학·창업지원센터·협회·기업·1인샵까지 3 Tier 풀 강의 이력. KOICA 해외봉사단 고향방문단 국내 교육 포함.",
};

function getTeachingPhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "photos", "teaching");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort()
      .map((f) => `/photos/teaching/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

export default function Teaching() {
  const photos = getTeachingPhotos();
  return (
    <>
      <TeachingHero photos={photos} />
      <TeachingTiers photos={photos} />
    </>
  );
}
