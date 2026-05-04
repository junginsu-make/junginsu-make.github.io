# 작업 진행상황 — 정인수 포트폴리오 v3

> **마지막 저장**: 2026-05-04 (사용자 피드백 반영 완료 — 큰 리디자인 라운드 종료)
> **마지막 commit**: `76eb9b7 feat(builder): Vibe Coding + Make.com 두 트랙 분리 + 12 AI 도구 스택 시각화`

## 현재 위치

**프로젝트 루트**: `/home/a20616050/projects/A/junginsu-portfolio-v3/`
**브랜치**: `main`
**dev 서버**: `pnpm dev` → http://localhost:3000

## 사용자 피드백 라운드 (2026-05-04 후속) — Phase 1~5 완료 ✅

### Phase 1 — Nav + 데이터 재구성
- Nav 순서: AI Builder가 Marketing 앞 (사용자 요청)
- AI SaaS PL 클라이언트 (호반·서울법무법인·아주그룹·OS Agent) → marketing → builder 영역 이동
- 신규 `lib/data/builder-clients.ts` + `components/builder/ai-saas-pl.tsx`

### Phase 2 — 자격증 영역 fix
- 사진 4:3 ↔ 박스 3:4 충돌 해결: aspect-[4/3] + object-contain p-2
- 자격증 비중 축소 (덜 중요): max-w-4xl + display-md 헤더
- 6 부속 자격증: grid 행 → wrap chip

### Phase 3 — 마케팅 페이지 전체 리디자인
- TMON 이미지 의존 제거 → 직접 디자인 (TmonPortfolio 재작성):
  · 4 KPI 비포/애프터 막대 비교 (motion expand)
  · 9개월 timeline progress bar
  · 합계 highlight 3 카운터 (▲3,888%P / ▲86,560명 / ▼50%)
- **MarketingSpecialties (NEW)** — 6 영역 24+ 항목 + BUDGET HIGHLIGHTS (월 1억+ / 3,000만 절감 / 상위 1% 블로그 6개)
- **PublicAgencies (NEW)** — 12 공공기관 (정부 부처 4 + 공공기관 4 + 공기업 1 + 지자체 3)
- AdChannels: 칩 사이즈 키움 (가독성)
- AiClients +14건 강조: 큰 카드 + Counter

### Phase 4 — AI Builder 페이지 강화
- **BuildTracks (NEW)** — Vibe Coding (직접 코드) vs Make.com (노코드 자동화) 좌·우 비교
- **MakeStackVisualization (NEW)** — 노드 캡처 X. 12 AI 도구 hub-spoke 시각화 + 펄스 링 motion + 호버 사용 맥락 펼쳐짐

### Phase 5 — 이력서 정독 + 추가 데이터
- `정인수 이력서.pdf` 페이지 1-5 정독
- 신규 발견 → 페이지 반영:
  · 서울관광공사·연수구청 (퍼포먼스디자인 시기 제안서 PT) → PublicAgencies
  · 마케팅 전문 분야 (SEO·Search Ad·Display Ad·DSP·Viral·Analysis) → MarketingSpecialties
  · 광고비 highlight (월 1억+ 검색·SNS / 월 3,000만 절감 / 상위 1% 블로그 6개) → AD_BUDGET_HIGHLIGHTS
- 출처 텍스트 가독성 개선 (text-meta → text-body, ✓ accent 마크)

## 빌드 통계 (2026-05-04 시점)

| 항목 | 값 |
|---|---|
| 라우트 | 19 (13 정적 + 6 SSG) |
| 컴포넌트 | 50+ (motion · home · about · career · marketing · builder · contact · ui) |
| 데이터 파일 | 11 (career · certifications · saas · scenarios · github · home · marketing · teaching · content-refs · builder-clients · builder-stack) |
| 테스트 | 32/32 PASS |
| 빌드 에러 | 0 |
| 타입 에러 | 0 |
| 모바일 검증 | 375px home/career/marketing/builder PASS |
| Nav 클릭 에러 | 0 (GSAP gsap.context() revert 적용) |

## 절대 룰 12개 모두 준수 + 사용자 후속 피드백 모두 반영

1. ✅ 회사 강조 X · 임팩트 강조
2. ✅ AI 디폴트 fade-up X (정의된 모션만)
3. ✅ GitHub 43 / make.com 81 (4 핵심) 별도 카운터
4. ✅ make.com 4 핵심 메인
5. ✅ 외부 GitHub 링크 X
6. ✅ 자격증 3 비주얼 + 6 부속 (이번 라운드 비중 축소 + 비율 fix)
7. ✅ 메인 메일 = 9843ohs@gmail.com
8. ✅ 메인 증명사진 = 정인수 증명사진 고화질.png
9. ✅ KOICA 홈 노출 X
10. ✅ Palette ㈜ 텍스트 manifesto 미노출
11. ✅ TMON ROAS 7,404% 검증 + 출처 명기 + 직접 디자인
12. ✅ NGO 마음하나 미사용
+ ✅ AI SaaS PL 4건 = AI 빌더 영역 (마케팅 X, 사용자 요청)
+ ✅ Nav 순서 = AI Builder 먼저 (사용자 요청)
+ ✅ 마케팅 페이지 가독성 보강 (TMON 직접 디자인 + 공공기관 로고 컴포넌트 + +14건 강조)
+ ✅ AI Builder 페이지 액티브 모션 (BuildTracks + MakeStack) — 노드/에어테이블 캡처 의존 X

## 후속 권장

- **Vercel 배포** — 즉시 가능 (빌드 PASS)
- **사용자 PC에서 Lighthouse 90+ 측정** (WSL2 Chrome 미설치로 자동 측정 보류)
- **타블렛 768px 빠른 점검** (모바일·데스크탑은 검증됨)
- **자료 보강 옵션** (콘텐츠 추가 캡처·강의 자료 PDF 다운로드 추가 등)

## 시작 명령

```bash
cd /home/a20616050/projects/A/junginsu-portfolio-v3
pnpm dev          # http://localhost:3000
pnpm test --run   # 32/32 PASS
pnpm build        # 19 pages
git log --oneline | head -25
```

## 인계 신호

새 세션 시작 시 입력 가능:
- `/resume-work` — 이 파일 읽고 컨텍스트 복원
- 또는 자연어 "포트폴리오 v3 [페이지명] 손보자"
