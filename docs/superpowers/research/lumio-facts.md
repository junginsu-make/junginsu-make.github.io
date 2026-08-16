# Lumio 팩트 시트
저장소: lumio-video | 분석일: 2026-08-16

> 제품명 Lumio (내부 코드명 PLTT CINEMA AI v2). 백엔드 FastAPI(Python 3.12) + Cloud Run,
> 프런트 Next.js 16 + Vercel. 근거: `README.md`, `.claude/CLAUDE.md`

---

## 1. 실제 파이프라인 단계

메인 파이프라인은 **13단계 체크포인트 엔진**이다. 단계는 열거형으로 고정되어 있고,
각 단계마다 `critical`(실패 시 중단 여부), `depends_on`(선행 단계), `retry_policy`(재시도 횟수)가
코드에 선언되어 있다. 실패한 단계부터 재개(resume)가 가능하다.
근거: `backend/app/models/pipeline_run_types.py`

| # | 단계 (PipelineStepId) | 코드가 실제로 하는 일 | 근거 파일 |
|---|---|---|---|
| 1 | `preflight` | 실행 전 API 키·의존성 사전 점검. `critical=True`, 재시도 1회(재시도 무의미하므로) | `app/models/pipeline_run_types.py`, `app/cli/preflight.py` |
| 2 | `analyze` | 소스(텍스트·이미지·YouTube·문서·웹조사)를 LLM으로 분석해 전체 시나리오 생성 | `app/services/narrative_engine.py`, `app/services/llm_router.py` |
| 3 | `narration_enrich` | 시나리오를 N개 씬으로 구조화 + 씬별 나레이션·keyframe 설명·shot_type·camera_move·lighting 생성 | `app/services/narrative_engine.py` |
| 4 | `hook_gen` | 오프닝 후크 문구를 5가지 스타일로 생성. `critical=False`(실패해도 영상은 나옴), 재시도 2회 | `app/services/hook_service.py` |
| 5 | `image_gen` | 씬별 키프레임 이미지 생성. 3-tier provider 폴백 적용 | `app/services/image_gen_service.py` |
| 6 | `prompt_gen` | 이미지 → 영상 변환용 모션 프롬프트 생성 | `app/services/motion_prompt_service.py` |
| 7 | `quality_gate` | 이미지·프롬프트 중간 검수. `critical=False`, 재시도 1회 | `app/models/pipeline_run_types.py` |
| 8 | `subtitle_gen` | 나레이션을 ASS 자막 트랙으로 변환(별도 자막 생성 안 함 — 나레이션 재사용) | `app/services/ass_utils.py` |
| 9 | `scene_video_gen` | 씬별 영상 생성(병렬). fal/Replicate 분산 + 모델별 duration 검증 | `app/services/video_gen_service.py`, `app/services/provider_router.py` |
| 10 | `audio_synth` | TTS 나레이션 + BGM 생성·믹싱 | `app/services/tts_service.py`, `app/services/bgm_service.py` |
| 11 | `merge` | FFmpeg 합성 — xfade 전환, 자막 번인, 오디오/비디오 길이 정합 | `app/services/merge_service.py`, `app/services/transition_filter_service.py` |
| 12 | `final_quality_gate` | 완성본을 5개 지표로 채점, 70점 미만이면 실패 판정 | `app/services/final_quality_gate_service.py` |
| 13 | `export` | 최종 MP4 export + Storage 업로드 | `app/services/storage_uploader.py` |

### 별도 계통 — CF(광고) 모드 전용 체인

광고 영상은 위 씬 파이프라인과 **의도적으로 분리된 독립 백엔드**로 처리된다.
"기존 `SceneData`·`WorkflowMode` 타입을 import 하지 말 것"이 패키지 규칙으로 명시돼 있다.
근거: `backend/app/cf_mode/README.md`

```
CommercialBrief → CreativePlanner(LLM) → RhythmPlan → CommercialCut[]
  → ImageAssetRequest[] → VideoAssetRequest[] → BgmGenerationPlan → AssemblyManifest
```
근거: `backend/app/cf_mode/planner.py` (`CommercialPlanner.create_plan`)

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것

### 2-1. 완성본이 70점 미만이면 통과시키지 않는다
5개 지표(연속성 / 지속시간 / 화면비 / 자막 / 음성)를 각각 0~100점으로 채점하고 평균이
`min_score = 70` 미만이면 `passed=False`. 지속시간은 기대값 대비 상대 편차로 등급화한다 —
편차 8% 이내 100점, 15% 이내 85점, 25% 이내 70점, 40% 이내 55점, 그 이상 40점.
근거: `backend/app/services/final_quality_gate_service.py` (`_score_by_relative_delta`, `evaluate_final_quality`)
왜: 자동 생성물은 "일단 파일은 나온다". 씬이 누락되거나 길이가 어긋난 결과물을 사람이
일일이 확인하지 않고 걸러내려면 수치 기준이 필요하다.

### 2-2. 모델이 지원하지 않는 영상 길이를 조용히 바꾸지 않는다
과거에는 요청 길이를 자동으로 5초/10초로 clamp 했으나, 이를 **명시적 거부(422)** 로 교체했다.
`DurationValidation.ok=False` + 지원 값 목록 + 가장 가까운 유효값을 함께 반환한다.
근거: `backend/app/services/video_duration_validator.py` (파일 상단 주석에 교체 사유 명시)
왜: 사용자가 8초를 요청했는데 말없이 5초가 나오면, 나레이션·자막·BGM 타이밍이 전부 어긋난다.

### 2-3. 이미지에 분할화면·콜라주·포스터 레이아웃을 만들지 못하게 막는다
`SINGLE_FRAME_HARD_RULE`을 프롬프트 **맨 앞과 맨 뒤에 샌드위치로 두 번** 삽입한다.
금지 목록: split-screen, 그리드, 콘택트시트, 콜라주, 몽타주, PIP, diptych/triptych,
before/after 비교, 만화 패널, 썸네일/포스터 레이아웃.
근거: `backend/app/services/image_prompt_policy.py`
왜(코드 주석에 기록된 실제 회귀): 정책을 프롬프트 끝에만 붙였더니 일부 모델(Flux 계열)이
약하게 처리해 "이미지 1장에 분할 이미지가 나오는" 문제가 사용자 보고로 재발했다 (PR #121).
한 프레임에 두 장면이 들어가면 이미지→영상(I2V) 변환 품질이 깨진다.

### 2-4. 영상 모델이 글자를 만들어내지 못하게 막는다
`VIDEO_NO_TEXT_POLICY` + `VIDEO_NEGATIVE_TEXT_POLICY`로 자막·타이포그래피·로고·워터마크·
UI 패널·읽을 수 있는 기호 생성을 차단한다. 단, **입력 이미지에 이미 있는 글자는 그대로 보존**하고
새로 만들거나 번역·재작성하지 못하게 한다.
근거: `backend/app/services/video_gen_service.py`
왜: AI 영상 모델은 글자를 깨진 형태로 만든다. 자막은 시스템이 ASS로 직접 번인한다.

### 2-5. 시나리오 단계에서 편집 기법 어휘 자체를 금지한다
씬 설명(`narrative_text`)에 split-screen, PIP, 몽타주, 콜라주, 그리드, 한 프레임 내 회상,
side-by-side 전후 비교, 제목 카드 레이아웃을 쓰지 못하게 한다.
근거: `backend/app/services/narrative_engine.py`
왜: 씬 설명이 곧 이미지 생성 프롬프트로 쓰이므로, 시나리오에 "몽타주"라고 쓰면
이미지 생성기가 그걸 그대로 그린다.

### 2-6. LLM이 지어낸 씬 번호를 버린다
썸네일 후보 순위에서 존재하지 않는 `scene_id`나 숫자가 아닌 점수를 반환하면 해당 항목을
결과에서 제외하고, 점수는 0.0~1.0으로 clamp 한다.
근거: `backend/app/services/thumbnail_ranker_service.py` (주석: "hallucinated scene_id 또는 유효하지 않은 score 제외")

### 2-7. 컷 길이 합계가 목표 길이와 정확히 일치하도록 재배분한다
LLM이 제안한 컷 길이를 3~15초로 clamp 한 뒤, 합계가 목표(15/30/45/60초)와 어긋나면
중앙 컷 우선으로 1초씩 가감해 정확히 맞춘다. 500회 안에 못 맞추면 결정론적 템플릿으로 되돌린다.
근거: `backend/app/cf_mode/cutboard_service.py` (`_normalize_durations`, `_adjustment_order`)

### 2-8. LLM 기획이 실패했다는 사실을 숨기지 않는다
CF 기획 LLM 호출이 실패하면 결정론적 템플릿으로 폴백하되, `planning_fallback_reason`과
`planning_attempted_model`을 응답에 담아 노출한다.
근거: `backend/app/cf_mode/planner.py` (주석: "LLM 실패가 silent fallback 으로 묻히지 않도록")
왜: 폴백이 조용히 일어나면 "왜 결과물 퀄리티가 떨어졌는지" 아무도 모른다.

### 2-9. 오디오/영상 길이 불일치로 잘려나가는 것을 막는다
기존 `-shortest` 옵션을 제거하고 세 갈래로 분기한다 — 차이 1초 이내는 그대로 믹스,
나레이션이 길면 영상 마지막 프레임 freeze(tpad), 영상이 길면 오디오 뒤 무음 패딩.
근거: `backend/app/services/merge_service.py` (주석: "이전 -shortest 는 ... 실측 1.83s 잘림")

### 2-10. 참조 영상 파일 제약을 호출 전에 미리 검사한다
fal 제약(Kling O3 Pro 파일당 10MB, Seedance 2.0 참조 영상 합계 15초)을 HEAD 요청으로
사전 확인하고 초과분은 graceful drop 한다. 단, 다음 씬 이미지는 반드시 보존한다.
근거: `backend/app/services/video_reference_chain.py`

### 2-11. 동시 요청 한도를 넘으면 큐잉하고 사용자에게 알린다
모델당 동시 처리 2건(fal 1 + Replicate 1). 초과 시 `None` 반환 → 429 + 안내 메시지.
근거: `backend/app/services/provider_router.py` (`MAX_CONCURRENT_PER_MODEL = 2`, `CONCURRENT_LIMIT_MESSAGE`)

### 2-12. 관리자 전용 모델을 환경변수로 우회할 수 없게 잠근다
`scene_structuring` 태스크의 모델은 기본 Sonnet으로 고정되고, 환경변수 `SCENE_STRUCTURING_MODEL`은
Sonnet 값(killswitch)만 허용한다. 그 외 값(상위 모델 포함)은 무시된다.
근거: `backend/app/services/llm_router.py` (`claude_model_for_task`)

---

## 3. 도메인 판단이 박혀 있는 지점 (광고·영상 마케팅 노하우)

### 3-1. 광고는 5막 리듬 구조로 시간을 배분한다
| 섹션 | 전체 대비 비중 | 에너지(1~5) | 의도 |
|---|---|---|---|
| hook | 10% | 5 | 즉시 주목 확보 |
| build | 20% | 3 | 문제·욕구 형성 |
| reveal | 20% | 4 | 제품 노출 |
| peak | 30% | 5 | 가장 강한 시각적 증거 |
| resolve | 20% | 3 | 로고·CTA 각인 |

어떤 섹션도 3초 미만으로 줄이지 않으며, 남는 초는 `peak → build → reveal → resolve → hook`
우선순위로 배분한다(가장 임팩트가 큰 구간에 여유를 먼저 준다).
근거: `backend/app/cf_mode/rhythm_service.py` (`_SECTION_SPECS`, `_allocate_sections`)

### 3-2. 무드별 BPM 지정
luxury 100 / cinematic 120 / trendy 126 / tech 128 / energetic 132 / emotional 92 BPM.
사용자가 직접 BPM을 지정하지 않으면 이 값이 BGM 생성 프롬프트로 들어간다.
BGM 프롬프트에는 "instrumental, no vocals, no lyrics, no artist imitation"이 항상 붙는다.
근거: `backend/app/cf_mode/rhythm_service.py` (`_TEMPO_BY_ENERGY`, `_build_bgm_direction`)

### 3-3. "모든 컷 3초" 템플릿을 명시적으로 거부한다
패키지 규칙에 "컷 길이는 3초로 고정되지 않는다. 캠페인 목표·소스 문서·이미지 참조·컨셉 무드에
따라 3~15초를 쓴다"고 적혀 있고, LLM 프롬프트에도 "다양한 길이(3, 5, 7, 8, 10, 12, 15)를 쓰고
모든 컷을 3초로 만들지 말 것"이 하드 제약으로 들어간다.
근거: `backend/app/cf_mode/README.md`, `backend/app/cf_mode/creative_planner_service.py`

### 3-4. 광고 기획 프롬프트는 "고정 공식 금지"를 지시한다
프롬프트에 "정해진 공식을 따르지 말 것. 특정 방식으로 열거나 CTA/로고로 끝내야 할 의무는 없다.
광고 아이디어가 가장 강한 방식으로 열고 닫아라"고 명시한다. 컷 역할 10종(hook, problem, desire,
product_reveal, feature, proof, lifestyle, impact, logo, cta)은 **필수 순서가 아니라 서술용 라벨**이며
재사용·생략·재배열이 자유롭다고 프롬프트가 직접 밝힌다.
근거: `backend/app/cf_mode/creative_planner_service.py` (`_build_prompt`), `backend/app/cf_mode/models.py` (`CutRole`)

### 3-5. 컷별로 요구하는 산출물이 광고 제작 실무 항목이다
LLM은 컷마다 `message_intent`(이 컷이 전달해야 할 것), `overlay_copy`(짧은 광고 카피),
`visual_direction`(이미지 생성 지시), `motion_direction`(영상 모션 지시), `transition_intent`(전환),
`audio_cue`(BGM/편집 큐), `source_rationale`(이 컷의 근거가 된 사용자 의도·문서·이미지)를 반환해야 한다.
`source_rationale`은 "왜 이 컷을 넣었는지" 근거를 강제하는 필드다.
근거: `backend/app/cf_mode/creative_planner_service.py`

### 3-6. 광고 카피는 자막·나레이션과 다르다고 못 박는다
프롬프트에 "CF copy is short brand/ad copy, not subtitles or narration",
"기본 보이스오버는 없음 — 나레이션 중심으로 구조를 짜지 말 것",
"BGM과 편집 리듬이 기획의 중심"이라고 명시한다.
근거: `backend/app/cf_mode/creative_planner_service.py`

### 3-7. 한국어 TTS 실측 기준 나레이션 글자 수 예산표
씬 길이별로 나레이션 글자 수의 권장 하한·상한을 12구간으로 표화했다.
(ElevenLabs `eleven_multilingual_v2` 한국어 기준)

| 씬 길이 | 4초 | 6초 | 8초 | 10초 | 12초 | 15초 |
|---|---|---|---|---|---|---|
| 권장 글자수 | 9~13 | 14~20 | 19~27 | 23~33 | 28~40 | 35~50 |

상한은 "잘림 방지용 hard ceiling", 하한은 "너무 짧아 의미가 사라지는 것 방지용 soft floor"로
역할이 구분돼 있다.
근거: `backend/app/services/narrative_engine.py` (`NARRATION_CHAR_BUDGET_BY_DURATION`)

### 3-8. 한국어 나레이션 문체 규칙
"-다", "-습니다"로 모든 문장을 끝내는 보고서체를 금지하고, 같은 종결어미가 연속되는 리듬을
실패로 규정한다. 인접 씬의 문장 끝을 의식적으로 바꾸고, 연결사만으로 글자 수를 채우지 못하게 한다.
영상 전체를 "한 사람이 끊김 없이 읽어주는 오디오북"으로 취급해 씬 N의 마지막 어조가
씬 N+1의 첫 단어와 이어지도록 요구한다.
근거: `backend/app/services/narrative_engine.py`

### 3-9. 첫 씬은 반드시 실제 촬영 컷이어야 한다
"첫 씬은 질문/관심 끌기라도 반드시 실제 카메라가 촬영한 첫 컷이어야 한다.
로고, 제목 카드, 포스터, 자막, 텍스트만 있는 장면, 추상 배경 금지."
`scene_id 1`에는 주 피사체·행동·장소·조명·카메라 거리를 모두 포함하도록 강제한다.
근거: `backend/app/services/narrative_engine.py`

### 3-10. 자동 생성 전환은 항상 컷(cut)이 기본값
"slide, zoom, whip pan, flashy transition은 자동 시나리오에 쓰지 마세요.
fade/dissolve는 사용자가 수동으로 필요할 때만 선택합니다."
근거: `backend/app/services/narrative_engine.py`

### 3-11. BGM 덕킹 수치
나레이션과 BGM이 함께 있으면 BGM을 `volume=0.25`(약 -12dB)로 낮춰 믹스하고,
BGM만 있으면 `volume=0.5`. 나레이션 시작에는 50ms 페이드인을 넣는다.
근거: `backend/app/services/merge_service.py`

### 3-12. 영상 자체 오디오는 항상 끈다
영상 생성 시 `generate_audio=False`를 강제하므로 merge는 항상 사용자 TTS/BGM을 믹스한다.
과거에는 모델이 네이티브 오디오를 가지면 믹스를 건너뛰었는데, 그 결과 Veo가 만든 임의 오디오가
섞여 사용자 나레이션이 무시되는 문제가 있었다.
근거: `backend/app/services/merge_service.py` (`should_mix_audio_tracks`, 정책 #17)

### 3-13. YouTube 콘텐츠 품질 지수(CII) 등급 임계값
`engagement = (좋아요 + 댓글) / 조회수` 기준으로 4등급 판정:
**5% 초과 Excellent / 3% 초과 Good / 1% 초과 Average / 그 이하 Low**.
채널 분석 리포트 프롬프트는 "업계 평균 1~3%"를 비교 기준으로 제시한다.
근거: `backend/app/services/youtube/youtube_service.py` (`calculate_cii`),
`backend/app/services/youtube/gemini_service.py`

### 3-14. 후크 문구 5가지 유형
질문형 / 충격형 / 공감형 / 혜택형 / 호기심형. 각 유형마다 한국어·영어 예시 문구가 코드에 있다
(예: 충격형 "90%가 틀리는 상식", 혜택형 "단 3일 만에 달라집니다").
근거: `backend/app/services/hook_service.py` (`HOOK_STYLES`)

### 3-15. 썸네일 평가 4기준
시각적 임팩트(색 대비·구도·주목도) / 감정 전달력 / **텍스트 오버레이 넣을 여백** /
스크롤 중 시선을 잡는 클릭 유도력. 특히 "여백"은 썸네일에 카피를 얹는 실무에서 나온 기준이다.
근거: `backend/app/services/thumbnail_ranker_service.py`

### 3-16. 이미지 모델 라우팅 — 비율이 아니라 '용도'로 고른다
| 조건 | 선택 모델 | 코드에 적힌 이유 |
|---|---|---|
| 인물/사물 동일성 유지 참조 있음 | `gemini-pro-image` | "identity/reference 유지 — Nano Banana Pro edit 우선" |
| 참조 3장 이상 또는 체이닝 | `flux-pro-2` | "다중 참조 또는 체이닝 — Flux Pro 2 edit 우선" |
| 일반 참조 이미지 있음 | `gemini-pro-image` | "참조 이미지 반영 — Nano Banana Pro edit 우선" |
| 참조 없음 | 비율 호환성 기준 자동 선택 | 메인+백업 모두 지원(ok) > 메인만(warn) 순 |

근거: `backend/app/services/aspect_compat.py` (`auto_route_image_model_for_plan`)

### 3-17. 비율×모델 호환 매트릭스를 3단계로 노출한다
`ok`(메인 fal + 백업 Replicate 모두 지원) / `warn`(메인만 — provider 장애 시 실패) /
`fail`(미지원 — 드롭다운에서 비활성). 기본 비율은 `9:16`이며 이유가 코드에 적혀 있다:
"Reels 베이스, 영상 4 모델 모두 지원".
매트릭스 출처도 "2026-04-28 직접 조사 (fal OpenAPI + Replicate prediction validation)"로 명시.
근거: `backend/app/services/aspect_compat.py`

### 3-18. 태스크별 LLM 우선순위가 다르다
| 태스크 | 1차 → 2차 | 사용 모델 |
|---|---|---|
| 시나리오 분석·창작 | Claude → Gemini | `claude-sonnet-4-6` → `gemini-2.5-pro` |
| 씬 구조화 | Claude → Gemini | 상동 |
| 데이터 분석·자료 조사 | Gemini → Claude | `gemini-2.5-flash` |
| 나레이션·후크 | Gemini → Claude | `gemini-2.5-pro` |
| 이미지 분석 | Gemini 단독 | Vision은 Gemini만 지원 |
| CF 광고 기획 | Fable → Gemini | 주석: "광고 컨셉/구성 창작력 우선" |

창작 태스크는 `max_tokens` 64000(모델 최대치)까지 열어두고, 후크 생성은 16384로 제한한다
("시나리오/창작 task 는 긴 응답이 정상").
근거: `backend/app/services/llm_router.py`, `backend/app/cf_mode/models.py`

### 3-19. Provider 타임아웃 90초 — 실측 근거 주석
모든 LLM provider 호출에 `asyncio.wait_for` 외부 가드 90초를 건다. 주석에 사유가 있다:
"2026-05-15: latency 233s + 502 회귀 (Cloud Run gateway timeout) 방지".
근거: `backend/app/services/llm_router.py` (`PROVIDER_TIMEOUT_SECONDS`)

### 3-20. 참조 체인 윈도우를 2 → 1로 줄인 트레이드오프 기록
"MAX_REF_WINDOW=2는 Seedance 2.0의 'Combined video duration <= 15s' 제약을 자주 위반
(씬 duration 8s+ × 2 = 16s+ → 422). Chain 의미 약화는 trade-off — production 안정성 우선."
근거: `backend/app/services/video_reference_chain.py`

---

## 4. 검증 가능한 숫자

| 항목 | 값 | 근거 |
|---|---|---|
| 메인 파이프라인 단계 | **13단계** | `app/models/pipeline_run_types.py` (`PipelineStepId`) |
| 단계 상태 종류 | 6종 (pending/running/retrying/succeeded/failed/skipped) | 동일 |
| 최종 품질 게이트 지표 | **5개**, 합격선 70점 | `app/services/final_quality_gate_service.py` |
| 영상 모델 | **5종** (Veo 3.1 i2v, Seedance 2.0 i2v, Kling v3 Pro i2v, Kling O3 Pro ref2v, Seedance 2.0 ref2v) | `app/models/types.py` (`VideoModelId`) |
| 이미지 모델 | **3종 + auto 라우팅** (Nano Banana Pro, GPT-Image-2, Flux Pro 2) | `app/models/types.py` (`ImageModel`) |
| 이미지 생성 폴백 | **3-tier** (fal → Replicate 동일모델 → Google 공식 Gemini) | `app/services/image_gen_service.py` (`_generate_with_fallback`) |
| 화면 비율 | **5종** (1:1 / 16:9 / 9:16 / 3:4 / 4:3), 기본 9:16 | `app/services/aspect_compat.py` |
| 전환 효과 | **7종** (cut/fade/dissolve/slide-left/slide-right/zoom-in/zoom-out) | `app/models/types.py` (`TransitionType`) |
| 워크플로우 모드 | **4종** (auto / image-only / advanced / cf) | `app/models/types.py` (`WorkflowMode`) |
| 비주얼 스타일 | 6종 (realistic/cinematic/illustration/3d/webtoon/documentary) | `app/models/types.py` (`VisualStyle`) |
| 나레이션 언어 | 3종 (ko/en/ja) | `app/models/types.py` (`NarrationLanguage`) |
| 씬 길이 범위 | 4~15초 (기본 10초) | `app/services/narrative_engine.py` |
| 나레이션 글자수 예산표 | 12구간 (4~15초) | `app/services/narrative_engine.py` |
| 후크 문구 스타일 | 5종 | `app/services/hook_service.py` |
| 자막 위치 | 9-point (ASS numpad 1~9) | `app/services/ass_utils.py` |
| CF 컷 역할 | **10종** | `app/cf_mode/models.py` (`CutRole`) |
| CF 리듬 섹션 | **5막** | `app/cf_mode/rhythm_service.py` |
| CF 캠페인 목표 | 6종 | `app/cf_mode/models.py` (`CampaignObjective`) |
| CF 컨셉 무드 | 8종 | `app/cf_mode/models.py` (`ConceptMood`) |
| CF 에너지 스타일 | 6종 (BPM 92~132) | `app/cf_mode/models.py`, `rhythm_service.py` |
| CF 컷 길이 / 최대 컷 수 | 3~15초 / 최대 20컷 | `app/cf_mode/models.py` |
| CF 총 길이 옵션 | 15 / 30 / 45 / 60초 | `app/cf_mode/models.py` |
| 소스 이미지 역할 분류 | 9종 (product/character/brand/style/background/location/concept/reference/unknown) | `app/cf_mode/models.py` (`SourceImageRole`) |
| 소스 반영 모드 | 6종 (image_exact / image_style / image_identity / youtube_same / youtube_new / youtube_reference) | `app/cf_mode/models.py` (`SourceReflectionMode`) |
| 소스 입력 경로 | 5종 (텍스트, 이미지 OCR, YouTube, 문서, 웹 자료조사) | `app/services/{image_ocr_service,youtube_input_service,document_input_service,research_source_service}.py` |
| LLM 태스크 라우팅 | 8종 태스크 × Primary/Fallback | `app/services/llm_router.py` (`TASK_PROVIDERS`) |
| 모델당 동시 처리 한도 | 2건 (fal 1 + Replicate 1) | `app/services/provider_router.py` |
| YouTube CII 등급 | 4등급 (5% / 3% / 1% 임계) | `app/services/youtube/youtube_service.py` |
| 백엔드 서비스 모듈 | **63개** services (+ `services/youtube/` 5개) + **9개** routers + CF 모드 18개 모듈 | `backend/app/services/`, `backend/app/routers/`, `backend/app/cf_mode/` |
| 비용 추적 | 이미지(장당) / 영상(초당) / TTS(1000자당) / BGM(초당) / LLM(1M토큰당) 5개 축 | `app/services/cost_calculator.py` |

---

## 5. 일반 접근과의 대조

**일반 AI 영상 도구로 하면 — 3단계**
1. 프롬프트 입력
2. 생성 버튼
3. 결과 다운로드

품질 판정은 사람 눈. 실패하면 처음부터 다시. 길이·비율·나레이션 싱크는 맞으면 운.

**이 시스템 — 13단계 체크포인트 + 광고 모드는 별도 8산출물 체인**

차이가 나는 지점은 단계 수 자체가 아니라 다음 네 가지다.

1. **재개 가능성**: 13단계 각각이 상태·시도 횟수·에러 코드를 기록하고, 단계마다
   `critical` 여부와 재시도 정책이 다르다. 후크 생성이 실패해도 영상은 나오고(`critical=False`),
   병합이 실패하면 멈춘다(`critical=True`). 실패 지점부터 재개한다.
   (`app/models/pipeline_run_types.py`)
2. **거부 로직**: 완성본을 5개 지표로 채점해 70점 미만은 통과시키지 않고, 모델이 지원하지 않는
   길이는 조용히 바꾸는 대신 422로 거부하며, LLM이 지어낸 씬 번호는 버린다.
3. **폴백 깊이**: 이미지 3-tier, LLM 태스크별 2-provider, 영상 fal↔Replicate 분산.
   폴백이 일어났다는 사실 자체(`tier_log`, `planning_fallback_reason`)를 응답에 남긴다.
4. **도메인 상수**: 5막 리듬 비중, 무드별 BPM, 한국어 TTS 글자수 예산표, BGM 덕킹 -12dB,
   CII 임계값 — 이 숫자들은 API 문서에 없다. 만들면서 실측하고 조정한 값이다.

코드 주석에 남은 회귀 기록이 이를 뒷받침한다 — 분할 이미지 재발(PR #121), `-shortest`로 인한
1.83초 잘림, Cloud Run 233초 latency + 502, Seedance 참조 영상 15초 제약 위반 422.

---

## 6. 규모 지표

| 항목 | 값 |
|---|---|
| 총 파일 수 | 684개 (`.git`·`node_modules` 제외) |
| 커밋 수 | **389** (GitHub API 기준) |
| Python | 289개 파일 / **66,917줄** |
| TypeScript + TSX | 267개 파일 / 44,444줄 (ts 8,995 + tsx 35,449) |
| Markdown 문서 | 79개 파일 / 48,591줄 |
| CSS | 5개 파일 / 4,254줄 |
| 테스트 | **157개 테스트 파일 / 1,260개 테스트 함수** (백엔드) + 프런트 7개 테스트 파일 |
| GitHub 언어 바이트 | Python 2.57MB / TypeScript 1.61MB / HTML 128KB / CSS 101KB |
| 주요 언어 | Python (FastAPI) + TypeScript (Next.js 16) |
| 인프라 | Cloud Run(asia-northeast3) + Vercel + Firebase Firestore/Storage |

> 참고: `.claude/CLAUDE.md`에는 "998 passed (2026-05-09 기준)"라는 당시 실행 기록이 있다.
> 위 1,260은 현재 저장소의 테스트 함수 정의 수를 센 값이며, 이번 분석에서 테스트를 실행하지는 않았다.

---

## 7. 주의

포트폴리오에 쓰면 안 되는 것:

1. **고객사 실명** — 저장소 안에 외부 참조 저장소명으로 특정 대기업 계열사 이름이 남아 있다
   (`docs/hoban-video-merge-reference-review.md`, `docs/planning/26.04.09 planning/INTEGRATION_MAPPING.md`,
   `docs/superpowers/plans/2026-04-21-import-cinema-ai-assets.md` 등, 총 8개 파일).
   해당 이름은 포트폴리오 본문·KB·화면 어디에도 쓰지 않는다. 언급이 필요하면 기존 익명 표기
   ("대형 건설·부동산 그룹") 규칙을 따른다.

2. **GCP 프로젝트 ID `pltt-cinema-260408`** — 내부 인프라 식별자다. 공개 자료에 넣을 이유가 없다.
   (제품명은 `lumio-video`이고 GCP ID와 다르다는 점이 `README.md`에 경고로 명시돼 있다.)

3. **"998 tests passed"를 현재 수치로 쓰지 말 것** — 2026-05-09 시점 기록이다.
   현재 확인된 것은 "테스트 함수 정의 1,260개"이며, 통과 수가 아니다.

4. **모델명 노출 수위** — 코드에 `claude-fable-5`, `gemini-3.1-pro-preview`,
   `gemini-3-pro-image-preview` 등 preview 단계 모델 ID가 들어 있다. 모델명을 쓸 거면
   시점이 지나 바뀔 수 있는 값임을 감안한다.

5. **내부 관리자 정책** — CF 모드 라우터 전체가 admin 전용이고 상위 모델이 RBAC로 게이팅돼
   있다는 사실은 기능 설명으로는 쓸 수 있으나, killswitch 환경변수명 같은 우회 관련 세부는 쓰지 않는다.
