# Phase 1b-1 — 단순 블록(text, image, info-cards) 마이그레이션 보고서

**작성 기준일:** 2026-05-15  
**목표:** Phase 1a에서 확정한 Hero 패턴(코어 Zod 타입 + `passthrough` 런타임 스키마 + `merge*Content` + 섹션 `meta`/`content` 분리 + 저장 시 `safeParse`)을 **text**, **image**, **info-cards**에 동일 적용. **contact**는 요구사항대로 `TextSection` 유지, content는 **text** 스키마로 재파싱·머지만 수행.

---

## 변경·신규 파일

| 경로 | 변경 요약 |
|------|------------|
| `src/lib/blocks/schemas/text.ts` | `textCoreSchema` / `textContentSchema`, `TextContent`, `textDefaultContent`, `mergeTextContent`(정렬 공백 시 기본 `center`) |
| `src/lib/blocks/schemas/image.ts` | `imageCoreSchema` / `imageContentSchema`, `mergeImageContent`, `resolveImageSectionUrl` |
| `src/lib/blocks/schemas/info-cards.ts` | 중첩 카드·링크·설교·아이템 스키마, `infoCardBlockSchema` export, `InfoCardBlock` 타입, `mergeInfoCardsContent`(배열 안전 병합) |
| `src/lib/blocks/index.ts` | text / image / info-cards 관련 심볼 re-export |
| `src/components/sections/TextSection.tsx` | `meta` + `content: TextContent`, 캐스트 제거 |
| `src/components/sections/ImageSection.tsx` | `meta` + `content: ImageContent`, URL은 `resolveImageSectionUrl` |
| `src/components/sections/InfoCardsSection.tsx` | `meta` + `content: InfoCardsContent`, 렌더 분기 동일 |
| `src/components/sections/SectionRenderer.tsx` | text / image / info-cards는 머지된 content 전달; **contact**는 `parseBlockContent("text", …)` 실패 시 dev 전용 경고 |
| `src/app/admin/text-sections/page.tsx` | 저장 전 `textContentSchema.safeParse` + `mergeTextContent`, 기존 content 키 보존을 위한 draft 병합 |
| `src/app/admin/image-sections/page.tsx` | 동일 패턴(`imageContentSchema` + `mergeImageContent`) |
| `src/app/admin/content-cards/page.tsx` | `infoCardsContentSchema` + `mergeInfoCardsContent`; 폼이 다루는 필드만 갱신하고 카드별로 **기존 `sermons`/`items`/`link` 등 유지** |
| `src/app/admin/sections/page.tsx` | `SimpleFormEditor` 저장 시 **text**, **image** 분기만 Hero와 동일하게 Zod 검증·머지(JSON 모드 포함) |
| `PHASE_1B_1_REPORT.md` | 본 문서 |

---

## 블록별 스키마 필드 (optional / required)

Zod 상으로는 **핵심 필드는 모두 optional**이며, 렌더·저장 안정성은 **`defaultContent` + `merge*Content`**로 보장한다. **`.passthrough()`**로 DB에만 있는 추가 키는 유지된다.

### text (`textCoreSchema` → `TextContent`)

| 필드 | Zod | 비고 |
|------|-----|------|
| `heading` | `string` optional | 기본 `""` |
| `subheading` | `string` optional | 기본 `""` |
| `text` | `string` optional | 기본 `""` |
| `description` | `string` optional | 기본 `""` |
| `alignment` | `string` optional | 기본 `"center"`; 머지 시 공백이면 `center` |
| `backgroundImage` | `string` optional | 기본 `""` |

### image (`imageCoreSchema` → `ImageContent`)

| 필드 | Zod | 비고 |
|------|-----|------|
| `heading`, `subheading`, `description` | optional string | 기본 `""` |
| `backgroundImage`, `src`, `image`, `url` | optional string | 기본 `""`; 표시 URL은 `resolveImageSectionUrl` |
| `alt`, `caption` | optional string | 기본 `""` |

### info-cards (`infoCardsCoreSchema` → `InfoCardsContent`)

| 필드 | Zod | 비고 |
|------|-----|------|
| `heading`, `description` | optional string | 기본 `""` |
| `cards` | `infoCardBlockSchema[]` optional | 기본 `[]` |
| `images` | `{ url?, alt? }[]` optional | 기본 `[]` |
| `autoPlayInterval` | `coerce.number` optional | 숫자 문자열 허용 |

**카드 한 장 (`infoCardBlockSchema`):** `title`, `description`, `icon`, `href`, `image`, `link`, `sermons`, `items` — 모두 optional + 하위 객체도 `passthrough`.

---

## `npm run validate:sections`

| 항목 | 값 |
|------|-----|
| 총 행 | 37 |
| 검증 실패 | **0** |
| kind별 실패 분포 | 실패 없음 |

샘플 실패 행: 해당 없음.

---

## `npm run typecheck`

| 구분 | 값 |
|------|-----|
| 전체 `error TS` 개수 (grep 기준) | **163** (Phase 1a 보고서 기준 약 165 대비 소폭 감소로 기록) |
| `src/app/admin/sections/page.tsx` 내 오류 | **11** (기존 `content`를 `Record<string, unknown>`로 두어 필드 표현식이 `unknown`인 이슈 등; 이번 작업은 **text/image 저장 분기만** 추가·정리) |

대상 외 섹션 컴포넌트는 수정하지 않았다.

---

## 관리자 폼·라우트 수동 확인 (에이전트 환경)

로컬에서 `npm run dev` 후 `curl`로만 스모크했다 (브라우저 로그인·폼 제출 없음).

| URL | 결과 |
|-----|------|
| `/` | **500** (이 환경에서만 재현; Supabase/빌드 설정 이슈 가능. 코드 변경과 직접 연관 단정 불가) |
| `/admin/text-sections`, `/admin/image-sections`, `/admin/content-cards`, `/admin/sections` | **307** (비로그인 리다이렉트로 추정) |

**권장:** 로그인 후 관리자에서 text / image / info-cards 저장 한 번씩 눌러 Zod 실패 알림이 뜨지 않는지 확인한다.

---

## 다음 단계 (1b-2: notices, prayer, lifegroup) 전 주의사항

1. 이번에 `info-cards` 관리 폼 저장 시 **카드 배열을 인덱스 단위로 이전 행과 병합**해 두었으므로, 1b-2에서도 **배열·중첩 구조**는 “폼이 덮어쓰는 필드만 갱신” 패턴을 재사용하는 것이 안전하다.  
2. `parseBlockContent`가 이미 전역에서 돌고 있으므로, 새 블록도 **코어 vs `passthrough` 분리**를 깨지 않으면 `z.infer`에 인덱스 시그니처가 붙는 문제를 피할 수 있다.  
3. `validate:sections`는 **등록된 kind의 스키마**로만 검증한다; 스키마를 타이트하게 올리면 이 스크립트가 먼저 깨진 행을 잡아준다.
