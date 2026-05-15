# 프로젝트 구조 감사 리포트 (리뉴얼 계획용)

**대상:** 포천중앙침례교회 웹사이트 (`pbc`)  
**작성 기준:** 저장소 소스·마이그레이션·설정 파일 읽기 전용 분석 (2026-05-15 기준)  
**범위:** 런타임 DB 실데이터·호스팅 계정 내부 설정은 포함하지 않음

---

## 1. 기술 스택

### 프레임워크 / 언어 / 빌드

| 항목 | 내용 |
|------|------|
| 프레임워크 | **Next.js** App Router (`src/app`) |
| 언어 | **TypeScript** (`strict: true`) |
| React | **19.1.0** |
| 빌드/번들 | Next 기본 (Turbopack은 `package.json` 스크립트에 미명시, `next dev` 기본) |

### UI

| 항목 | 내용 |
|------|------|
| 스타일 | **Tailwind CSS v4** (`@import "tailwindcss"` in `globals.css`, PostCSS `@tailwindcss/postcss`) |
| 컴포넌트 라이브러리 | **shadcn / MUI 없음** — 페이지·관리자 UI는 Tailwind 유틸 + 자체 컴포넌트 |
| 모션 | **framer-motion** |

### 상태 관리 / 데이터 페칭

| 항목 | 내용 |
|------|------|
| 전역 스토어 | **없음** (Redux, Zustand 등 미사용) |
| 서버 상태 | **React Query 미사용** — `useEffect` + Supabase 클라이언트 호출 패턴이 주류 |
| 폼/에디터 | **Tiptap** (`@tiptap/react`, starter-kit, image, text-align) — 관리자 리치 텍스트용 |

### 백엔드 / DB / 인증

| 항목 | 내용 |
|------|------|
| BaaS | **Supabase** (`@supabase/supabase-js`) |
| 주요 테이블(앱에서 실제 쿼리) | `sections`, `gallery_categories`, `gallery_events`, `gallery_photos` |
| 인증 | Supabase **Auth** 이메일/비밀번호, `user_metadata.role` (`admin` \| `editor` \| `viewer`) |
| ORM | **Prisma 등 없음** — Supabase JS 클라이언트 직접 사용 |

### 배포

| 항목 | 내용 |
|------|------|
| 명시적 설정 | 저장소에 **`vercel.json` 없음** — Vercel/자체 Node 등은 README·환경에 따라 다를 수 있음 |
| CI | GitHub Actions — Supabase REST 헬스체크용 워크플로 (`.github/workflows/supabase-ping.yml`) |

### 주요 패키지 버전·노후/메이저 이슈 메모

`package.json` 기준과 `npm outdated` 샘플(로컬 기준)을 함께 보면:

- **Next 15.x** — `npm outdated` 상 **Next 16**, `eslint-config-next` 16 계열이 최신으로 표시됨 → 메이저 업 시 마이그레이션 검토 필요.
- **React 19.1** — 최신 마이너/패치와 차이는 있으나 메이저 전환 이슈는 상대적으로 작음.
- **@supabase/supabase-js** — package는 `^2.75.0` 선언, 설치된 minor가 더 높을 수 있음. 정기 업데이트 권장.
- **ESLint 9** — `eslint` 최신 메이저(10)와의 정책 정리 필요할 수 있음.
- **@types/node** — 20.x 고정 vs Latest 25 — Node 런타임 버전과 맞출 것.
- **Tiptap** — `npm outdated`에서 MISSING으로 나올 수 있음(설치 상태/링크 이슈). 실제 빌드 시 lockfile 기준으로 확인 권장.

### 빌드 품질 관련 설정 (부채 신호)

`next.config.ts`에서 **`typescript.ignoreBuildErrors: true`**, **`eslint.ignoreDuringBuilds: true`** — CI/배포에서 타입·린트 실패가 가려질 수 있음.

---

## 2. 폴더 구조 (depth 3 요약)

```
pbc/
├── .github/workflows/     # GitHub Actions (Supabase ping 등)
├── public/images/         # 정적 이미지 자산
├── scripts/               # 유지보수용 TS 스크립트 (예: 갤러리 import)
├── supabase/migrations/   # SQL 마이그레이션 (sections, gallery, RLS 등)
└── src/
    ├── app/               # Next App Router: 페이지·레이아웃·API 라우트
    │   ├── admin/         # 관리자 UI (다수 세부 경로)
    │   ├── about|choir|education|gallery|lifegroup|mission|news|nurture|word/  # 공개 부서·콘텐츠 라우트
    │   └── api/           # Route Handlers (이미지 업로드, 갤러리 동기 등)
    ├── components/        # UI (header, sections, admin 공통)
    ├── lib/supabase/      # Supabase 클라이언트·도메인별 쿼리 헬퍼
    └── types/             # 섹션 content 등 타입 정의
```

| 경로 | 역할 (한 줄) |
|------|----------------|
| `src/app` | 라우팅·페이지 단위 진입점 |
| `src/app/admin` | 인증 후 콘솔형 관리 화면 (섹션별 폼·순서 조정) |
| `src/components/sections` | `sections` 테이블 `kind`별 공개 사이트 렌더러 |
| `src/lib/supabase` | DB 접근·Auth 헬퍼 |
| `supabase/migrations` | 스키마·RLS 정책 (로컬/원격 DB와 싱크 필요) |
| `scripts` | 운영 보조 스크립트 |
| `public` | 정적 파일 |

참고: `src/app/welcome/` 는 **빈 디렉터리**(페이지 없음)로 보임 — 잔여 구조일 가능성.

---

## 3. 라우팅 맵

### 공개 페이지 (`src/app/.../page.tsx`, `/admin` 제외)

| URL 경로 | 컴포넌트 파일 |
|----------|----------------|
| `/` | `src/app/page.tsx` |
| `/about` | `src/app/about/page.tsx` |
| `/about/pastor` | `src/app/about/pastor/page.tsx` |
| `/about/location` | `src/app/about/location/page.tsx` |
| `/about/facilities` | `src/app/about/facilities/page.tsx` |
| `/education/youth` | `src/app/education/youth/page.tsx` |
| `/education/highschool` | `src/app/education/highschool/page.tsx` |
| `/education/sunday-school` | `src/app/education/sunday-school/page.tsx` |
| `/education/kindergarten` | `src/app/education/kindergarten/page.tsx` |
| `/education/bible-study` | `src/app/education/bible-study/page.tsx` |
| `/choir` | `src/app/choir/page.tsx` |
| `/choir/yada` | `src/app/choir/yada/page.tsx` |
| `/choir/joyful` | `src/app/choir/joyful/page.tsx` |
| `/choir/terua` | `src/app/choir/terua/page.tsx` |
| `/nurture/newcomer` | `src/app/nurture/newcomer/page.tsx` |
| `/nurture/leader` | `src/app/nurture/leader/page.tsx` |
| `/nurture/discipleship` | `src/app/nurture/discipleship/page.tsx` |
| `/nurture/advanced` | `src/app/nurture/advanced/page.tsx` |
| `/mission/domestic` | `src/app/mission/domestic/page.tsx` |
| `/mission/overseas` | `src/app/mission/overseas/page.tsx` |
| `/news/notices` | `src/app/news/notices/page.tsx` |
| `/news/prayer` | `src/app/news/prayer/page.tsx` |
| `/news/testimony` | `src/app/news/testimony/page.tsx` |
| `/word/sermons` | `src/app/word/sermons/page.tsx` |
| `/word/articles` | `src/app/word/articles/page.tsx` |
| `/lifegroup` | `src/app/lifegroup/page.tsx` |
| `/gallery` | `src/app/gallery/page.tsx` |
| `/gallery/[category]` | `src/app/gallery/[category]/page.tsx` |
| `/gallery/event/[event_id]` | `src/app/gallery/event/[event_id]/page.tsx` |

**동적 라우트:** `gallery/[category]`, `gallery/event/[event_id]`.

### 관리자 전용

모두 `src/app/admin/.../page.tsx` 하위. 로그인 제외 시 **`admin/layout.tsx`**에서 `hasAdminAccess()` 후 미인증 시 `/admin/login` 리다이렉트.

| URL | 파일 |
|-----|------|
| `/admin/login` | `src/app/admin/login/page.tsx` |
| `/admin/dashboard` | `src/app/admin/dashboard/page.tsx` |
| `/admin/hero` | `src/app/admin/hero/page.tsx` |
| `/admin/content-cards` | `src/app/admin/content-cards/page.tsx` |
| `/admin/text-sections` | `src/app/admin/text-sections/page.tsx` |
| `/admin/image-sections` | `src/app/admin/image-sections/page.tsx` |
| `/admin/team` | `src/app/admin/team/page.tsx` |
| `/admin/location` | `src/app/admin/location/page.tsx` |
| `/admin/contact` | `src/app/admin/contact/page.tsx` |
| `/admin/departments` | `src/app/admin/departments/page.tsx` |
| `/admin/announcements` | `src/app/admin/announcements/page.tsx` |
| `/admin/prayer` | `src/app/admin/prayer/page.tsx` |
| `/admin/gallery` | `src/app/admin/gallery/page.tsx` |
| `/admin/sections` | `src/app/admin/sections/page.tsx` |
| `/admin/education/youth` 등 4개 | `src/app/admin/education/*/page.tsx` |
| `/admin/choir/yada`, `joyful`, `terua` | `src/app/admin/choir/*/page.tsx` |

### API Route Handlers

| 경로 | 파일 |
|------|------|
| (추정) `/api/upload-image` | `src/app/api/upload-image/route.ts` |
| (추정) `/api/gallery-sync` | `src/app/api/gallery-sync/route.ts` |

### 부서(Department) 분기 방식

- **URL 세그먼트**로 부서·기능이 나뉨 (`/education/youth`, `/choir/yada` 등).
- **콘텐츠 소스**는 대부분 Supabase `sections` 테이블의 **`page` 문자열 키**와 매핑됨. 예: 청년부 공개 페이지는 `getSectionsByPage("education-youth")` (`src/app/education/youth/page.tsx`).
- `src/lib/supabase/sections.ts`의 **`PAGES` 상수**에 허용되는 `page` 값과 한글 레이블이 집약되어 있음 — **신규 부서 페이지 추가 시 이 상수·공개 `page.tsx`·관리자 대응 페이지를 함께 맞춰야 함.**

### 네비게이션과 라우트 불일치 (리뉴얼 시 정리 대상)

`src/components/header/Header.tsx`의 `menuItems`에는 **`/word/*`, `/news/testimony`, `/nurture/discipleship`, `/nurture/advanced`, `/education/bible-study`** 등이 **포함되어 있지 않음**. 페이지는 존재하므로 SEO·UX 측면에서 링크 구조를 재정의할 여지가 큼.

### 로그인 필요 구분

| 구분 | 설명 |
|------|------|
| 공개 | 위 공개 라우트 전반 (인증 없이 읽기) |
| 관리자 | `/admin/*` 중 `/admin/login` 제외 — 클라이언트 레이아웃에서 역할 검사 |
| API | 인증 방식은 각 `route.ts` 구현에 따름 (본 감사에서 미전부 열람) |

---

## 4. 데이터 모델

### 애플리케이션에서 실제 사용 중인 테이블 (Supabase 클라이언트 기준)

#### `public.sections` (핵심)

| 필드 (마이그레이션·타입 기준) | 설명 |
|-------------------------------|------|
| `id` | UUID PK |
| `page` | 논리 페이지 키 (예: `home`, `education-youth`) |
| `kind` | 섹션 종류 (`hero`, `text`, …) |
| `title` | 관리용 제목 |
| `content` | **JSONB** — 블록별 속성 전부 저장 |
| `section_order` | 정렬 순서 |
| `created_at` / `updated_at` | 타임스탬프 |
| `created_by` | `auth.users` 참조 (선택) |

#### 갤러리 (`002_create_gallery_tables.sql`)

| 테이블 | 주요 필드 | 관계 |
|--------|-----------|------|
| `gallery_categories` | `id`, `name_kr`, `name_en` (UNIQUE), `description` | — |
| `gallery_events` | `category_id`, `title`, `date`, `cover_url`, `description` | N:1 → categories |
| `gallery_photos` | `event_id`, `file_url`, `file_name` | N:1 → events |

### 코드·마이그레이션에만 등장하는 스키마 (`003_enable_rls_security.sql`)

다음은 **RLS 정책 예시로 등장**하나, 현재 앱 소스의 Supabase 쿼리에서는 **`sections` / 갤러리 3종 외 직접 조회가 거의 없음**:

- `app_public.sections`, `app_public.pages`, `app_public.departments`, `app_public.users`, `app_public.settings`, `app_public.media`, `app_public.posts`, `app_public.sermons`, `app_public.events`, `app_public.albums`, `app_public.gallery_photos`, `app_public.gallery_comments`

**예외:** `src/app/sitemap.ts`는 `pages` 테이블(스키마 접두사 없이 `from("pages")`)을 조회 시도 — **실제 DB에 `public.pages`가 없으면 조용히 실패·로그만 남고 정적 sitemap만 반환**하는 구조.

### ERD (텍스트)

```
auth.users
   ↑ (optional FK)
sections.created_by

gallery_categories ──< gallery_events ──< gallery_photos
```

**부서(Department)** 는 별도 `departments` 테이블이 아니라, 주로 **`sections.page` 문자열** + URL 라우트 + (일부) `department` kind 섹션의 `content` JSON으로 표현됨.

### User / Post / Block

| 개념 | 현재 구현 |
|------|-----------|
| User | Supabase Auth 사용자 + `user_metadata.role` |
| Post | 범용 `posts` 테이블를 앱에서 직접 쓰지 않음. 공지/기도 등은 **`sections` JSON 안의 배열**로 많이 모델링됨 |
| Block | **`sections` 한 행 = 한 블록**; 스키마는 `kind` + `content` JSONB |

---

## 5. 웹빌더 구조 분석

### 패러다임

- **섹션 기반(Section-based)** 페이지 빌더에 가깝습니다.
- **자유 캔버스나 노드 그래프형 에디터는 아님.**
- 한 페이지(`page` 키)에 여러 `sections` 행이 순서대로 쌓이고, 공개 사이트는 `SectionRenderer`로 `kind`만 분기합니다.

### 블록(섹션) 종류와 렌더링

`SectionRenderer` (`src/components/sections/SectionRenderer.tsx`)에 연결된 `kind`:

| `kind` | 컴포넌트 | 비고 |
|--------|----------|------|
| `hero` | `HeroSection` | 영상/이미지/그라데이션 등 |
| `info-cards` | `InfoCardsSection` | |
| `pastor` | `PastorSection` | |
| `location` | `LocationSection` | |
| `department` | `DepartmentSection` | |
| `nurture` | `NurtureSection` | |
| `mission` | `MissionSection` | |
| `5k-movement` | `FiveKMovementSection` | |
| `notices` | `NoticesSection` | |
| `prayer` | `PrayerSection` | |
| `gallery` | `GallerySection` | |
| `lifegroup` | `LifeGroupSection` | |
| `image-slider` | `ImageSliderSection` | |
| `text` | `TextSection` | |
| `image` | `ImageSection` | |
| `contact` | **임시로 `TextSection`** | 주석: 전용 컴포넌트 없음 |

**파일은 존재하나 `SectionRenderer`에 미연결:** `WelcomeSection.tsx`, `CardsSection.tsx`, `VideoSection.tsx` — DB에 해당 `kind`가 들어가면 **default 경고 UI**로 떨어질 수 있음.

### Props / Schema

- 런타임 스키마 검증 라이브러리(Zod 등) **없음**.
- `Section.content` 타입은 **`Record<string, unknown>`** (`sections.ts`)로 넓게 잡혀 있고, 세부 형태는 `src/types/section-content.ts`에 **문서·개발용 인터페이스**로만 존재 → **DB·관리자 폼·렌더러 간 계약이 타입으로 강제되지 않음.**

### 저장 방식

- **한 블록 = `sections` 테이블 한 row**, 가변 필드는 **`content` JSONB**에 전부 저장.
- 별도 `blocks` 자식 테이블 없음.

### 렌더링 (SSR / CSR / ISR)

- 공개 주요 페이지: **`"use client"`** + `useEffect`에서 `getSectionsByPage` 호출 → 데이터는 **클라이언트에서 로드**되는 패턴이 많음.
- Next의 **ISR `revalidate`**, **RSC 전용 fetch 캐시** 패턴은 이 감사 범위에서 두드러지지 않음 → **SEO·첫 페인트·캐시 전략은 리뉴얼 시 재검토 가치 큼.**

### 편집 모드 vs 보기 모드

- **URL 분리형:** 공개는 `/education/youth` 등, 편집은 `/admin/education/youth` 등.
- 인라인 WYSIWYG “미리보기 모드”는 없고, 관리자 폼 저장 후 공개 페이지 새로고침으로 확인하는 흐름.

### 드래그 앤 드롭

- **`@dnd-kit`, `react-beautiful-dnd` 등 DnD 라이브러리 없음.**
- 순서 변경은 **`section_order` 스왑** + 위/아래 버튼 패턴 (`AdminComponents.SectionCard` 등)이 실제 구현.
- **주의:** `admin/dashboard` 도움말에 “드래그앤드롭으로 순서 변경” 문구가 있으나 **구현과 불일치** (UX 부채).

---

## 6. 관리자 모드 분석

### 경로·기능 요약

- **대시보드·퀵링크:** `/admin/dashboard`
- **섹션 종류별 전용 관리:** Hero, 정보 카드, 텍스트, 이미지, 팀, 위치, 연락처, 부서 안내, 공지, 기도, 갤러리 등 — 각각 별도 `page.tsx`에서 해당 `page` 키의 `sections`만 조회·수정.
- **교육·찬양 하위:** `/admin/education/*`, `/admin/choir/*`
- **고급:** `/admin/sections` — 페이지 선택 후 섹션 CRUD·순서·(대용량) 폼 에디터가 한곳에 집약된 **통합 콘솔** 성격

### 권한 체계

| 역할 | 앱에서의 의미 |
|------|----------------|
| `admin`, `editor` | `hasAdminAccess() === true` → 관리 UI 진입 |
| `viewer` | 로그인 가능해도 **관리자 UI는 거부** (현재 `hasAdminAccess` 구현 기준) |
| 부서별 관리자 | **코드 상 분리 없음** — 동일 Supabase 정책·동일 관리자 화면. 부서 “담당자만 해당 페이지만” 같은 **행 단위 RLS는 없음** |

### 슈퍼 관리자 vs 부서 관리자

- **구분 없음.** `admin`과 `editor`만 구분.

### 빌더(섹션) vs 관리자 “안 맞는” 의심 지점

| # | 내용 | 위치 |
|---|------|------|
| 1 | `SECTION_KINDS` / DB에만 있는 `kind`가 렌더러에 없으면 **노란 경고 박스** | `SectionRenderer.tsx` default |
| 2 | `contact` 전용 UI 없이 `TextSection`으로 대체 | `SectionRenderer.tsx` |
| 3 | `WelcomeSection`, `CardsSection`, `VideoSection` **미등록** | `components/sections/*.tsx` vs `SectionRenderer.tsx` |
| 4 | 샘플 SQL의 `welcome` kind 등 **초기 시드와 현 렌더러 불일치** 가능성 | `supabase/migrations/001_create_sections_table.sql` 하단 INSERT |
| 5 | 대시보드 문구 vs 실제 순서 변경 UX (DnD 없음) | `admin/dashboard/page.tsx` |
| 6 | `PAGES` / 공개 라우트 / 헤더 메뉴 **삼자 불일치** 위험 | `sections.ts`, `Header.tsx`, 각 `page.tsx` |
| 7 | 통합 `/admin/sections`와 개별 `/admin/hero` 등 **이중 편집 경로** — UX·교육 비용 | 전반 |
| 8 | RLS: 마이그레이션 001(JWT `user_metadata.role`) vs 003(다른 정책 스타일) **이원화** 가능성 | `supabase/migrations/*.sql` |

---

## 7. 디자인 시스템 현황

### 토큰

- `globals.css`에 **`--background`, `--foreground`** 만 최소 정의.
- `prefers-color-scheme: dark` 시 CSS 변수 전환은 있으나, **컴포넌트 전반에 다크 테마가 일관 적용된다고 보기 어려움** (대부분 라이트 기반 Tailwind 클래스).

### 폰트·간격

- 본문 폰트: **Pretendard 우선** + 시스템 폰트 스택 (`body` in `globals.css`).
- 간격·색상: **Tailwind 유틸 직접 사용** — 디자인 토큰 레이어(예: `theme.extend`) 중앙집중형은 약함.

### 공통 컴포넌트

- `src/components/admin/AdminComponents.tsx` — `SectionCard`, 모달 등 **관리자용** 조각.
- **공개 사이트용 공통 `Button`/`Card` 디렉터리는 없음** — 섹션별 컴포넌트에 스타일 분산.

### 반응형

- Tailwind 브레이크포인트(`sm`, `md`, `lg` 등)를 섹션·헤더에서 사용 — **모바일 대응은 존재**.
- 별도 Figma/디자인 시스템 문서는 저장소에 없음.

### 다크모드

- **OS 다크에 맞춘 CSS 변수만 부분 존재**; 제품 수준의 다크모드 토글·컴포넌트 테마는 **없음**으로 판단.

---

## 8. 발견된 문제점 / 기술 부채

### 아키텍처·일관성

- **클라이언트 페칭 중심** 공개 페이지 → 초기 로딩·SEO·레이아웃 시프트 리스크.
- **페이지 키(`page`) 문자열**이 여러 파일에 분산 — 오타·누락 방지 장치 부족.
- **관리자 이중 구조** (통합 sections vs 전용 admin 페이지) — 온보딩 난이도.

### 코드 품질

- `Section.content` 광범위 `unknown` — **런타임 검증 부재**.
- 빌드 시 타입/린트 무시 설정 (`next.config.ts`).
- 사용되지 않거나 렌더러에 없는 섹션 컴포넌트 **잔존**.

### 보안 (의심·즉시 검토 권장)

- `src/lib/supabase/client.ts`: 환경 변수 미설정 시 **Supabase URL 및 anon 키가 코드 내 폴백으로 존재** + **콘솔에 환경 체크 로그 출력** — **저장소에 노출된 anon 키는 로테이션·제거 권장**, 클라이언트 번들에도 포함될 수 있음.
- 관리자 보호가 **클라이언트 레이아웃**에 의존 — **미들웨어(`middleware.ts`) 없음** → 직접 URL 입력 시 잠깐 깜빡이거나 API는 별도 방어 필요.
- 갤러리 RLS 정책 일부가 `003`에서 **의도와 다르게 넓을 수 있는 패턴**(`auth.users` EXISTS 등)으로 보임 — **DB 보안은 Supabase 대시보드 실제 정책과 대조 필요**.

### 성능

- 히어로 **배경 MP4** 등 대용량 미디어 — 개발 시 대역폭 이슈로 **코드에서 개발 환경 비디오 비활성화**가 이미 적용된 상태(`HeroSection.tsx` 등, 본 감사 시점 기준).
- `next/image`의 `remotePatterns`는 설정되어 있으나, 일부는 **`unoptimized`** 사용(로고) — 트레이드오프 확인.

---

## 9. 리뉴얼 시 영향도 큰 파일 TOP 10

| 순위 | 파일 | 이유 |
|------|------|------|
| 1 | `src/lib/supabase/sections.ts` | `PAGES`, `SECTION_KINDS`, CRUD — **모든 페이지·관리자의 계약 중심** |
| 2 | `src/components/sections/SectionRenderer.tsx` | 공개 렌더링 **단일 스위치** — `kind` 추가/변경 시 전역 영향 |
| 3 | `src/lib/supabase/client.ts` | 모든 DB 접근의 **출발점**; 키·환경 처리 |
| 4 | `src/lib/supabase/auth.ts` | 역할 모델·관리자 게이트 |
| 5 | `src/app/admin/layout.tsx` | 관리자 셸·인증 분기 |
| 6 | `src/app/admin/sections/page.tsx` | 통합 편집기 (대용량) — **한 번의 실수가 여러 페이지에 전파** |
| 7 | `src/components/header/Header.tsx` | IA·부서 내비 — 리뉴얼 시 메뉴 재설계의 핵심 |
| 8 | `src/app/page.tsx` | 홈 — 트래픽·첫인상 최대 |
| 9 | `next.config.ts` | 빌드 정책·이미지 도메인·한계 설정 |
| 10 | `supabase/migrations/*.sql` | RLS·스키마 — **배포와 보안의 근본** |

---

## 10. 자체 검토 — 이 문서만으로 구조 이해 가능한가?

**가능에 가깝지만**, 외부 개발자가 운영하려면 아래를 **추가로 확보**하는 것이 좋습니다.

1. **실제 Supabase 프로젝트**에서 `public` vs `app_public` 스키마 존재 여부, `pages` 테이블 유무, RLS 최종본.
2. **배포 플랫폼** (Vercel 여부, 환경 변수 목록, 커스텀 도메인).
3. **콘텐츠 담당자 워크플로** — 어떤 관리 화면을 주로 쓰는지(통합 vs 전용).
4. **반드시 유지할 URL/콘텐츠** (SEO, 인쇄물 QR, 외부 링크).

위 1번이 특히 `sitemap.ts`와 `003` 마이그레이션 해석을 확정하는 데 필요합니다.

---

## 부록: 클라이언트에 확인하면 로드맵이 좋아지는 질문 (참고)

프롬프트에 포함된 제안 그대로, 기획 단계에서 답을 얻으면 우선순위 산정에 유리합니다.

- **꼭 유지해야 할 기능/데이터** (기존 게시물, 특정 부서 URL 등)
- **기간·우선순위** (예: 특정 행사 전 메인만, 특정 부서부터)

---

*본 문서는 저장소 정적 분석에 기반합니다. 프로덕션 동작은 환경 변수·Supabase 콘솔 설정·실데이터에 따라 달라질 수 있습니다.*
