/**
 * 사이트 최상위 페이지 목록 — 단일 출처.
 *
 * 상단 메뉴 · 푸터 · 모바일 하단 바 · 페이지 끝 「다음 읽기」가 전부 이 배열을
 * 본다. 네 군데에 따로 적으면 페이지가 늘거나 이름이 바뀔 때 반드시 어긋난다.
 */
export type SiteLink = {
  href: string;
  /** 상단 메뉴 표기 (영문) */
  label: string;
  /** 한글 이름 — 푸터 · 모바일 바 */
  ko: string;
  /** 「다음 읽기」 카드에 붙는 한 줄 */
  blurb: string;
};

export const SITE_LINKS: SiteLink[] = [
  {
    href: "/",
    label: "Home",
    ko: "홈",
    blurb: "17년 마케터가 AI 빌더로 — 전체 그림 한 장",
  },
  {
    href: "/about",
    label: "About",
    ko: "소개",
    blurb: "어떤 사람인지 · 무엇을 기준으로 판단하는지",
  },
  {
    href: "/career",
    label: "Career",
    ko: "경력",
    blurb: "17년 4개월 · 회사가 아니라 남긴 임팩트로",
  },
  {
    href: "/builder",
    label: "AI Builder",
    ko: "AI 빌더",
    blurb: "11개 라이브 SaaS · 81 자동화 시나리오 · 직접 만든 것들",
  },
  {
    href: "/marketing",
    label: "Marketing",
    ko: "마케팅",
    blurb: "TMON ROAS 7,404% · 광고 운영과 강의",
  },
  {
    href: "/gallery",
    label: "Gallery",
    ko: "갤러리",
    blurb: "MCS로 만든 결과물 — 목업 없이 나온 그대로",
  },
];

/** 현재 경로 다음에 읽을 페이지. 목록의 끝에서는 처음으로 돌아온다. */
export function nextLink(currentHref: string): SiteLink {
  const i = SITE_LINKS.findIndex((l) => l.href === currentHref);
  return SITE_LINKS[(i + 1) % SITE_LINKS.length] ?? SITE_LINKS[0];
}

/** 현재 경로 이전 페이지. 목록의 처음에서는 끝으로 돌아간다. */
export function prevLink(currentHref: string): SiteLink {
  const i = SITE_LINKS.findIndex((l) => l.href === currentHref);
  const at = i < 0 ? 0 : i;
  return SITE_LINKS[(at - 1 + SITE_LINKS.length) % SITE_LINKS.length];
}
