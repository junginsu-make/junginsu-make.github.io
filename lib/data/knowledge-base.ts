// 채팅 위젯 지식베이스 — 사이트 콘텐츠 + 이력서 통합
// 사용처: functions/api/chat.ts (system prompt에 주입)
// 갱신 시: lib/data/* 변경 후 이 파일 동기화

import { RESUME_TEXT } from "./resume";

const SITE_OVERVIEW = `
[사이트 개요]
- URL: https://isjung.mktinsight.kr/
- 작성자: 정인수 (Marketer · AI Builder · AI SaaS)
- 한 줄 선언: "AI 시대를 만난 17년 Marketer가, AI Builder로 다시 태어났습니다"
- 4 핵심 지표: 17년 Career · 43 Vibe Coding Repos · 81 자동화 시나리오 · 10 Live SaaS

[페이지 구조]
- / (홈) — 소개, 4 지표, AI Builder + Marketer 양면
- /builder — AI Builder 전체 (43 Vibe Coding · 81 자동화 시스템 · 10 SaaS · 4 핵심 시나리오)
- /career — 경력 (17년 4개월) · Impact Streams 4종
- /marketing — 마케팅 포트폴리오 (TMON ROAS 7,404% · 광고대행 경력)
- /about — 자기소개 · 가치관 · 강의 · 자격
`;

const IMPACT_STREAMS = `
[4 Impact Streams]
1. AI Builder · 풀사이클 자동화 — 100+ Vibe Coding 자체 시스템 1인 개발, 자동화 시나리오 81 (정부지원사업·10X 콘텐츠·계약서·GA4·뉴스레터·웹크롤링), 멀티 LLM 통합(Claude·GPT·Gemini·Perplexity) — 팔레트 ㈜ Agent 본부 팀장 (AI Builder 2024.10 ~) + 솔찍한인쌤 병행
2. AI SaaS PL · 4건 진행중 — 대형 건설·부동산 그룹, 대형 법무법인, 대기업 그룹사, Palette OS Agent — 클라이언트 시스템 기획 + 개발 리딩 — 팔레트 ㈜ (고객사 실명은 비공개이므로 챗봇도 실명을 밝히지 않는다)
3. AI Content Operation · 18+ 기업 운영 — 성동청년이룸창업지원센터(+2), 고려대학교기술지주(+5), 제2서울핀테크랩(+5), 서울도시철도엔지니어링, 시스트란, 모두솔루션, 리부트라이프 — 팔레트 ㈜
4. AI 강의 — 정부 부처·창업지원센터·국제협력단 코이카·대학교·소상공인 이사회·기업 대상 — 솔찍한인쌤 (병행)
`;

const TECH_STACK = `
[기술 스택 (50+ 항목)]
- AI 모델: Claude · GPT · Gemini · Perplexity · Flux · Veo · Kling · Nano Banana · GPT Image · Suno · ElevenLabs · Castsome · Whisper TTS
- 워크플로우/자동화: 자동화 시나리오 (Make.com) · n8n · LangGraph · APScheduler · MCP (Model Context Protocol)
- 데이터 수집·검색: SerpAPI · Apify · DataForSEO · Naver API · YouTube Data API · RSS/HTTP · Bizinfo (정부지원) · GA4
- 발행/SNS: WordPress REST · Instagram Graph · YouTube Upload · TikTok · Naver Blog · Solapi (KakaoTalk) · Slack · Google Chat
- 문서/파일: Airtable · Notion · Google Docs · Google Drive · Dropbox · PDF.co OCR · CloudConvert
- 프레임워크/인프라: Next.js 16 · React 19 · Tailwind v4 · GSAP · Lenis · Cloudflare Pages · Vercel
`;

const SAAS_LIVE = `
[10 Live SaaS]
※ 아래 10개 SaaS는 모두 정인수가 혼자 기획·설계·구현·검증·배포까지 전 과정을 수행한 1인 풀사이클 결과물이다. (노출 순서 기준)
1. Palette OS Agent — 사내 AI OS · Synapse, 12 가상직원 + 20 AI 에이전트 OS
2. Lumio Video (https://lumio-video.vercel.app/) — AI 영상 생성/편집 SaaS
3. Naver Shopping Insight (https://shopping.mktinsight.kr/) — 네이버 쇼핑 상품 성장 인텔리전스. 상품 URL 하나로 실제 노출 점수·Top10 진입률·30일 클릭 추이·키워드 수요·시장 관심 구성비(기기·성별·연령)·경쟁상품 Top20·리뷰·실행 액션을 한 화면에. 실제 순위 vs API 추정 순위 구분, DataLab 시장 트렌드 탐색, 거래 기회 분석·상품 비교, Chrome 확장 수집기. 매출은 순위로 역산하지 않고 수집 데이터 기반 기회 지표로만 표시. 공개 데모는 로그인 불필요.
4. Place Insight (https://place.mktinsight.kr/) — 네이버 플레이스 순위 관리 + 상권·부동산 공공데이터를 한 화면에 묶은 점포 의사결정 SaaS. 경쟁 상위 10곳 실측 비교(리뷰 227/430=203건 부족처럼 정확한 수치), 오늘 할 일 우선순위 실행 카드(근거·실행단계·확인시점), 가짜 데이터 없음(없으면 판단 보류 명시), 업종별 지표 자동 분리, 매일 07시 내·경쟁 순위 자동 추적(플레이스 7영역), 상권·인구·부동산 실거래·상가 계약 위험 사전 점검(소상공인·SGIS·국토부·청약홈·ECOS 공공데이터).
5. Factto (https://image-insight-tau.vercel.app/) — 사실로 쓰는 SEO 블로그 자동 생성. 이미지·네이버 플레이스 실데이터에서 사실만 추출(무 할루시네이션), 다중 AI 교차검증 이미지 분석, 표절 없는 경쟁분석(상위 글 통계만 참고), SEO 실전 튜닝, AI 이미지 승인제(fal.ai), Image Blog + Place Blog 2 시스템.
6. MKT Automation — 네이버·구글·블로그·SNS·YouTube 단일 워크플로우 마케팅 OS
7. AI 상세페이지 스튜디오 (https://page.mktinsight.kr/) — 상품 사진 한 장으로 이커머스 상세페이지를 새로 만들고 기존 페이지를 전환율 중심으로 리디자인하는 AI 통합 스튜디오. 히어로·문제제기·베네핏·근거·사용법 등 섹션 구조 자동 설계, 모델컷·연출컷·플랫레이 2K 고해상도 생성(Nano Banana Pro / Gemini 3 Pro Image), 갤러리 검토(격자·이어보기·모달)·섹션 순서 변경·재생성·레이어 편집, 새로 만들기(Create)+리디자인(Redesign) 2 도구 통합, 개인 키(브라우저 저장)+결과물 보관함(IndexedDB). 한이룸 상세페이지 도구 2건(redesign-maker+pdp-maker) 통합 현행 최신 시스템.
8. Tickpoint (https://tickpoint.co.kr/) — 한국 주식 트레이딩 인텔리전스. KOSPI·KOSDAQ 2,769 종목을 멀티 LLM(Claude·GPT·Gemini·Perplexity)으로 통합 분석. 변동성 수축 패턴 시그널 + 9 백테스트 KPI + 24 이슈 종목 자동 큐레이션 + 80+ 시그널 + 시장 심리 게이지 + 자동매매 시스템 + 섹터 히트맵.
9. Architect (아키텍처 시스템) — AI 비즈니스 진단 + 제안서·PRD 동시 자동 생성
10. ProPintel — 부동산 인텔리전스

[4 핵심 자동화 시나리오 (81개 중 대표)]
1. 정부지원사업 크롤링 · 사업계획서 자동화 (Webhook → Airtable → CloudConvert/PDF.co → OpenAI 6+ 분기 → Google Docs) — 24+ 공고 누적
2. 10X 콘텐츠 자동화 (Webhook → Airtable → OpenAI 1차 → HTTP/Sleep → Iterator → OpenAI 2차 → WordPress 5채널 분기 → GDrive → Airtable) — Published Blog 6+ / Deep Dive 18+
3. 계약서 관리 시스템 + GA4 분석 자동화 (Drive Watch Folder → PDF Convert → OpenAI Generate → JSON Parse → Airtable + 폴더 라우팅)
4. 뉴스레터 / 웹사이트 크롤링 후 콘텐츠 생성·업로드 자동화

[자동화 시스템 카테고리 (81개 분포)]
- 콘텐츠 자동화 (5+): 구글 트렌드 블로그+릴스 / AI 유튜브 쇼츠 / AI 뉴스 쇼츠 등
- 블로그·워드프레스 자동화 (3)
- SEO·데이터 분석 자동화 (4)
- 공공데이터·정부지원사업 자동화 (2)
- AI 이미지·음성 자동화 (3)
- 정보 수집·뉴스 큐레이션 (2)
`;

const MARKETING_PORTFOLIO = `
[마케팅 포트폴리오 — TMON ROAS 7,404% 검증]
- 회사: 퍼포먼스디자인 (이커머스 티몬 공식 광고대행사, 운영총괄실장, 2022.08~2023.04)
- 광고비: 연 40~60억 총괄 운영
- ROAS: 3,516% → 7,404% (▲ 3,888%p)
- GR: 208억 → 288억 (▲ 79.4억+)
- BU: 94,153 → 180,713 (▲ 86,560명)
- CPBU: 4,709원 → 2,365원 (▼ -50% 절감)

[Capsule Media · 종합홍보 PM (4 대표 + 14건)]
- 농림축산식품부 (소셜미디어·마케팅 홍보 영역 PM)
- 조달청 (소셜미디어·마케팅 홍보 영역 PM)
- 한국벤처투자 (과업 총괄 PM)
- 창업진흥원 (2023년도 과업 총괄 PM)
- 그 외 +14건

[퍼스트 아카데미 본사 — 마케팅 총괄팀장 (2021.03~2022.05)]
- 광고비 연 20억+, 전국 30지점 + 카페 4지점
- 월 3,000만원 광고비 절감 / 광고효과 및 신규고객 유입 상승
- 네이버 검색광고 월 1억+, SNS 광고 월 1억+, 리타겟팅
- 네이버 VIEW 2달간 100건+ 포스팅 상위노출 성공
- 상위 1% 개인 블로그 4개

[광고 채널 운영 경험]
- Owned: Blog · SNS · YouTube
- Paid: Naver · Kakao · Google · Instagram · Facebook · GDN
`;

const TEACHING = `
[강의·교육 활동 (17년)]
- Tier 1 (정부·공공·대학·AI 기관):
  · 국제협력단 KOICA 해외봉사단 — 고향방문단 국내 교육
  · 한국산림복지진흥원 AI 교육
  · 제2서울핀테크랩 AI 교육
  · 성동청년창업이룸센터 AI 교육
  · 고려대학교기술지주 AI 교육
  · 청운대학교 — 호텔 연회장 60명+ 심층 세미나
- Tier 2 (학원·연합회): 메가스터디 더조은컴퓨터학원 · 동작구 소상공인 연합회 · 서대문구 학원협회 50여 곳 · KCT 보습학원 · 헬로우뮤지엄 미술관 · 전국 태권도장·합기도장 관장 300여명 · 세무사 모임 · 인테리어 디자이너
- Tier 3 (자영업·개인): 영업 직원 · 개인 블로그모임 · 작가 · 명품시계 AS센터 · 1인 네일샵 · Y-GYM · 음악학원 · 아샤 아카데미 · 1인샵 안마원 · 대전 이사업체 · 경기도 청소업체 · 수원 부동산 · 퍼스트 아카데미 등
`;

const CERTIFICATIONS = `
[자격증 (대표 11종)]
- 2025.02 AIPOT 프롬프트엔지니어링 2급 (한국생산성본부 KPC)
- 2022.07 검색광고마케터 1급 (한국정보통신진흥협회 KAIT)
- 2022.05 SNS광고마케터 1급 (한국정보통신진흥협회 KAIT)
- 2018 CS강사 1급, 서비스이미지컨설턴트 강사양성 100h (아샤서비스아카데미)
- 2012.04 워드프로세서 1급 (대한상공회의소)
- 2011.10 고객관리지도사 1급, 리더쉽지도사 1급, 스피치지도사 2급 (한국경영인재개발원)
- 2010.03 사회복지사 2급 (한국사회복지사협회/보건복지가족부, 제2-261521호)
- 2010.02 컴퓨터활용능력 2급 (대한상공회의소)
- 2002.07 1종보통운전면허 (경찰청)
`;

const PUBLIC_LINKS = `
[공개 링크 — 답변에 자유롭게 사용 가능]
- 포트폴리오 메인: https://isjung.mktinsight.kr/
- 블로그: https://blog.naver.com/sbcyberpass
- Tickpoint SaaS: https://tickpoint.co.kr/
- Lumio Video: https://lumio-video.vercel.app/
- Factto (사실 기반 SEO 블로그): https://image-insight-tau.vercel.app/
- Naver Shopping Insight (네이버 쇼핑 상품 성장 인텔리전스): https://shopping.mktinsight.kr/
- Place Insight (네이버 플레이스 순위 + 상권·부동산 점포 의사결정): https://place.mktinsight.kr/
- AI 상세페이지 스튜디오 (사진 1장으로 이커머스 상세페이지 생성·리디자인): https://page.mktinsight.kr/
- 이메일: 9843ohs@gmail.com

[운영 사이트]
- ProPintel · Tickpoint · Lumio · Factto · Naver Shopping Insight · Place Insight · AI 상세페이지 스튜디오 · 자체 시스템 다수
`;

export const KNOWLEDGE_BASE = [
  SITE_OVERVIEW,
  IMPACT_STREAMS,
  TECH_STACK,
  SAAS_LIVE,
  MARKETING_PORTFOLIO,
  TEACHING,
  CERTIFICATIONS,
  PUBLIC_LINKS,
  "\n=== 이력서 (정인수, 2026-05-05) ===\n",
  RESUME_TEXT,
].join("\n");

export const KNOWLEDGE_BASE_VERSION = "2026-07-22-v11";
