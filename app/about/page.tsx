import { Hero } from "@/components/about/hero";
import { Chapters } from "@/components/about/chapters";
import { DualityVenn } from "@/components/about/duality-venn";

export const metadata = {
  title: "About — 정인수",
  description:
    "1983년생 영동대 사회복지학과 출신, 17년 영업·마케팅·강사 경력. AI 시대를 만난 풀사이클 빌더.",
};

export default function About() {
  return (
    <>
      <Hero />
      <Chapters />
      <DualityVenn />
    </>
  );
}
