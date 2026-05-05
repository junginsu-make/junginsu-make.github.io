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
};

export const SAAS_LIST: SaaSDetail[] = [
  {
    slug: "tickpoint",
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
      { label: "동시 출력", value: "제안서+PRD" },
      { label: "스프린트", value: "27" },
    ],
    github: "https://github.com/junginsu-make/Architect-Build",
    folderImageCount: 7,
    folderPath: "/saas-folders/architect",
    capturedSlug: "architect",
    iconName: "Workflow",
    developer: "ls.Jung",
  },
];
