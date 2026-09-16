import type { Metadata } from "next";
import { NextRead } from "@/components/layout/next-read";
import { GalleryMasonry } from "@/components/gallery/masonry";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { getGalleryItems } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery — 만든 것들",
  description:
    "MCS(Marketing Content Studio)로 만든 카드뉴스 · 광고 소재 · 포스터 · 상세페이지 · 영상. 목업 없이 결과물 그대로.",
};

export default function GalleryPage() {
  const items = getGalleryItems();
  const videos = items.filter((i) => i.kind === "video").length;

  return (
    <>
      <section className="px-6 md:px-10 lg:px-16 xl:px-24 pt-40 pb-12 md:pb-16">
        <div className="flex items-baseline justify-between mb-10 md:mb-12">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>GALLERY · 만든 것들</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            {items.length.toString().padStart(2, "0")}
            {videos > 0 ? ` · 영상 ${videos}` : ""}
          </span>
        </div>

        <ScrollReveal>
          <h1 className="text-display-lg md:text-display-xl font-display leading-[1.02] tracking-[-0.03em] max-w-[16ch]">
            목업이 아니라 <WordHighlight delay={0.9}>결과물</WordHighlight>
          </h1>
          <p className="mt-8 text-body-lg opacity-70 leading-[1.7] max-w-[62ch]">
            전부 MCS로 실제로 만든 것입니다. 틀에 끼워 넣거나 후보정하지 않고 나온
            그대로 걸었습니다. 비율이 제각각인 것도 손대지 않았습니다 — 무엇을
            만들 수 있는지는 그 들쭉날쭉함이 더 정직하게 보여줍니다.
          </p>
        </ScrollReveal>
      </section>

      <section className="px-2 md:px-3 pb-24 md:pb-32">
        {items.length > 0 ? (
          <GalleryMasonry items={items} />
        ) : (
          <div className="mx-4 md:mx-8 border border-dashed border-[var(--line)] rounded-xl py-20 px-6 text-center">
            <p className="text-body-lg opacity-70">아직 걸린 결과물이 없습니다.</p>
            <p className="mt-3 text-meta opacity-45">
              public/gallery/ 에 이미지·영상을 넣고 배포하면 여기에 자동으로 채워집니다
            </p>
          </div>
        )}
      </section>

      <NextRead current="/gallery" />
    </>
  );
}
