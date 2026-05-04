import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SAAS_LIST } from "@/lib/data/saas";
import { SaasHero } from "@/components/builder/saas-detail/hero";
import { SaasProblemOutcome } from "@/components/builder/saas-detail/problem-outcome";
import { SaasCapabilities } from "@/components/builder/saas-detail/capabilities";
import { SaasMetrics } from "@/components/builder/saas-detail/metrics";
import { SaasGallery } from "@/components/builder/saas-detail/full-gallery";
import { SaasNav } from "@/components/builder/saas-detail/prev-next";

export function generateStaticParams() {
  return SAAS_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const saas = SAAS_LIST.find((s) => s.slug === slug);
  if (!saas) return { title: "Not Found" };
  return {
    title: `${saas.name} — AI Builder · 정인수`,
    description: saas.tagline,
  };
}

/**
 * 빌드 시 public/saas-folders/{slug}/ 의 webp 파일 목록을 읽어 정렬해 반환.
 * 파일명이 timestamp 형식이라 정적 매핑 불가능 → server component에서 fs로 동적 조회.
 */
function getGalleryImages(folderPath: string): string[] {
  try {
    const dir = path.join(
      process.cwd(),
      "public",
      folderPath.replace(/^\//, ""),
    );
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort();
    return files.map((f) => `${folderPath}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

export default async function SaasDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const saas = SAAS_LIST.find((s) => s.slug === slug);
  if (!saas) notFound();

  const galleryImages = getGalleryImages(saas.folderPath);

  return (
    <>
      <SaasHero saas={saas} />
      <SaasProblemOutcome saas={saas} />
      <SaasCapabilities saas={saas} galleryImages={galleryImages} />
      <SaasMetrics saas={saas} />
      <SaasGallery saas={saas} galleryImages={galleryImages} />
      <SaasNav currentSlug={slug} />
    </>
  );
}
