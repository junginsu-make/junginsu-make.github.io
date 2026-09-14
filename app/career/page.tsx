import { NextRead } from "@/components/layout/next-read";
import {
  ImpactStreams,
  ImpactStreamsList,
} from "@/components/career/impact-streams";
import { CompanyTimelineToggle } from "@/components/career/company-timeline-toggle";
import { Certifications } from "@/components/career/certifications";

export const metadata = {
  description:
    "17년 4개월. 17 회사보다 6 임팩트 스트림으로 본 경력. AI Builder · AI SaaS PL · AI Content Op · 광고 운영 10년+ · 종합홍보 PM 20+ · 마케팅 강의 7년 6개월.",
};

export default function Career() {
  return (
    <>
      <ImpactStreams />
      <ImpactStreamsList />
      <CompanyTimelineToggle />
      <Certifications />
      <NextRead current="/career" />
    </>
  );
}
