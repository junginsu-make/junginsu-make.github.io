import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  weight: "variable",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://junginsu-portfolio.pages.dev"),
  title: {
    default:
      "AI SaaS 개발 · 자동화 시스템 구축 x 마케팅 도메인 기반 AI Builder",
    template: "%s · AI SaaS 개발 x AI Builder",
  },
  description:
    "AI SaaS 개발 · 자동화 시스템 구축 x 마케팅 도메인 기반 AI Builder. Vibe Coding 43 · 자동화 시나리오 81 · SaaS 6 Live · 정부 부처 · 기관 AI 강의 + 17년 마케팅.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Jung In su · AI Builder",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* 다크모드 기본값 + flash 방지 — React hydration 전 동기 실행 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var t=s||'dark';document.documentElement.dataset.theme=t;if(t==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');}})();`,
          }}
        />
        {/* Pretendard Variable (dynamic-subset) — next/font/google에 없어 CDN 링크로 로드 */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <ThemeProvider>
          <LenisProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
