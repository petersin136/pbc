# Phase 1b-2 — 리스트형 블록(notices, prayer, lifegroup) 마이그레이션 보고서

**작성 기준일:** 2026-05-15  
**목표:** `notices`, `prayer`, `lifegroup`에 Phase 1a/1b-1 표준(코어 Zod 타입 + `passthrough` 런타임 스키마 + `merge*Content` + 섹션 `meta`/`content`)을 적용하고, **배열 인덱스별 머지**를 `merge-helpers.ts`로 공유한다.

---

## 변경·신규 파일

| 경로 | 역할 |
|------|------|
| `src/lib/blocks/merge-helpers.ts` | `mergeArrayByIndex` — `defaults` → `prev[i]` → `next[i]` 순 spread, `next`가 없으면 `prev ?? []` |
| `src/lib/blocks/schemas/notices.ts` | `noticeItemCoreSchema` / `noticeItemSchema`, `noticesCoreSchema` / `noticesContentSchema`, `mergeNoticesContent(data, prev?)` |
| `src/lib/blocks/schemas/prayer.ts` | `prayerItem*` / `prayerContentSchema`, `mergePrayerContent(data, prev?)` (verse·verseRef 등 폼에 없는 필드는 `prev`에서 유지) |
| `src/lib/blocks/schemas/lifegroup.ts` | `lifegroupItem*` / `lifegroupContentSchema`, `mergeLifegroupContent(data, prev?)` |
| `src/lib/blocks/index.ts` | 위 스키마·머지·아이템 타입 및 `mergeArrayByIndex` re-export |
| `src/components/sections/NoticesSection.tsx` | `meta` + `content: NoticesContent` |
| `src/components/sections/PrayerSection.tsx` | `meta` + `content: PrayerContent` |
| `src/components/sections/LifeGroupSection.tsx` | `meta` + `content: LifegroupContent` |
| `src/components/sections/SectionRenderer.tsx` | 세 kind 분기에서 머지된 content 전달 |
| `src/app/admin/announcements/page.tsx` | 저장 시 `noticesContentSchema.safeParse` + `mergeNoticesContent(..., section.content)` |
| `src/app/admin/prayer/page.tsx` | 동일 패턴(`prayerContentSchema` + `mergePrayerContent`) |
| `src/app/admin/sections/page.tsx` | **notices / prayer / lifegroup** 저장 분기만 JSON·폼 양쪽에 Zod 검증·머지 추가 (다른 분기 미변경) |
| `PHASE_1B_2_REPORT.md` | 본 문서 |

**미수행(요청대로 선택):** `info-cards`를 `mergeArrayByIndex`로 리팩터링하지는 않았다.

---

## `merge-helpers.ts` 설계 요약

- 제네릭 `T extends Record<string, unknown>`.
- `next`가 `undefined`이면 **이전 배열 전체 유지** (`prev ?? []`).
- `next`가 배열이면 길이만큼 `map`하며 각 인덱스에 `{ ...defaults, ...(prev?.[i] ?? {}), ...item }` 적용 → **짧아진 길이는 잘림**, 폼이 보내지 않은 필드는 동일 인덱스의 `prev`에서 유지.

---

## 블록별 스키마 (필드 / 아이템)

### notices (`NoticesContent`)

| 필드 | Zod | 비고 |
|------|-----|------|
| `description` | `string` optional | 기본 `""` |
| `headerImage` | `string` optional | 기본 `""` (렌더에서 trim) |
| `notices` | `noticeItemSchema[]` optional | 기본 `[]` |

**`NoticeItem` (코어):** `title`, `date`, `content`, `category`, `author` (optional string), `important` (optional boolean). 런타임은 `noticeItemSchema` = 코어 + `passthrough()`.

### prayer (`PrayerContent`)

| 필드 | 비고 |
|------|------|
| `description`, `headerImage` | notices와 동일 패턴 |
| `prayers` | `prayerItemSchema[]` |

**`PrayerItem`:** `title`, `content`, `date`, `category`, `requestedBy`, `verse`, `verseRef` (optional string), `urgent` (optional boolean) + passthrough.

### lifegroup (`LifegroupContent`)

| 필드 | 비고 |
|------|------|
| `description` | optional string, 기본 `""` |
| `lifegroups` | `lifegroupItemSchema[]` optional, 기본 `[]` |

**`LifegroupItem`:** `number` (`coerce.number` optional), `leader`, `meetingDay`, `location`, `name`, `schedule`, `description`, `leaderPhone` (optional string), `members` (`z.array(z.string())` optional) + passthrough. (`LifeGroupSection` 모달·카드에서 읽는 필드 합집합)

---

## `npm run validate:sections`

| 항목 | 값 |
|------|-----|
| 총 행 | 37 |
| 검증 실패 | **0** |
| kind별 실패 분포 | 실패 없음 |

---

## `npm run typecheck`

| 항목 | 값 |
|------|-----|
| 전체 `error TS` 개수 (grep) | **123** (직전 세션에서 보고된 163 대비 감소로 측정됨; 동일 브랜치 재현 시 기준으로 사용) |
| `src/app/admin/sections/page.tsx` | **11** (`content`가 `Record<string, unknown>`인 누적 이슈로, 이번에 추가한 분기만으로는 줄지 않음) |

이번에 수정한 `NoticesSection` / `PrayerSection` / `LifeGroupSection` / `announcements` / `prayer` / 블록 스키마·`merge-helpers`에서는 **신규 TS 에러 없음**을 확인했다.

---

## lifegroup 전용 관리자 페이지

`src/app/admin` 하위에 **`lifegroup` / `life-group` 명의 전용 페이지 없음**. 목장은 **`/admin/sections` 통합 편집기**의 **default 폼 + JSON 모드** 및 이번에 추가한 **저장 시 `lifegroupContentSchema` 검증·머지**로 처리된다.

---

## 사이드이펙트·환경 (에이전트)

- **공개 페이지:** `validate:sections` 전 행 통과로 DB 상 notices/prayer/lifegroup content는 현재 스키마와 호환된다.
- **관리자:** `/admin/announcements`, `/admin/prayer` — 저장 경로에 Zod + 머지 적용됨 (에이전트에서 브라우저 로그인 UI 테스트는 생략).
- **`.env.local`:** 워크스페이스에 **파일 존재** 확인. **값은 출력하지 않음.** `validate:sections`가 Supabase에 연결된 것으로 보아, 실행 환경에는 `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 **설정되어 있음**을 간접 확인했다.
- **홈 `/` 500:** 이번 변경 범위 밖; 이전 단계에서 `.next` 정리·Supabase 클라이언트 지연 초기화 등이 논의된 바, 로컬에서 `rm -rf .next && npm run dev` 후 재확인 권장.

---

## Phase 1b-3(department, nurture, mission) 진입 전 주의

1. **배열·중첩 객체**가 많은 블록은 `mergeArrayByIndex`와 동일한 **“draft = spread(prev) + 폼 필드 → safeParse → merge(data, prev)”** 순서를 반복 적용하는 것이 안전하다.  
2. `admin/sections/page.tsx`는 **분기 추가만** 유지하고, 전면 리팩터는 1b 종료 후 별도 태스크로 두는 것이 좋다.  
3. 스키마에서 **`z.array(z.string())` 등 엄격한 타입**은 레거시 DB 값(문자열 하나 등)과 충돌할 수 있으므로, 실패 시 `validate:sections` 샘플을 보고 완화·`preprocess` 여부를 판단한다.
