export type CertVisual = {
  name: string;
  year: string;
  issuer: string;
  code?: string;
  image: string;
};

export type CertText = {
  name: string;
  year: string;
  issuer: string;
};

export const CERTS_VISUAL: CertVisual[] = [
  {
    name: "AIPOT 프롬프트엔지니어링 2급",
    year: "2025.02",
    issuer: "한국생산성본부 KPC",
    image: "/certifications/aipot.jpg",
  },
  {
    name: "검색광고마케터 1급",
    year: "2022.07",
    issuer: "한국정보통신진흥협회 KAIT",
    image: "/certifications/search-ad.jpg",
  },
  {
    name: "SNS광고마케터 1급",
    year: "2022.05",
    issuer: "한국정보통신진흥협회 KAIT",
    image: "/certifications/sns-ad.jpg",
  },
];

export const CERTS_TEXT: CertText[] = [
  {
    name: "CS강사 1급 (제18ASHA38180호)",
    year: "2018",
    issuer: "아샤서비스아카데미",
  },
  {
    name: "서비스 및 이미지컨설턴트 강사양성과정 100h",
    year: "2018",
    issuer: "아샤서비스아카데미",
  },
  {
    name: "스피치지도사 2급 · 리더십지도사 1급 · 고객관리지도사 1급",
    year: "2011",
    issuer: "한국경영인재개발원 KMRD",
  },
  {
    name: "사회복지사 2급 (제2-261521호)",
    year: "2010",
    issuer: "한국사회복지사협회/보건복지가족부",
  },
  { name: "워드프로세서 1급", year: "2012", issuer: "대한상공회의소" },
  { name: "컴퓨터활용능력 2급", year: "2010", issuer: "대한상공회의소" },
  { name: "1종보통운전면허", year: "2002", issuer: "경찰청" },
];
