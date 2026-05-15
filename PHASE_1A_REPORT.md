# Phase 1a — 데이터 계약 기초공사 보고서

**작성 기준일:** 2026-05-15  
**목표:** `src/lib/blocks`에 Zod 기반 SSOT 레이어 도입, **Hero** 블록만 end-to-end 타입·검증 경로 확정.

---

## 변경·신규 파일 (역할 한 줄)

| 경로 | 역할 |
|------|------|
| `package.json` | `zod` 의존성, `validate:sections` 스크립트 추가 |
| `src/lib/blocks/types.ts` | `BlockDefinition`, `BlockCategory`, `AnyBlockDefinition` |
| `src/lib/blocks/format-zod-error.ts` | Zod 에러를 사람이 읽을 문자열로 변환 |
| `src/lib/blocks/schemas/hero.ts` | Hero Zod 스키마(코어 타입 + `passthrough`), `mergeHeroContent`, 기본값 |
| `src/lib/blocks/schemas/info-cards.ts` ~ `video.ts` | 블록별 느슨한 스키마(필드 optional + `.passthrough()`) |
| `src/lib/blocks/index.ts` | `BLOCK_REGISTRY`, `getBlockDefinition`, `parseBlockContent`, `mergeBlockDefaults`, re-export |
| `src/components/sections/SectionRenderer.tsx` | 모든 kind에 대해 `parseBlockContent` → 실패 시 prod 스킵 / dev 경고; Hero만 `HeroContent`로 `HeroSection`에 전달 |
| `src/components/sections/HeroSection.tsx` | `meta` + `content: HeroContent` props로 변경 (렌더 로직 동일) |
| `src/app/admin/hero/page.tsx` | 저장 시 `heroContentSchema.safeParse` + `mergeHeroContent`; 폼 콜백 타입 `HeroContent` |
| `src/app/admin/sections/page.tsx` | `SimpleFormEditor`에서 **hero** 저장 분기만 Zod 검증·머지 |
| `scripts/validate-sections.ts` | Supabase `sections` 전 행 content 검증 (read-only) |

---

## `BLOCK_REGISTRY` 등록 블록 (deprecated 표기)

| kind | label (요약) | deprecated |
|------|----------------|------------|
| `hero` | Hero 배너 | |
| `info-cards` | 정보 카드 | |
| `pastor` | 담임목사 소개 | |
| `location` | 오시는 길 | |
| `department` | 부서 안내 | |
| `nurture` | 양육 | |
| `mission` | 선교 | |
| `5k-movement` | 5K 운동 | |
| `notices` | 공지사항 | |
| `prayer` | 기도제목 | |
| `gallery` | 갤러리 | |
| `lifegroup` | 목장 | |
| `image-slider` | 이미지 슬라이더 | |
| `text` | 텍스트 | |
| `image` | 이미지 | |
| `contact` | 연락처 | |
| `welcome` | 환영 (레거시) | **예** |
| `cards` | 카드 그리드 (레거시) | **예** |
| `video` | 동영상 (레거시) | **예** |

---

## `npm run validate:sections` 결과

- **총 행:** 37  
- **검증 실패(미등록 kind 포함):** 0  
- **깨진 행 샘플:** 없음 (실패 0건이므로 상위 5개 생략)

---

## `npm run typecheck` 에러 수 변화

| 시점 | `error TS` 개수 (대략) |
|------|-------------------------|
| Phase 0 보고 기준 | 181 |
| Phase 1a 적용 후 | **165** (감소 **16**) |

- **Hero 관련:** `HeroSection.tsx`에 대한 `error TS` **0건** (grep 기준).

남은 오류는 주로 `section.content`를 그대로 쓰는 다른 섹션 컴포넌트·`admin/sections` 폼의 `unknown` → `ReactNode` 등 기존 계열입니다.

---

## Phase 1b 블록 마이그레이션 우선순위 제안

1. **`info-cards`** — 홈 상단 노출·트래픽 큼, 필드는 카드 배열 중심으로 정리 용이.  
2. **`text`**, **`image`** — 필드 수가 적고 패턴이 Hero와 유사해 파일럿 확장에 적합.  
3. **`notices`**, **`prayer`** — 리스트 구조가 명확, 관리자 폼과 렌더러를 같이 묶기 좋음.  
4. **`department`**, **`nurture`**, **`mission`** — TS 오류 수가 많고 DB shape 가변, 스키마를 단계적으로 타이트하게 할 여지 큼.  
5. **`gallery`**, **`image-slider`**, **`5k-movement`** — 미디어·배열 중첩, 마지막에 손대도 리스크 분산에 유리.

---

## 다음 단계 전 사람이 확인할 체크리스트

- [ ] 로컬/배포 환경에서 **홈·교회소개 등 Hero가 있는 페이지**를 한 번씩 열어 레이아웃·영상·구절 표시가 이전과 동일한지 확인.  
- [ ] 관리자 **Hero 전용 페이지**와 **통합 sections 편집** 둘 다에서 저장이 되는지 확인.  
- [ ] CI에 `npm run validate:sections`를 넣을 경우 **Supabase 시크릿/anon** 노출 정책 검토(현재 스크립트는 anon으로 public 읽기만 수행).  
- [ ] 블록별로 **필수 필드를 optional에서 필수로 올릴지** 기획 결정(지금은 전부 optional + passthrough로 기존 DB 보호).  
- [ ] `welcome` / `cards` / `video` 레거시 행이 실제 DB에 있는지 확인; 있으면 Phase 1b에서 `SectionRenderer` 연결 또는 데이터 이전 여부 결정.

---

## 구현 메모

- Hero 타입은 **`passthrough()`와 분리**: `heroCoreSchema`로 `z.infer` 타입을 만들고, 런타임 검증만 `heroCoreSchema.passthrough()`로 수행해 `HeroContent`에 인덱스 시그니처가 붙지 않도록 함.  
- `parseBlockContent` 실패 시 **프로덕션에서는 `null` 렌더**, **개발**에서만 빨간 안내 박스.  
- DB에는 여전히 JSONB로 저장; **SQL 마이그레이션 없음**.  
- `as any` / `@ts-ignore` **미사용**. `Record<string, unknown>`으로의 단언은 Supabase `Section.content` 타입과의 접점에만 제한적으로 사용.
