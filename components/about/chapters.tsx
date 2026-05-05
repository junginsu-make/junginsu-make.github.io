"use client";

const CHAPTERS = [
  {
    number: "01",
    period: "1983 — 2001",
    title: "성장기",
    body: "군 장교 출신이자 성직자인 부친과 약 40년 자영업을 운영해 오신 어머니 밑에서 형과 함께 성장. 군인 집안 위계질서 + 성직자 가정의 희생 · 봉사 · 책임감 · 정직함을 가정에서 학습.",
    side: "left" as const,
  },
  {
    number: "02",
    period: "2001 — 2010",
    title: "전환점 — 군대 → 늦깎이 대학 → 우수교직원",
    body: "군대에서 부적응병사 · 신임병사 상담을 시작하면서 사람과 대화하는 일에 흥미. 말년휴가에 수능 재응시. 영동대학교 사회복지학과 입학. 봉사동아리 '훈민정음' 회장, 사회복지학과 총 학회장, 16대 총학생회 복지국장. 졸업 후 학과조교 — 우수교직원 수상.",
    side: "right" as const,
  },
  {
    number: "03",
    period: "2001 — 2024",
    title: "영업 · 마케팅 17년 (영업력에서 마케팅 전문성으로)",
    body: "캐드뱅크 산업디자인학원 최연소 주임 → 평생교육 · 학원 마케팅 → 글로리아교육재단 (한국항공/국제호텔전문 — 블로그 · 지식인 · 파워링크 · B2B 학생유치) → 중앙대 사회교육처 입학 · 홍보 모집 총괄 → 퍼스트 아카데미 본사 마케팅 총괄팀장 (전국 30지점 · 연 20억+ 광고비) → 퍼포먼스디자인 운영총괄실장 (티몬 공식 광고대행, 연 40~60억 광고비 총괄). 키워드 · 블로그 · SNS · SEO · DA · 검색광고 · GDN — 풀사이클 마케터.",
    side: "left" as const,
  },
  {
    number: "04",
    period: "2018 — 2024",
    title: "강의 진입 — 솔찍한인쌤 (병행 7년 6개월)",
    body: "2018년부터 마케팅 강사로 시작. KOICA 해외봉사단, 청운대학교, 메가스터디 더조은컴퓨터학원, 동작구 소상공인 연합회, 헬로우뮤지엄 미술관, 전국 태권도장 · 합기도장 관장 300+, 서대문구 학원협회 50+, 인테리어 디자이너 · 세무사 모임 등 31 강의처. 블로그 기초 → 마케팅 활용까지.",
    side: "right" as const,
  },
  {
    number: "05",
    period: "2024 — 현재",
    title: "풀사이클 AI 빌더",
    body: "2024년 10월 자동화 시나리오 실습으로 시작. 11개월 만에 자체 시스템 100+ 1인 개발, Vibe Coding 43, 6 라이브 SaaS (Tickpoint · Lumio · OS Agent · MKT Automation · PropIntel · 아키텍처). 자동화 시나리오 81 (4 핵심). AI SaaS PL 진행 중 — 호반그룹 · 서울법무법인 · 아주그룹 · Palette OS Agent. AI Content Operation — 성동청년이룸 (+2) · 고려대기술지주 (+5) · 제2서울핀테크랩 (+5) 외 단일 4개사 = 총 18+ 기업 운영.",
    side: "left" as const,
  },
];

export function Chapters() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-32 bg-[var(--bg)] text-[var(--fg)]">
      <p className="text-meta opacity-50 mb-8">5 CHAPTERS</p>
      <h2 className="text-display-md font-display mb-24 max-w-[12ch] break-keep">
        한 사람의 궤적은 우연히 그려지지 않는다.
      </h2>
      <div className="space-y-32 md:space-y-40">
        {CHAPTERS.map((c) => (
          <article
            key={c.number}
            className={`grid md:grid-cols-12 gap-8 border-t border-[var(--line)] pt-12 ${
              c.side === "right"
                ? "md:[&>div:first-child]:order-2 md:[&>div:first-child]:text-right"
                : ""
            }`}
          >
            <div className="md:col-span-2">
              <p className="text-display-md font-display opacity-30">
                {c.number}
              </p>
              <p className="text-meta opacity-60 mt-3">{c.period}</p>
            </div>
            <div className="md:col-span-10">
              <h3 className="text-display-md font-display mb-6 lg:whitespace-nowrap">
                {c.title}
              </h3>
              <p className="text-body-lg opacity-90 leading-relaxed">
                {c.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
