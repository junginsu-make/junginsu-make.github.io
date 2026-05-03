export type Tier1Card = {
  name: string;
  category: "정부" | "공공" | "대학" | "AI 교육";
  image: string;
  desc?: string;
};

export type Tier2Card = {
  name: string;
  image?: string;
};

export const TIER1: Tier1Card[] = [
  {
    name: "국제협력단 KOICA 해외봉사단",
    category: "정부",
    image: "/photos/teaching/IMG_1187.jpg",
    desc: "고향방문단 국내 교육",
  },
  {
    name: "한국산림복지진흥원 AI 교육",
    category: "AI 교육",
    image: "/photos/teaching/p1070868.jpg",
    desc: "정부 산하 기관",
  },
  {
    name: "제2서울핀테크랩 AI 교육",
    category: "AI 교육",
    image: "/photos/teaching/p1070-fintech.jpg",
    desc: "서울시 공공 핀테크 인프라",
  },
  {
    name: "성동청년창업이룸센터 AI 교육",
    category: "AI 교육",
    image: "/photos/teaching/seongdong.jpg",
    desc: "성동구 공공 창업 지원",
  },
  {
    name: "고려대학교기술지주 AI 교육",
    category: "AI 교육",
    image: "/photos/teaching/korea-univ.jpg",
    desc: "대학 산학협력",
  },
  {
    name: "청운대학교",
    category: "대학",
    image: "/photos/teaching/dsc01363.jpg",
    desc: "호텔 연회장 60명+ 심층 세미나",
  },
];

export const TIER2: Tier2Card[] = [
  { name: "메가스터디 더조은컴퓨터학원" },
  { name: "동작구 소상공인 연합회" },
  { name: "서대문구 학원협회 50여 곳" },
  { name: "KCT 보습학원" },
  { name: "헬로우뮤지엄 미술관" },
  { name: "전국 태권도장·합기도장 관장 300여명" },
  { name: "세무사 모임" },
  { name: "인테리어 디자이너" },
];

export const TIER3: string[] = [
  "영업 직원",
  "개인 블로그모임",
  "작가",
  "에이스 인쇄·제본",
  "명품시계 AS센터",
  "1인 네일샵",
  "의정부 컴퓨터 AS센터",
  "Y-GYM",
  "음악학원",
  "아샤 아카데미",
  "1인샵 윤정문 안마원",
  "대전 이사업체",
  "경기도 청소업체",
  "수원 삼성경매공인 부동산",
  "퍼스트 아카데미",
];

// 강의 사진 자동 롤링 캐러셀 (56장 풀 — capture script가 public/photos/teaching/ 채움)
// 캐러셀 컴포넌트가 디렉토리 스캔 (또는 manifest)
export const TEACHING_HERO =
  "/photos/teaching/KakaoTalk_20200102_190424548_01.jpg";
