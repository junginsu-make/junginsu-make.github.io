"use client";

export function DualityVenn() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-32 border-t border-[var(--line)] bg-[var(--bg)] text-[var(--fg)]">
      <p className="text-meta opacity-50 mb-8">DUALITY</p>
      <h2 className="text-display-md font-display mb-16 lg:whitespace-nowrap">
        한 사람, 두 면 — 그리고 그 교집합.
      </h2>
      <div className="max-w-5xl mx-auto">
        <svg viewBox="0 0 800 500" className="w-full h-auto">
          {/* 좌측 원 — 마케터 */}
          <circle
            cx="320"
            cy="250"
            r="200"
            fill="currentColor"
            fillOpacity="0.04"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
          {/* 우측 원 — AI 빌더 */}
          <circle
            cx="480"
            cy="250"
            r="200"
            fill="var(--color-orange)"
            fillOpacity="0.06"
            stroke="var(--color-orange)"
            strokeWidth="1.5"
          />

          {/* 좌 라벨 */}
          <text
            x="180"
            y="120"
            className="font-display fill-current"
            fontSize="28"
            fontWeight="500"
          >
            마케터
          </text>
          <text
            x="180"
            y="148"
            className="fill-current opacity-60"
            fontSize="13"
            letterSpacing="2"
          >
            17년 영업·광고 운영
          </text>
          {/* 좌 디테일 */}
          <text
            x="170"
            y="290"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            티몬 광고대행 연 40~60억
          </text>
          <text
            x="170"
            y="312"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            전국 30지점 연 20억+
          </text>
          <text
            x="170"
            y="334"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            KOICA·31 강의처
          </text>

          {/* 우 라벨 */}
          <text
            x="540"
            y="120"
            className="font-display fill-current"
            fontSize="28"
            fontWeight="500"
          >
            AI 빌더
          </text>
          <text
            x="540"
            y="148"
            className="fill-current opacity-60"
            fontSize="13"
            letterSpacing="2"
          >
            풀사이클 자동화
          </text>
          {/* 우 디테일 */}
          <text
            x="540"
            y="290"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            GitHub 43 저장소
          </text>
          <text
            x="540"
            y="312"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            make.com 4 핵심 시나리오
          </text>
          <text
            x="540"
            y="334"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            6 라이브 SaaS
          </text>

          {/* 교집합 라벨 */}
          <text
            x="400"
            y="220"
            textAnchor="middle"
            className="font-display fill-current"
            fontSize="22"
            fontWeight="500"
          >
            콘텐츠 자동화
          </text>
          <text
            x="400"
            y="248"
            textAnchor="middle"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            마케팅 노하우 + AI 자동화
          </text>
          <text
            x="400"
            y="270"
            textAnchor="middle"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            AI Content Operation 7+ 클라이언트
          </text>
          <text
            x="400"
            y="292"
            textAnchor="middle"
            className="fill-current opacity-70"
            fontSize="13"
            letterSpacing="0.5"
          >
            정부 부처·창업지원센터 AI 강의
          </text>
        </svg>
      </div>
      <div className="mt-16 max-w-2xl text-body-lg opacity-80 leading-relaxed">
        17년의 마케팅 경험은 AI 시대를 만나 더 강력해졌다. 광고대행 운영의
        깊이는 자동화 시스템 설계에 그대로 녹아있고, 31 강의처에서 쌓은 교육
        능력은 AI 콘텐츠 운영의 핵심이 되었다.{" "}
        <strong className="text-[var(--color-orange)]">
          정체성은 둘이 아니라 하나다.
        </strong>
      </div>
    </section>
  );
}
