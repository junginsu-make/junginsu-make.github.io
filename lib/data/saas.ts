import {
  SAAS_DIFFERENTIATION,
  type Differentiation,
} from "./saas-differentiation";

export type { Differentiation, PipelineStage, Refusal } from "./saas-differentiation";

export type SaaSDetail = {
  slug: string;
  order: number;
  name: string;
  tagline: string;
  liveUrl: string;
  tone: "dark" | "light";
  toneNote: string;
  since?: string;
  capabilities: { title: string; description: string; image?: string }[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  github?: string;
  folderImageCount: number;
  folderPath: string; // public/saas-folders/<slug>/
  capturedSlug: string; // public/captured/<slug>/...
  iconName: string;
  developer?: string;
  contactEmail?: string;
  problemStatement?: string; // "왜 이 SaaS를 만들었나"
  outcome?: string; // "이 SaaS로 무엇이 달라지나"
  /** "왜 아무나 못 만드는가" — saas-differentiation.ts에서 slug로 병합된다 */
  differentiation?: Differentiation;
};

const SAAS_LIST_UNORDERED: SaaSDetail[] = [
  {
    slug: "mcs",
    order: 1,
    name: "MCS",
    tagline:
      "Marketing Content Studio — 카드뉴스·광고 소재·포스터·상세페이지·캐릭터를 한 곳에서 만들고, 만든 결과물이 다시 다음 작업의 재료가 되는 마케팅 콘텐츠 스튜디오",
    liveUrl: "http://54.180.68.212/",
    tone: "dark",
    toneNote: "다크 + 더스티 로즈(#c96a8a) 액센트, 결과물 캐러셀 · 레퍼런스↔결과 비교 슬라이더",
    since: "2026-08-31",
    problemStatement:
      "마케팅 콘텐츠는 카드뉴스·광고 소재·포스터·상세페이지가 각각 다른 도구에서 만들어지고, 만든 결과물은 내려받는 순간 흩어진다. 생성 자체는 어디서나 되지만 한국어 글자가 깨지고, 글자를 고치려면 이미지를 다시 만들어야 해서 그때마다 돈이 든다. 소재를 모으는 일부터 완성 이미지까지 한 바퀴를 닫고, 글자를 그림보다 먼저 확정하는 도구가 필요해 만들었다.",
    outcome:
      "유튜브·RSS·네이버 뉴스·커뮤니티에서 소재가 자동으로 쌓이고, 여섯 도구 어디서든 라이브러리를 불러 쓰고, 만든 결과물이 다시 라이브러리로 들어가 다음 작업의 레퍼런스가 된다. 원고는 사람이 확정한 뒤에야 이미지를 만들고, 만든 이미지는 다른 호출이 원고와 대조해 검수한다. 완성한 그림 하나에서 네이버·구글·카카오 광고 규격 18종을 새로 만들지 않고 뽑는다.",
    capabilities: [
      {
        title: "한 바퀴가 닫힌 라이브러리 — 만든 것이 다시 재료가 된다",
        description:
          "수집 → 라이브러리 → 만들기 → 작업물 → 다시 라이브러리. 등록한 모든 것이 한자리에 쌓이고 어느 도구에서든 불러 쓴다. 참고 이미지는 사용자가 첨부한 것, 작업물은 시스템이 만든 것 — 둘을 같은 라이브러리에서 같은 자격으로 쓴다. 도구의 개수가 아니라 이 순환이 시스템의 뼈대다.",
      },
      {
        title: "원고를 그림보다 먼저 확정하고, 다른 호출이 대조 검수",
        description:
          "카드뉴스는 기획 → 원고 → 그림 순서로 간다. 원고 단계에서 사람이 글자를 직접 고치고, 고친 글자가 그대로 그림에 들어간다. 그림을 만든 뒤 글자를 고치려면 다시 만들어야 하고 그건 돈이 드는 일이다. 완성한 그림은 다른 호출이 원고와 대조해 — 없는 글자가 들어갔는지, 글자가 바뀌었는지 — 카드별로 '검수 통과'와 '사람의 검수 필요'를 구분해 표시한다.",
      },
      {
        title: "구성안 심사는 만든 호출과 다른 호출이 한다",
        description:
          "같은 호출 안에서 매기는 점수는 방금 쓴 글을 스스로 칭찬하는 것에 가깝다. 심사자에게는 구성안과 판매 원칙만 주고 브리프 원문은 주지 않는다 — 사는 사람은 브리프를 못 보기 때문이다. 대상·문제·차별점·반론·흐름·행동 유도 6항목 중 하나라도 fail이면 지적사항을 담아 최대 2회 다시 만들고, 끝까지 남은 지적은 숨기지 않고 화면에 띄운다.",
      },
      {
        title: "참고 이미지를 어떻게 쓸지 말로 못박는다",
        description:
          "레퍼런스는 효과가 세서 역할을 네 어휘로 통일했다 — 따라 만들기(그 결을 따라 새로 그린다) · 제품 그대로 지키기 · 인물 그대로 지키기 · 원본 그대로 넣기. 상세페이지 스타일 레퍼런스는 통일이 깨지지 않게 페이지당 한 장만 쓰고, 어울리는 것이 없으면 아무것도 쓰지 않는다. 고르는 것은 유사도 검색이 아니라 LLM이다.",
      },
      {
        title: "그림 한 장에서 포털 광고 규격 18종을 뽑는다",
        description:
          "마스터 6종에서 네이버 9 · 구글 4 · 카카오 5, 모두 18개 규격으로 내보낸다. GFA 네이티브·이미지 배너·네이버 메인·스마트채널, 구글 반응형 디스플레이 4종, 카카오 디스플레이와 비즈보드까지. 새로 생성하지 않고 조립하므로 규격을 늘려도 이미지 크레딧이 들지 않는다.",
      },
      {
        title: "모델 3종을 글자 정확도와 단가로 저울질한다",
        description:
          "fal.ai 를 경유해 GPT Image 2(가중치 4, 글자가 가장 정확 · 명조 계열도 표현) · Nano Banana Pro(3, 빠름 · 고딕 계열) · Nano Banana(1, 글자가 적은 장면)를 고른다. 원가가 4.6배까지 벌어져 크레딧에 가중치를 뒀다. 구성 분석은 무료이고, 성공한 이미지 장수만 월 한도에서 차감한다.",
      },
      {
        title: "캐릭터 4면 고정 · 만드는 도중 화면을 옮겨도 된다",
        description:
          "인물을 정면·좌·우·후면으로 고정해 두면 여러 장에 같은 사람이 일관되게 나온다. 생성 목록은 화면이 아니라 셸(사이드바)이 들고 있어 도구를 옮겨도 받아 오는 일이 멈추지 않는다. 다만 중지는 되돌리기가 아니라는 것 — fal에 이미 보낸 요청의 비용은 그대로 나간다는 것 — 도 그 자리에 적어 뒀다.",
      },
    ],
    techStack: [
      "Next.js",
      "Tailwind v4",
      "shadcn/ui",
      "Supabase",
      "fal.ai",
      "GPT Image 2 · Nano Banana Pro",
      "pnpm 모노레포 (앱 2 · 패키지 8)",
      "EC2 · Caddy · systemd",
    ],
    metrics: [
      { label: "제작 도구", value: "6" },
      { label: "광고 규격", value: "18종" },
      { label: "이미지 모델", value: "3종" },
      { label: "구성안 심사", value: "6항목" },
      { label: "수집 주기", value: "5분" },
    ],
    github: "https://github.com/junginsu-make/fixup-image-agent",
    folderImageCount: 9,
    folderPath: "/saas-folders/mcs",
    capturedSlug: "mcs",
    iconName: "Layers",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
  {
    slug: "detail-page-studio",
    order: 8,
    name: "AI 상세페이지 스튜디오",
    tagline:
      "상품 사진 한 장으로 이커머스 상세페이지를 새로 만들고, 기존 페이지를 전환율 중심으로 리디자인하는 AI 통합 스튜디오",
    liveUrl: "https://page.mktinsight.kr/",
    tone: "light",
    toneNote: "라이트 + 자미·플럼(#B0446A) 액센트, 상세페이지 갤러리 카드 UI",
    since: "2026-07-22",
    problemStatement:
      "이커머스 셀러는 신제품을 올릴 때마다 상세페이지가 필요한데, 촬영·포토샵·모델컷·디자인 외주에 시간과 비용이 든다. 게다가 도구가 새로 만들기와 리뉴얼로 나뉘어 있어 컨텍스트가 끊긴다. 상품 사진 한 장이면 판매에 필요한 섹션 구성을 AI가 스스로 설계하고, 기존 페이지 개선까지 하나의 스튜디오에서 끝내는 도구가 필요해 통합했다.",
    outcome:
      "상품 사진 1장 업로드 → AI가 히어로·문제 제기·베네핏·근거·사용법 등 섹션 구조를 설계하고 모델컷·연출컷·플랫레이를 2K 고해상도로 생성. 갤러리에서 한눈에 검토·재생성·편집한 뒤 섹션별 또는 전체 ZIP으로 내보낸다. 한이룸 상세페이지 도구 2건(redesign-maker + pdp-maker)을 하나로 통합한 현행 최신 시스템.",
    capabilities: [
      {
        title: "사진 1장으로 상세페이지 자동 설계",
        description:
          "제품컷 한 장을 넣으면 AI가 히어로 · 문제 제기 · 베네핏 · 근거 · 사용법 등 판매에 필요한 섹션 구성을 스스로 설계한다. 분석은 구조만 빠르게 만들고, 이미지는 갤러리에서 한 장씩 생성해 라이브 생성 지연을 없앴다.",
      },
      {
        title: "모델컷 · 연출컷 자동 생성 (2K 고해상도)",
        description:
          "인물이 제품을 사용하는 장면, 연출컷, 성분 플랫레이 등 촬영이 필요했던 이미지를 Nano Banana Pro(Gemini 3 Pro Image)가 만든다. 상세페이지는 확대해서 보는 물건이라 2K 고해상도로 뽑아 흐리지 않다.",
      },
      {
        title: "새로 만들기 + 리디자인 2 도구 통합",
        description:
          "사진으로 새로 만드는 Create와 기존 상세페이지(이미지 · PDF)를 전환율 중심으로 개선하는 Redesign을 하나의 통합 디자인에서 오간다. 원본 두 프로젝트의 백엔드 로직은 보존하고 프론트엔드만 공통 디자인 시스템으로 합쳤다.",
      },
      {
        title: "한눈에 검토하는 갤러리 (격자 · 이어보기 · 모달)",
        description:
          "만든 섹션을 격자로 모아 보고, 카드 크기 3단계로 조절하거나 세로로 이어 붙여(이어보기) 실제 상세페이지 모습 그대로 확인한다. 카드를 누르면 모달로 크게 보며 ← → 이동 · Esc 닫기로 빠르게 검토한다.",
      },
      {
        title: "섹션 순서 변경 · 재생성 · 레이어 편집",
        description:
          "텍스트 레이어가 섹션 고유 키로 저장돼 순서를 바꿔도 내용이 따라온다. 마음에 안 드는 섹션만 다시 만들거나, 텍스트 · 도형 레이어를 얹어 다듬고, 섹션을 추가 · 삭제한다.",
      },
      {
        title: "개인 키 방식 + 결과물 보관함",
        description:
          "API 키는 브라우저(localStorage)에만 저장되고 서버로 나가지 않아 각자 키 기준으로 과금된다. 만든 작업은 라이브러리(IndexedDB)에 모아두고 다시 열거나 이미지를 내려받는다.",
      },
    ],
    techStack: [
      "Next.js",
      "Tailwind",
      "shadcn/ui",
      "Gemini 3 Pro Image (Nano Banana Pro)",
      "pnpm 모노레포",
    ],
    metrics: [
      { label: "제작 모드", value: "2" },
      { label: "이미지 해상도", value: "2K" },
      { label: "작업 단계", value: "4단계" },
      { label: "자동 섹션", value: "6~8" },
      { label: "최소 입력", value: "1장" },
    ],
    folderImageCount: 7,
    folderPath: "/saas-folders/detail-page-studio",
    capturedSlug: "detail-page-studio",
    iconName: "ImagePlus",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
  {
    slug: "tickpoint",
    order: 9,
    name: "Tickpoint",
    tagline:
      "한국 주식 트레이딩 인텔리전스 — KOSPI · KOSDAQ 2,769 종목을 멀티 LLM으로 통합 분석하는 라이브 SaaS",
    liveUrl: "https://tickpoint.co.kr/",
    tone: "dark",
    toneNote: "다크 + 빨강(하락) · 초록(상승) 네온, TradingView 인상",
    since: "2026-04-24",
    problemStatement:
      "개별 투자자가 차트 · 뉴스 · 재무 · 기술 지표를 따로따로 보면서 의사결정하는 비효율을 제거하기 위해 출발. 핵심은 '한 화면에서 모든 신호를 본다' — 차트와 LLM 분석이 같은 컨텍스트에서 겹쳐서 보이는 구조.",
    outcome:
      "변동성 수축 패턴 시그널 + 멀티 LLM 오버레이 + 시장 심리 + 자동매매까지 — 한 종목을 결정하는 데 평균 10초 미만. 백테스트 KPI 9개 모두 노출되어 의사결정 근거가 투명.",
    capabilities: [
      {
        title: "변동성 수축 패턴 시그널 스크리너",
        description:
          "변동성 수축 패턴 기반 주가 수축 종목 자동 감지. 9개 백테스트 KPI를 한 화면에 표시 (924/204/175/37.1%/+1.42%/3.24/+55.17%/-12.21%) — 신호 발생 시점과 수익률 · 손실률 · 샤프 비율까지 투명하게 노출.",
      },
      {
        title: "종합 분석 (멀티 LLM 오버레이)",
        description:
          "차트 · 캔들 · 볼륨 + 펀더멘털 + 9 기술 지표 + LLM 전문가 4종 오버레이 (Claude · GPT · Gemini · Perplexity). 각 LLM이 독립적으로 분석한 결과를 같은 차트 위에 겹쳐 비교 — 합의/분기 지점이 즉시 보임.",
      },
      {
        title: "24 이슈 종목 자동 큐레이션 + 80+ 시그널",
        description:
          "매일 시장에서 가장 중요한 이슈 종목 24개를 AI가 자동 큐레이션 + 80+ 시그널 자동 발생. 거래량 급증 · 뉴스 키워드 · 외인 매수 등 멀티 트리거 기반.",
      },
      {
        title: "시장 심리 게이지",
        description:
          "공포 · 탐욕 인덱스 + 1H/24H/7D 뉴스 트렌드 + 핫 키워드 클라우드 + 감정 분석. 시장 전체 심리를 한 게이지로 시각화 — 진입 시점 판단 보조.",
      },
      {
        title: "자동매매 시스템",
        description:
          "관리자 권한 자동매매 + 신호 시뮬레이션 + 로또 6/45 보너스. 백테스트 결과를 기반으로 신호 발생 시 자동 주문 가능 (KRX 연동).",
      },
      {
        title: "시장 현황 시각화",
        description:
          "섹터 히트맵 + 외인/기관/개인 차트 + 종목 검색 (2,769 전체 종목) + 개인 종목 (관심 · 보유 리스트) — TradingView 수준의 차트 인터랙션 + 한국 시장 특화 데이터.",
      },
    ],
    techStack: [
      "Next.js",
      "shadcn/ui",
      "Recharts",
      "TradingView",
      "Claude",
      "GPT",
      "Gemini",
      "Perplexity",
    ],
    metrics: [
      { label: "전체 종목", value: "2,769" },
      { label: "자동 시그널", value: "80+" },
      { label: "백테스트 KPI", value: "9개" },
      { label: "LLM 오버레이", value: "4종" },
      { label: "이슈 종목 큐레이션", value: "24/일" },
    ],
    folderImageCount: 15,
    folderPath: "/saas-folders/tickpoint",
    capturedSlug: "tickpoint",
    iconName: "TrendingUp",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
  {
    slug: "lumio",
    order: 3,
    name: "Lumio",
    tagline:
      "AI 광고 영상 자동 생성 스튜디오 — 소스 → 스토리 → 영상 → 합성 4단계 파이프라인",
    liveUrl: "https://lumio-video.vercel.app/",
    tone: "light",
    toneNote: "라이트 + 오렌지 액센트, shadcn/ui 카드/슬라이더",
    problemStatement:
      "광고 영상 1개 만드는 데 기획 · 콜 · 녹음 · 편집 · 트랜지션까지 사람이 다 손대면 일주일. AI 모델별로 따로 쓰면 또 컨텍스트가 끊김. 한 화면에서 5분 안에 광고 1개를 만드는 파이프라인이 필요해 출발.",
    outcome:
      "양식 입력 → 자동 생성된 9:16 30초 광고 영상 + BGM + 자막. 클라이언트 양식만 채우면 끝. 4단계 (소스→스토리→영상→합성)가 한 페이지에서 진행되어 끊김 없음.",
    capabilities: [
      {
        title: "YouTube 영상 탐색 5방식",
        description:
          "키워드/URL/채널/카테고리/트렌드 — 5가지 방식으로 YouTube 콘텐츠 탐색. 조회수 · 좋아요 · 댓글 · 참여율 자동 분석 후 등급 배지 (Excellent/Good/Average/Low) 표시. 광고 소스로 어떤 영상이 적합한지 빠른 판단 보조.",
      },
      {
        title: "씬 단위 스토리보드 자동 생성",
        description:
          "이미지 + TTS 나레이션 + 자막 + 트랜지션을 씬 별로 자동 구성. 각 씬은 독립적으로 편집 가능 — 트림 · 속도 · 밝기 · 대비 · 채도 · 페이드 · 필터까지 풀 컨트롤.",
      },
      {
        title: "이미지 모델 라우팅 4종",
        description:
          "Auto / Nano Banana / GPT Image / Flux 자동 선택 또는 수동 지정. 광고 컨셉에 맞는 모델 자동 라우팅 — 사실적 vs 일러스트레이션 스타일 자동 매칭.",
      },
      {
        title: "영상 · 음악 모델 통합",
        description:
          "Veo + Kling + ElevenLabs Music. 영상 모델은 컨셉에 따라 자동 라우팅, 음악은 ElevenLabs로 광고 분위기 매칭 BGM 생성.",
      },
      {
        title: "씬별 편집 풀세트",
        description:
          "트림 · 속도 · 밝기 · 대비 · 채도 · 페이드 · Grayscale · Sepia · Blur · Vignette · Mirror · Negative · Vintage. 13개 효과를 씬별로 조합 — 동일 영상도 다양한 톤으로 변형 가능.",
      },
      {
        title: "광고 영상 자동 생성 모드",
        description:
          "브랜드/제품 양식 (메시지 · 타겟 · 컨셉 · 9:16/30s) 입력 → Gemini + Gemini Image + Kling + ElevenLabs Music 일괄 생성. 클라이언트는 양식만 채우면 5분 후 완성된 광고 영상이 나옴.",
      },
    ],
    techStack: [
      "Next.js",
      "shadcn/ui",
      "Veo",
      "Kling",
      "Flux",
      "Gemini Image",
      "ElevenLabs",
    ],
    metrics: [
      { label: "파이프라인 단계", value: "4단계" },
      { label: "이미지 모델", value: "4종" },
      { label: "씬별 효과", value: "13종" },
      { label: "탐색 방식", value: "5종" },
    ],
    folderImageCount: 8,
    folderPath: "/saas-folders/lumio",
    capturedSlug: "lumio",
    iconName: "Film",
    developer: "ls.Jung",
  },
  {
    slug: "os-agent",
    order: 2,
    name: "OS Agent (Synapse)",
    tagline:
      "사내 AI OS — 12명 가상직원 + 20개 AI 에이전트가 부서별 협업하는 운영 시스템",
    liveUrl: "https://frontend-three-smoky-68.vercel.app/",
    tone: "light",
    toneNote: "라이트 + 베이지 · 갈색 액센트",
    problemStatement:
      "사내 업무는 부서간 협업이 핵심인데, 단일 AI 에이전트는 부서 컨텍스트를 모름. 12명 가상직원 + 20 에이전트가 각자 역할을 가지고 자연어로 협업하는 OS가 필요해 설계.",
    outcome:
      '"이번주 휴가자 누구야?" 한 줄 질문에 일정 조회 + 휴가 신청서 PDF 자동 생성 + 팀 캘린더 등록 + 알림 4단계까지 자동. 워크플로우 빌더로 비개발자도 노드 그래프로 시스템 추가 가능.',
    capabilities: [
      {
        title: "20개 AI 에이전트 라이브러리",
        description:
          "문서 관리자 · 카피라이터 · 데이터 툴킷 · HR Agent · 한글 문서 전문가 · 이미지 편집/생성/OCR · 의도 분석기 · 맞춤 마케팅 보고서 · PDF 분석/제작 · 프롬프트 엔지니어 · 스케줄 비서 · SNS 분석기 · 텍스트 툴킷 · 영상 제작/도구함. 각 에이전트는 독립 호출 또는 워크플로우 조합 가능.",
      },
      {
        title: "12명 가상 구성원 + 5개 부서",
        description:
          "경영/경영지원실/Agent 본부/Creative 본부/Marketing 본부 — 인사카드 (이름 · 직급 · 연락처 · 연봉 · 재직 · 기술스택). 각 구성원은 자기 부서 · 직급에 맞는 권한 · 관할 보유.",
      },
      {
        title: "AI Agent 자연어 채팅 + 실시간 작업 처리",
        description:
          '예: "이번주 휴가자 누구야?" → 일정 조회 + 휴가 신청서 LR-2026-0042.pdf 자동 생성 + 팀 캘린더 등록 + 알림 4단계 (Slack · 이메일 · SMS · 푸시). 자연어 한 줄에 멀티 시스템 자동 액션.',
      },
      {
        title: "워크플로우 빌더 (노드 에디터)",
        description:
          "React Flow 기반 — HR Agent → 구성원 → 분기(자동 승인/조건/병렬) → AI Agent. 비개발자도 드래그 · 드롭으로 시스템 추가 가능.",
      },
      {
        title: "승인 · 결재 시스템",
        description:
          "휴가/반차/워크플로우 — 대기/승인/반려 3단계. 각 결재는 담당자 매핑 · 자동 알림 · 회신 처리.",
      },
      {
        title: "캘린더 + 작업 관리",
        description:
          "5월 캘린더 52개 일정 + 휴가 신청서 PDF · DOCX 다운로드. 일정과 작업 관리가 같은 화면에서 보이는 통합 뷰.",
      },
    ],
    techStack: ["Next.js", "shadcn/ui", "React Flow", "자체 LLM 라우팅"],
    metrics: [
      { label: "AI 에이전트", value: "20" },
      { label: "가상직원", value: "12" },
      { label: "부서", value: "5" },
      { label: "월 일정 처리", value: "52건" },
    ],
    folderImageCount: 10,
    folderPath: "/saas-folders/os-agent",
    capturedSlug: "os-agent",
    iconName: "Network",
    developer: "ls.Jung (© 2026 Synapse)",
  },
  {
    slug: "mkt-automation",
    order: 7,
    name: "MKT Automation",
    tagline:
      "All-in-One 마케팅 OS — 네이버 · 구글 · 블로그 · SNS · YouTube 단일 워크플로우",
    liveUrl: "http://43.201.237.25:3010/",
    tone: "dark",
    toneNote: "다크 + 네온 그라디언트 블롭, 카테고리 컬러 코딩 (N · G · I · V · A)",
    since: "2025-12-19",
    problemStatement:
      "ChatGPT는 글만, Midjourney는 이미지만, Ahrefs는 키워드만 — 결과를 합치는 건 사람의 몫. 마케팅 풀사이클을 한 화면에서 끝내는 OS가 필요해 통합.",
    outcome:
      "8 통합 영역 / 50+ 자동화 도구 / 15+ AI 모델 / 6 SNS 분석 / 48+ AI 에이전트 협력 분석. 키워드 → 경쟁 분석 → AI 글 → 이미지 → 자동 포스팅까지 한 흐름.",
    capabilities: [
      {
        title: "8 통합 영역 / 50+ 자동화 도구 / 15+ AI 모델",
        description:
          "네이버 · 구글 · 이미지 · 영상 · 광고 카테고리별 컬러 코딩 (N · G · I · V · A). 각 카테고리는 독립 색상 + 레이어드 구조 — 어떤 작업이 어느 영역인지 한눈에 인식.",
      },
      {
        title: "3 자동화 흐름",
        description:
          "블로그 콘텐츠 (키워드→경쟁분석→AI 글→이미지→자동 포스팅) / 비주얼 자산 (광고 카피 · 썸네일 · 상세페이지 · 카드뉴스 · Cinema Studio) / 마케팅 인텔리전스 (SNS · 키워드 · 딥리서치 · 전략 보고서 · SEO). 3 흐름이 하나의 OS에 통합.",
      },
      {
        title: "광고 카피 생성 3 모드",
        description:
          "집중/균형 (GPT+Claude+Gemini 15개) / 최대 다양성 (24개+) — 멀티 LLM 협력. 동일 브리프에 대해 3 모드로 결과 비교 → 최적 선택.",
      },
      {
        title: "YouTube 분석 6 모드 + SNS 분석",
        description:
          "인스타 · 페북 · 틱톡 · 스레드 + 감정 분석 + 통합 비교. 채널별 데이터를 한 대시보드로 본다.",
      },
      {
        title: "자동 SEO 생성기",
        description:
          "URL/파일/텍스트 → 메타태그 · 사이트맵 · robots.txt · 웹사이트 분석. 사이트 SEO 풀세트를 한 번에 생성.",
      },
      {
        title: "48개+ 전문 AI 에이전트 협력 분석",
        description:
          "Multi-LLM (Claude+GPT+Gemini+Perplexity) 협력. 48 에이전트가 각자 역할로 동시 분석 — 합의/분기 패턴이 자동 도출.",
      },
    ],
    techStack: [
      "Next.js",
      "shadcn/ui",
      "Claude",
      "GPT",
      "Gemini",
      "Perplexity",
    ],
    metrics: [
      { label: "통합 영역", value: "8" },
      { label: "자동화 도구", value: "50+" },
      { label: "AI 모델", value: "15+" },
      { label: "AI 에이전트", value: "48+" },
      { label: "SNS 분석", value: "6 채널" },
    ],
    github: "https://github.com/junginsu-make/AD_Copy",
    folderImageCount: 10,
    folderPath: "/saas-folders/mkt-automation",
    capturedSlug: "mkt-automation",
    iconName: "Megaphone",
    developer: "ls.Jung",
  },
  {
    slug: "propintel",
    order: 11,
    name: "PropIntel AI",
    tagline:
      "부동산 AI 어시스턴트 — 시장 + 등기 + 계약 사기 검증을 묶은 SaaS",
    liveUrl: "https://propintel-ai-beta.vercel.app/",
    tone: "light",
    toneNote: "라이트 + 초록 액센트, Recharts 인상",
    problemStatement:
      "전세 사기 · 등기 위조 · 세금 체납이 늘면서 일반인이 직접 검증해야 할 정보가 너무 많음. AI가 등기 · 서류 · 시장 데이터를 묶어서 종합 위험도를 알려주면 의사결정이 안전해진다.",
    outcome:
      "주소 진단 / 서류 확인 / 특약 검증 / 보증보험 / 입주 보호 5탭으로 계약 위험을 한 화면에서 분석. 등기 변경 이력 타임라인 + 부동산 뉴스 100건/일 자동 분류.",
    capabilities: [
      {
        title: "대시보드 — 실거래가 + 위험도 + AI 어시스턴트",
        description:
          "강남 · 서초 · 송파 라인차트 + 위험도 도넛 (안전 7/주의 2/위험 1) + 7일 활동 영역차트 + KPI (서울 가격지수 174.1 / 기준금리 2.50%). 한 화면에서 시장 상황 + 내 포트폴리오 위험도까지.",
      },
      {
        title: "사기방지 계약 검증 5탭",
        description:
          "주소 진단 / 서류 확인 / 특약 검증 / 보증보험 / 입주 보호. PDF · 이미지 업로드 → AI 분석 (세금체납 · 선순위 임차인 · 소유자 신분증 · 중개사 자격증 · 공제증서 자동 종합 위험도). 계약서 1장 업로드로 5탭 동시 분석.",
      },
      {
        title: "공고 알림",
        description:
          "청약 2,713건 + 10개 지역. 관심 지역 · 평형 · 가격대 설정 시 신규 공고 자동 알림.",
      },
      {
        title: "시장 데이터 9탭",
        description:
          "아파트 매매 · 전월세 / 연립 · 다세대 / 청약 경쟁률 / 미분양 / 상권 / 가격지수 / 금리 / 종합. 9개 시장 지표를 한 페이지로 통합.",
      },
      {
        title: "등기 변경 이력 타임라인 + AI 분석",
        description:
          "소유권이전 / 근저당권 / 전세권 / 가처분 자동 추적. 등기 PDF 업로드 시 변경 이력을 타임라인으로 시각화 + AI가 위험 패턴 자동 검출.",
      },
      {
        title: "부동산 뉴스 모니터링",
        description:
          "매일 08시 100건 분류 (시장동향 40 / 정비사업 20 / 정책규제 19 / 금리금융 12 / 건설사 9). 뉴스 자동 카테고리 분류 + 키워드 알림.",
      },
    ],
    techStack: [
      "Next.js",
      "shadcn/ui",
      "Recharts",
      "AI PDF 분석",
      "AI 이미지 분석",
    ],
    metrics: [
      { label: "사기방지 탭", value: "5" },
      { label: "시장 데이터 탭", value: "9" },
      { label: "청약 알림", value: "2,713건" },
      { label: "일 뉴스 분류", value: "100건" },
      { label: "지역 커버", value: "10개" },
    ],
    folderImageCount: 7,
    folderPath: "/saas-folders/propintel",
    capturedSlug: "propintel",
    iconName: "Building",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
  {
    slug: "architect",
    order: 10,
    name: "아키텍처 시스템",
    tagline:
      "AI 비즈니스 진단 + 이중 출력 워크벤치 — 5단계 인터뷰만으로 제안서 · PRD 동시 자동 생성",
    liveUrl: "https://architect-portfolio-lake.vercel.app/",
    tone: "dark",
    toneNote: "다크 + 보라 그라디언트(랜딩) / 라이트 + 컬러풀 결과 패널",
    problemStatement:
      "신규 프로젝트가 들어오면 비즈니스 제안서(영업)와 PRD(개발) 둘 다 필요. 둘이 분리되어 있어 정보 동기화가 어렵고 시간이 갈수록 어긋남. 한 인터뷰로 양쪽을 동시에 생성하면 시작점이 일치한다.",
    outcome:
      "5단계 인터뷰 (배경/모델/프로세스/기술/KPI) → 제안서 + PRD + 로드맵 + 아키텍처 + UI 설계 5개 동시 생성. 클라이언트용 / 개발자용 뷰 토글 + 한국어 / 영어 UI.",
    capabilities: [
      {
        title: "5단계 비즈니스 진단",
        description:
          "비즈니스 배경 / 시스템 모델 / 업무 프로세스 / 기술 환경 / 성공 지표 KPI — 채팅 + 양식 양방향. 각 단계는 자유 채팅 또는 구조화된 양식 둘 다 지원 — 클라이언트 성향에 맞춰 진행.",
      },
      {
        title: "이중 출력",
        description:
          "단일 분석 → 비즈니스 제안서 · ROI · 일정표 (Claude) + PRD · LLD · API · DB · Frontend (Claude/Gemini) 동시 생성. 같은 인터뷰 데이터를 두 출력 형식으로 변환 — 영업과 개발팀이 동일 컨텍스트에서 시작.",
      },
      {
        title: "멀티모달 입력",
        description:
          "텍스트 / 문서 / 회의 녹음 → 분석. 회의 녹음만 업로드해도 5단계 진단 자동 채움 가능.",
      },
      {
        title: "결과물 5탭",
        description:
          "로드맵 (3개월 캘린더 + 27 스프린트 + Vibe Coding · Terraform · Docker · CI/CD) / 아키텍처 (Mermaid 시퀀스) / 구현 / 문서 / UI 설계 (페이지 흐름도 + 와이어프레임 4종 + 디자인 토큰).",
      },
      {
        title: "클라이언트용 / 개발자용 뷰 토글",
        description:
          "한국어 / 영어 UI. 같은 결과물을 두 톤으로 — 클라이언트에게는 비즈니스 카피, 개발팀에게는 기술 디테일.",
      },
    ],
    techStack: [
      "Vite",
      "React 19",
      "TypeScript 5.8",
      "Tailwind v4",
      "Zustand",
      "Dexie",
      "Mermaid.js",
      "jszip",
      "@google/genai",
      "@anthropic-ai/sdk",
    ],
    metrics: [
      { label: "진단 단계", value: "5" },
      { label: "결과물 탭", value: "5" },
      { label: "동시 출력 (제안서·PRD)", value: "2종" },
      { label: "스프린트", value: "27" },
    ],
    github: "https://github.com/junginsu-make/Architect-Build",
    folderImageCount: 7,
    folderPath: "/saas-folders/architect",
    capturedSlug: "architect",
    iconName: "Workflow",
    developer: "ls.Jung",
  },
  {
    slug: "factto",
    order: 6,
    name: "Factto",
    tagline:
      "사실로 쓰는 SEO 블로그 — 이미지·네이버 플레이스 실데이터에서 사실만 뽑아 상위 노출 통계에 맞춰 홍보 블로그를 자동 생성하는 SaaS",
    liveUrl: "https://image-insight-tau.vercel.app/",
    tone: "dark",
    toneNote: "다크 + 에메랄드 그린 액센트, 사실 기반 배지",
    since: "2026-07-01",
    problemStatement:
      "일반 AI 글쓰기 도구는 그럴듯하지만 근거 없는 내용을 지어냄(할루시네이션). 홍보 블로그에 사실이 아닌 정보가 들어가면 신뢰가 무너진다. 이미지·네이버 플레이스 실데이터에서 확인된 사실만으로 상위 노출 통계에 맞춰 글을 쓰는 도구가 필요해 출발.",
    outcome:
      "이미지 업로드 또는 플레이스 URL 입력 → 검증된 사실만으로 구성된 SEO 최적화 블로그 글 + 단락별 승인 이미지 자동 생성. 없는 정보는 지어내지 않으며, 경쟁글은 통계만 참고해 표절 위험 제로.",
    capabilities: [
      {
        title: "사실 기반·무 할루시네이션",
        description:
          "이미지와 네이버 플레이스 실데이터에서 추출한 사실만으로 글을 씁니다. 확인되지 않은 정보는 작성하지 않아, 다른 AI 도구가 그럴듯한 추측을 만들어낼 때 Factto는 검증된 사실만 사용합니다.",
      },
      {
        title: "다중 AI 교차검증 이미지 분석",
        description:
          "복수 비전 AI 모델이 이미지를 독립적으로 분석한 뒤 교차검증합니다. 장소·분위기·텍스트·객체·색감을 추출하는 이미지 분석 시스템이 이중 검증으로 정확도를 높입니다.",
      },
      {
        title: "표절 없는 경쟁분석 + SEO 실전 튜닝",
        description:
          "상위 경쟁 글의 글자수·이미지수·제목 구조 같은 통계 수치만 참고하며 내용을 인용하지 않아 표절 위험이 없습니다. 제목 길이·키워드 위치·소제목·연관 키워드를 상위 노출 통계에 맞춰 검증합니다.",
      },
      {
        title: "Image Blog + Place Blog 2 시스템",
        description:
          "이미지 업로드 → 분석 → 키워드 → 경쟁분석 → 블로그 글 생성까지 한 흐름의 Image Blog, 그리고 네이버 플레이스 URL을 8단계 위저드로 홍보 블로그 글로 자동 변환하는 Place Blog — 두 시스템으로 소스에 맞춰 진행합니다.",
      },
      {
        title: "AI 이미지 승인제",
        description:
          "fal.ai로 단락별 이미지를 자동 생성하되, 자동 삽입이 아니라 사람이 검토·승인한 이미지만 본문에 삽입합니다. 사용자가 업로드한 이미지는 항상 AI 이미지보다 우선 배치됩니다.",
      },
      {
        title: "CTA 링크 자동 삽입 + 투명 비용 추적",
        description:
          "전환율을 높이는 CTA 링크(URL)를 글에 자동 삽입하고, 네이버 플레이스 리뷰 기반 블로그에도 동일하게 적용합니다. 실행 횟수 기반 API 비용은 관리자 패널에서 실시간·투명하게 추적됩니다.",
      },
    ],
    techStack: [
      "Next.js",
      "다중 비전 AI",
      "fal.ai",
      "네이버 플레이스",
      "Vercel",
    ],
    metrics: [
      { label: "핵심 차별점", value: "9가지" },
      { label: "시스템", value: "3" },
      { label: "완성 프로세스", value: "5단계" },
      { label: "Place 위저드", value: "8단계" },
      { label: "비전 AI 교차검증", value: "2+" },
    ],
    folderImageCount: 7,
    folderPath: "/saas-folders/factto",
    capturedSlug: "factto",
    iconName: "FileCheck2",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
  {
    slug: "shopping-insight",
    order: 4,
    name: "Naver Shopping Insight",
    tagline:
      "네이버 쇼핑 상품 성장 인텔리전스 — 상품 URL 하나로 실제 순위·검색 수요·경쟁 가격·리뷰 신호를 묶어 '지금 뭘 바꿔야 하는지'와 다음 매출 기회를 데이터로 보여주는 SaaS",
    liveUrl: "https://shopping.mktinsight.kr/",
    tone: "light",
    toneNote: "라이트 + 코럴(오렌지) 액센트, 데이터 대시보드 카드 UI",
    since: "2026-07-17",
    problemStatement:
      "쇼핑 셀러는 '왜 안 팔리는지'를 순위·검색량·경쟁·리뷰를 각각 다른 화면에서 따로 확인해야 한다. 게다가 검색 순위로 매출을 역산하는 도구는 근거가 불투명하다. 상품 URL 하나로 실제 데이터를 묶어 '지금 뭘 바꿔야 하는지'를 근거와 함께 보여주는 도구가 필요해 출발.",
    outcome:
      "상품 URL 또는 제품명 입력 → 실제 노출 점수·Top10 진입률·30일 클릭 추이·키워드 수요·시장 관심 구성비·경쟁상품 Top20·리뷰·실행 액션을 한 화면에. 매출은 순위로 역산하지 않고 수집 데이터 기반 기회 지표로만 투명하게 표시. 로그인 없이 공개 데모로 전체 분석을 미리 볼 수 있다.",
    capabilities: [
      {
        title: "URL 하나로 상품 성장 분석 시작",
        description:
          "상품 URL 또는 제품명만 입력하면 Chrome 확장 수집기가 실제 상품명·상품 ID·가격·리뷰를 먼저 수집하고, 이어서 상품명·브랜드·카테고리 기반 추천 키워드로 검색 수요·검색량·경쟁상품·실제 순위까지 자동 수집한다.",
      },
      {
        title: "한 화면 데이터 근거 분석",
        description:
          "실제 노출 점수·실제 Top10 진입률·30일 클릭 추이·키워드 수요·시장 관심 구성비(디바이스·성별·연령 도넛)·실제 순위 추이·가격 변화·경쟁상품 Top20·리뷰·실행 액션까지 — 흩어진 신호를 한 대시보드에서 근거와 함께 본다.",
      },
      {
        title: "실제 순위 vs API 추정 순위 구분",
        description:
          "Shopping Search API의 위치는 'API 추정 순위'로, 로그인한 PC에서 확인하는 값은 '실제 노출 순위'로 분리 표기한다. 광고를 제외한 PC·모바일 순위를 카탈로그 ID·판매자 상품 ID·URL 경로 ID로 매칭한다.",
      },
      {
        title: "DataLab 시장 트렌드 탐색",
        description:
          "상품이 없어도 키워드만으로 네이버 쇼핑 상위 상품·검색 수요·연관 키워드를 확인한다. 카테고리·키워드를 전체·기기·성별·연령 차원으로 나눠 저장하고 워커가 정기 수집한다.",
      },
      {
        title: "거래 기회 분석 + 상품 비교",
        description:
          "수집 데이터를 기반으로 성장 전망과 거래 기회 지수를 산출하고(프리미엄), 내 상품과 관심 상품의 노출·수요·가격·리뷰 지표를 나란히 비교한다.",
      },
      {
        title: "근거 투명성 — 저검색량·수집 실패 명시",
        description:
          "검색량이 10 미만이면 '10회 미만', 클릭 추이가 없으면 '수집 완료·저검색량', 순위 미확인은 '100위 밖'으로 미수집과 구분해 표기한다. 매출은 검색 순위로 역산하지 않고 수집 데이터 기반 기회 지표로만 표시한다.",
      },
    ],
    techStack: [
      "Next.js",
      "NestJS",
      "Supabase",
      "PostgreSQL",
      "Chrome 확장",
      "네이버 DataLab · SearchAd · Shopping",
      "AWS EC2",
      "Vercel",
    ],
    metrics: [
      { label: "경쟁상품 Top", value: "20" },
      { label: "클릭 추이", value: "30일" },
      { label: "시장 관심 차원", value: "3" },
      { label: "상세 분석 영역", value: "7" },
      { label: "구독 티어", value: "4" },
    ],
    folderImageCount: 7,
    folderPath: "/saas-folders/shopping-insight",
    capturedSlug: "shopping-insight",
    iconName: "ShoppingBag",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
  {
    slug: "place-insight",
    order: 5,
    name: "Place Insight",
    tagline:
      "네이버 플레이스 순위 관리 + 상권·부동산 공공데이터를 한 화면에 — 경쟁 상위 10곳 실측으로 '오늘 뭘 먼저 할지'를 우선순위로 내려주는 점포 의사결정 SaaS",
    liveUrl: "https://place.mktinsight.kr/",
    tone: "light",
    toneNote: "라이트 + 라임(옐로우그린) 액센트, 다크 Decision Desk 패널",
    since: "2026-07-18",
    problemStatement:
      "점포 사장·대행사는 순위만 알려주는 도구는 많아도 '왜 그 순위인지, 뭘 먼저 채워야 오르는지'를 근거로 답하는 도구가 없다. 게다가 데이터가 없으면 그럴듯한 숫자로 빈칸을 메우는 도구도 많다. 경쟁 상위 10곳 실측을 기준으로 오늘 할 일을 우선순위로, 가짜 없이 정직하게 내려주는 점포 의사결정 도구가 필요해 출발.",
    outcome:
      "플레이스 URL·키워드 입력 → 경쟁 상위 10곳 대비 부족 격차를 '리뷰 227/430, 203건 부족'처럼 실측 수치로 → 근거·실행단계·확인시점이 붙은 우선순위 실행 카드 → 매일 07시 내·경쟁 순위 자동 추적. 여기에 상권·인구·부동산 실거래·계약 위험까지 이어서 창업·입지·계약 판단.",
    capabilities: [
      {
        title: "경쟁 상위 10곳 실측 비교",
        description:
          "임의 기준이 아니라, 노리는 키워드로 실제 검색해 광고 제외 상위 10개 업체를 하나하나 수집한 평균을 벤치마크로 삼는다. '리뷰가 부족하다'가 아니라 '내 리뷰 227건, 상위 10곳 평균 430건 — 203건 부족'처럼 정확한 수치로 말한다.",
      },
      {
        title: "오늘 할 일 — 우선순위 실행 카드",
        description:
          "부족한 항목마다 현재값·기준값·부족 수치 + 왜 필요한가(근거) + 실행 단계 + 며칠 뒤 확인할 변화가 담긴 실행 카드를 만들고, 높음·보통·낮음 우선순위로 정렬한다. 무엇부터 손대야 할지 고민할 필요가 없다.",
      },
      {
        title: "가짜 데이터 없음 — 정직한 정확성",
        description:
          "데이터가 없으면 그럴듯한 숫자로 메우지 않는다. 경쟁 표본이 없으면 '벤치마크 불가'를 명시하고, 외부 조회 실패는 누락 사유를 그대로 표시하며, 근거 부족한 매출·상권 점수는 '판단 보류'로 남긴다. 보이는 모든 수치는 실제 수집·검증된 값이다.",
      },
      {
        title: "업종별 지표 자동 분리",
        description:
          "음식점의 '메뉴 사진'과 스터디카페·병원·미용실의 '업체 대표사진'은 다르다. 업종에 따라 평가 지표의 의미를 자동으로 분리해, 스터디카페에 '메뉴 사진을 올리세요' 같은 엉뚱한 조언을 하지 않는다.",
      },
      {
        title: "매일 자동 순위 추적 (내 + 경쟁)",
        description:
          "한 번 등록하면 매일 오전 7시 자동 수집. 내 순위 변동은 물론 경쟁 업체 순위까지 같이 추적하고, 시작점 대비 개선 폭을 그래프로 보여준다. 플레이스 7개 영역(기본·키워드·리뷰·사진·소식·연결·위치) 원자료를 정규화해 분석한다.",
      },
      {
        title: "상권·부동산 공공데이터 + 계약 위험 점검",
        description:
          "소상공인시장진흥공단·SGIS·국토부 실거래·건축HUB·청약홈·한국은행 등 공공데이터를 연동해 인구 적합도·경쟁 밀도를 점수화하고, 상가 계약 전 위험(소유권·용도·보증금 비율 등)을 규칙 기반 체크리스트로 사전 점검한다.",
      },
    ],
    techStack: [
      "Next.js",
      "네이버 플레이스",
      "네이버 SearchAd · DataLab",
      "공공데이터 (소상공인·SGIS·국토부·청약홈·ECOS)",
      "Caddy",
    ],
    metrics: [
      { label: "경쟁 벤치마크 (상위)", value: "10" },
      { label: "플레이스 수집 영역", value: "7" },
      { label: "공공데이터 출처", value: "6" },
      { label: "우선순위 등급", value: "3" },
      { label: "자동 수집 주기", value: "1일" },
    ],
    folderImageCount: 4,
    folderPath: "/saas-folders/place-insight",
    capturedSlug: "place-insight",
    iconName: "MapPin",
    developer: "ls.Jung",
    contactEmail: "9843ohs@gmail.com",
  },
];

/**
 * 홈·빌더 노출 순서 — 각 엔트리의 order 필드대로 정렬(사용자 지정).
 * 차별화 데이터는 slug 기준으로 병합한다 (원본 배열은 변형하지 않는다).
 */
export const SAAS_LIST: SaaSDetail[] = [...SAAS_LIST_UNORDERED]
  .sort((a, b) => a.order - b.order)
  .map((saas) => {
    const differentiation = SAAS_DIFFERENTIATION[saas.slug];
    return differentiation ? { ...saas, differentiation } : saas;
  });
