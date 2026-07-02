import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 단일 배포로 통합 — 서버 런타임 사용(app/api/chat 라우트 핸들러).
  // (이전 output:"export"는 Cloudflare/GitHub Pages 정적 배포용이었으나 은퇴)
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
