export type ImpactStream = {
  id: string;
  number: string;
  title: string;
  bullets: string[];
  companies: string[];
};

export type Company = {
  period: string;
  company: string;
  role: string;
  salary?: string;
  impact: string;
  current?: boolean;
};

export const IMPACT_STREAMS: ImpactStream[] = [
  {
    id: "ai-builder",
    number: "01",
    title: "AI Builder · 풀사이클 자동화",
    bullets: [
      "100+ Vibe Coding 자체 시스템 1인 개발",
      "자동화 시나리오 81 (정부지원사업·10X 콘텐츠·계약서+GA4·뉴스레터/웹 크롤링...)",
      "데이터 크롤링·OCR·웹스크랩·자동 발행 + AI Prompt SEO",
      "멀티 LLM 통합 (Claude · GPT · Gemini · Perplexity)",
    ],
    companies: ["팔레트 ㈜ Agent 본부 팀장", "솔찍한인쌤 (병행)"],
  },
  {
    id: "ai-saas-pl",
    number: "02",
    title: "AI SaaS PL · 클라이언트 4건 진행 중",
    bullets: [
      "호반그룹 · 서울법무법인 · 아주그룹 · Palette OS Agent",
      "클라이언트 시스템 기획 + 개발 리딩",
    ],
    companies: ["팔레트 ㈜"],
  },
  {
    id: "ai-content-op",
    number: "03",
    title: "AI Content Operation · 16+ 기업 운영",
    bullets: [
      "성동청년이룸창업지원센터 (+2 입주기업) · 고려대학교기술지주 (+5 입주기업) · 제2서울핀테크랩 (+5 입주기업) · 서울도시철도엔지니어링 · 시스트란 · 모두솔루션 · 리부트라이프",
      "콘텐츠 자동화 + 데이터 기반 마케팅 전략 운영 — 인큐베이터/센터 안 입주기업 직접 운영 포함",
    ],
    companies: ["팔레트 ㈜"],
  },
  {
    id: "ad-ops",
    number: "04",
    title: "광고 운영·총괄 (10년+ 누적)",
    bullets: [
      "티몬 공식 광고대행, 연 40~60억 광고비 총괄 (9개월)",
      "전국 30지점·카페 4지점, 연 20억+ 광고비 총괄 (1년 3개월)",
      "월 3,000만원 광고비 절감 + 네이버 검색광고·SNS 각 월 1억+",
      "Naver · Daum · Kakao · Google · SNS · GDN 통합 운영",
    ],
    companies: ["퍼포먼스디자인", "퍼스트 아카데미", "프랜차이즈산업연구원"],
  },
  {
    id: "pm",
    number: "05",
    title: "종합홍보 PM · 20+ 프로젝트",
    bullets: [
      "농림축산식품부 · 조달청 · 한국벤처투자 · 창업진흥원 (2023 과업 총괄 PM) + 14건+",
      "마케팅·홍보 PM + 마케팅실 직원·AI Agent 직원 관리",
      "Owned Media (Blog·SNS·YouTube) + Paid Media (Naver·Kakao·Google·Instagram·Facebook·GDN)",
    ],
    companies: ["Capsule Media (팔레트 그룹)"],
  },
  {
    id: "teaching",
    number: "06",
    title: "마케팅 강의 · 7년 6개월 (병행)",
    bullets: [
      "AI 강의 — 정부 부처 · 창업지원센터 (성동청년이룸·한국산림복지진흥원·제2서울핀테크랩·고려대기술지주)",
      "마케팅 강의 — KOICA·대학·소상공인·기업·자영업자",
      "블로그 기초 → 마케팅 활용 / 지식인 / 검색광고 / 플레이스 / 온라인 마케팅 기획·운영",
    ],
    companies: ["솔찍한인쌤"],
  },
];

export const CAREER_FULL: Company[] = [
  {
    period: "2023.04~ 재직중",
    company: "팔레트 ㈜",
    role: "Agent 본부 팀장",
    salary: "6,500만원",
    impact:
      "AI Builder 100+ 자체 시스템 / AI SaaS PL 4건 / AI Content Operation 16+ 기업 운영",
    current: true,
  },
  {
    period: "2018.09~2026.02 (7년 6개월)",
    company: "솔찍한인쌤",
    role: "프리랜서 (병행)",
    salary: "2,000만원",
    impact:
      "AI 강의 (정부 부처·창업지원센터) + 마케팅 강사 (KOICA·대학·소상공인·기업·자영업자)",
  },
  {
    period: "2022.08~2023.04 (9개월)",
    company: "퍼포먼스디자인",
    role: "운영총괄실장",
    salary: "6,000만원",
    impact:
      "티몬 공식 광고대행 연 40~60억 광고비 총괄 + 화장품·가전·성형외과 마케팅 + 나라장터 제안",
  },
  {
    period: "2022.05~2022.08 (4개월)",
    company: "프랜차이즈산업연구원",
    role: "마케팅 책임연구원/실장",
    salary: "5,500만원",
    impact: "광고대행사 마케팅 전략실",
  },
  {
    period: "2022.06~2022.08 (3개월)",
    company: "㈜브랜딩파트너스",
    role: "단기",
    impact: "—",
  },
  {
    period: "2021.09~2022.06 (10개월)",
    company: "㈜한국바리스타자격검정협회",
    role: "단기",
    impact: "—",
  },
  {
    period: "2021.03~2022.05 (1년 3개월)",
    company: "퍼스트 아카데미 본사",
    role: "마케팅 총괄팀장",
    salary: "4,600만원",
    impact:
      "전국 30지점·카페 4지점 연 20억+ 광고비 / 월 3,000만원 절감 / 네이버 검색광고·SNS 각 월 1억+",
  },
  {
    period: "2020.06~2021.03 (10개월)",
    company: "중앙대학교 사회교육처",
    role: "실장",
    salary: "4,200만원",
    impact:
      "평생교육원 입학·홍보 모집 총괄 + 광고대행사 관리 + DA·네이버 애널리틱스",
  },
  {
    period: "2017.06~2020.05 (3년)",
    company: "글로리아교육재단 ㈜",
    role: "입학관리처 팀장 3년차",
    salary: "4,200만원",
    impact:
      "한국항공전문/국제호텔전문 — 블로그·지식인·파워링크·파워컨텐츠 + 전국 고교·학원 방문 홍보 + B2C 입학상담·유치",
  },
  {
    period: "2017.01~2017.05 (5개월)",
    company: "(강남에듀)강남직업전문학교",
    role: "입학관리처 팀장 1년차",
    salary: "3,700만원",
    impact: "검색광고·홈페이지 리뉴얼·과정별 안내문·MOU",
  },
  {
    period: "2015.07~2016.09 (1년 3개월)",
    company: "설봉학원 SB사이버평생교육원",
    role: "교학지원팀 과장",
    salary: "3,200만원",
    impact: "학점은행제 + B2B 기업협약",
  },
  {
    period: "2013.11~2015.07 (1년 9개월)",
    company: "KG 패스원 사회교육원",
    role: "평생교육사업부 대리",
    salary: "3,600만원",
    impact: "매출 1~2위 유지 + 최대 1,500명 회원관리",
  },
  {
    period: "2012.11~2013.10 (1년)",
    company: "이페이저 팬에듀케이션",
    role: "교육마케팅 사원",
    salary: "2,500만원",
    impact: "입사 4개월차 신규매출 1위",
  },
  {
    period: "2012.04~2012.09 (6개월)",
    company: "㈜재능교육",
    role: "학습지선생님",
    salary: "2,800만원",
    impact: "유아~중등 교육·학부모 상담",
  },
  {
    period: "2010.03~2012.02 (2년)",
    company: "영동대학교 학과조교",
    role: "사원 2년차",
    salary: "1,800만원",
    impact: "우수교직원 수상 + 학교·학과 행정 + 재학생 관리",
  },
  {
    period: "2006.07~2006.08 (2개월)",
    company: "㈜제원인터내쇼날",
    role: "단기",
    impact: "—",
  },
  {
    period: "2001.10~2002.11 (1년 2개월)",
    company: "㈜캐드뱅크산업디자인학원",
    role: "교육부서 주임 (최연소)",
    salary: "2,700만원",
    impact: "교육상담·회원관리·학원 프로그램 (최연소 주임 승진)",
  },
];
