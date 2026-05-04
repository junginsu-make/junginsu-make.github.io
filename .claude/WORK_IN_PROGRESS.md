# 작업 진행상황 — 정인수 포트폴리오 v3

> **마지막 저장**: 2026-05-04 (Phase 0~16 통합 검증 완료 시점 — v3 최초 빌드 완료)
> **마지막 commit**: `c23a610 perf(images): hero 이미지 fetchPriority + decoding 힌트 추가 (LCP 개선)`

## 현재 위치

**프로젝트 루트**: `/home/a20616050/projects/A/junginsu-portfolio-v3/`
**브랜치**: `main` (clean working tree)
**dev 서버**: `pnpm dev` → http://localhost:3000
**prod 서버**: `pnpm build && pnpm start` (또는 `pnpm start --port 3001`)

## v3 빌드 완료 ✅ (Phase 0~16 모두 통과)

### 빌드 결과
- **19 라우트** 모두 200 OK (13 정적 + 6 SSG SaaS 디테일)
- `pnpm test --run` → 32/32 PASS
- `pnpm build` → 0 TypeScript / 0 lint errors
- 라이트/다크 모두 토큰 적용 (var(--bg/fg/accent/line))
- 모바일 375px 반응형 검증 PASS (햄버거 + Sheet drawer 메뉴)
- Nav active state (orange + underline) 적용

### Phase 별 산출물

| Phase | 페이지 | 핵심 컴포넌트 |
|---|---|---|
| 0~5 Foundation | — | Tailwind v4 + 디자인 토큰 + 모션 primitives 10 + shadcn 7 |
| 6 홈 | `/` | 600vh 6 핀 섹션 (Manifesto·Counter·SaasCycle·ThreeCategories·Duality·CTA) |
| 7 About | `/about` | 풀블리드 hero + 5 챕터 + 양면성 벤 다이어그램 |
| 8 Career | `/career` | 17년 4개월 + 6 임팩트 스트림 + 17 회사 풀 토글 + 자격증 9 |
| 9 Marketing | `/marketing` | TMON 7,404% 검증 차트 + AI PL 4 + Content Op 7 + Capsule 20+ |
| 10 Teaching | `/marketing/teaching` | 56장 자동 캐러셀 + 3 Tier (정부6·협회8·개인15) |
| 11 Content | `/marketing/content` | sbcyberpass 블로그 + 7 클라이언트 콘텐츠 |
| 12 Builder Index | `/builder` | 6 SaaS 5-bullet + 4 시나리오 + GitHub 미리보기 |
| 13 Builder Detail | `/builder/[slug]` × 6 | hero + capabilities + metrics + gallery + nav |
| 14 Scenarios | `/builder/scenarios` | 4 핵심 풀 + 6 인벤토리 + 8 timeline |
| 15a GitHub | `/builder/github` | 43 + 5 카테고리 + 12 Golden Principles |
| 15b Contact | `/contact` | 거대 메일 + 3 채널 + 리소스 + KST timezone |
| 16 Layout fix | (전역) | 모바일 햄버거 + 타이포 clamp 하향 + Nav active state |

## 절대 룰 12개 모두 준수 (검증 완료)

1. ✅ 회사 강조 X · 임팩트 강조 (`/career` 6 스트림 메인)
2. ✅ AI 디폴트 fade-up X — 정의된 모션만 사용 (MaskReveal/WordHighlight/ScrollReveal/Counter/SweepLink/Magnetic)
3. ✅ GitHub 43 (84 X) / make.com 81 (4 핵심) — 별도 카운터, 합산 X
4. ✅ make.com 4 핵심 메인 / 81 보조 인벤토리
5. ✅ 외부 GitHub 링크 노출 X (footer/contact 텍스트 명시)
6. ✅ 자격증 3 비주얼 + 6 텍스트
7. ✅ 메인 메일 = `9843ohs@gmail.com`
8. ✅ 메인 증명사진 = `정인수 증명사진 고화질.png`
9. ✅ KOICA 홈 노출 X (/marketing/teaching에서만)
10. ✅ Palette ㈜ 텍스트 manifesto 미노출
11. ✅ TMON ROAS 7,404% 검증됨 (포트폴리오 PDF 출처)
12. ✅ NGO 마음하나는 미사용

## 미해결 / 후속 세션 권장

- **Lighthouse 90+ 측정**: WSL2 Chrome 미설치로 자동 측정 보류. 사용자 PC 환경에서 직접 측정 권장. 수동 LCP 힌트는 적용 (hero `fetchPriority="high"` + `decoding="async"`)
- **배포**: Vercel 또는 사용자 선호 호스팅. `pnpm build` 통과 확인 — 즉시 배포 가능
- **자료 보강**:
  - capsule_media 추가 콘텐츠 캡처 (현재 7개만)
  - 강의 사진 추가 (56장 충분)
  - 자격증 추가 이미지 (현재 3개 비주얼 + 6 텍스트)
- **타블렛 (768px) 반응형 미점검**: 빠른 점검 권장

## 시작 명령

```bash
cd /home/a20616050/projects/A/junginsu-portfolio-v3
pnpm dev          # http://localhost:3000
pnpm test --run   # 32/32 PASS
pnpm build        # 19 pages 정적/SSG
git log --oneline | head -20
```

## 인계 신호

새 세션 시작 시 사용자가 입력 가능:
- `/resume-work` — 이 파일 읽고 컨텍스트 복원
- 또는 자연어 "포트폴리오 v3 배포" / "/marketing 카드 수정" — 메모리 자동 로드
