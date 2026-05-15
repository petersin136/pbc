# Phase 0 — 안전망 작업 보고서

**실행일:** 2026-05-15  
**범위:** 디자인·기능·DB 마이그레이션·`next.config` ignore 플래그 변경 없음

---

## **Supabase 대시보드에서 키 로테이션 필요**

**Yes.** 이전 커밋에 `src/lib/supabase/client.ts`에 **anon JWT가 하드코딩 폴백으로 포함**되어 있었고, 공개 Git 기록에 노출된 적이 있다면 해당 키는 유효한 상태로 남아 있을 수 있습니다. 본 Phase에서 소스 폴백은 제거했으나, **보안상 Supabase 대시보드에서 anon 키(및 필요 시 URL 관련 설정) 로테이션을 권장**합니다. (자동 로테이션은 수행하지 않음.)

---

## 변경 파일 목록 및 diff 요약

| 파일 | 요약 |
|------|------|
| `src/lib/supabase/client.ts` | 하드코딩 URL·anon 키 폴백 제거. `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 미설정 시 `throw new Error(...)` 로 즉시 실패. 디버그용 `console.log` 제거. |
| `src/middleware.ts` | **신규.** `@supabase/ssr`의 `createServerClient`로 쿠키 기반 세션 조회. `/admin/login` 제외한 `/admin`, `/admin/:path*` 에서 `getUser()` 결과 없으면 `/admin/login`으로 307 리다이렉트. 공개 env 미설정 시 미들웨어는 Supabase 호출 없이 `next()` 통과(클라이언트에서 기존처럼 `client.ts`가 에러). |
| `package.json` | `dependencies`에 `@supabase/ssr` 추가. 스크립트 `typecheck` (`tsc --noEmit`), `lint:strict` (`eslint .`) 추가. |
| `package-lock.json` | `@supabase/ssr` 설치에 따른 lock 갱신. |
| `.env.example` | **신규.** 변수 키만 나열(값 없음): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. |
| `.gitignore` | `.env*` 아래에 `!.env.example` 추가해 예시 파일이 커밋 가능하도록 함. `.env.local`, `.env*.local` 명시(기존 `.env*`와 중복이나 문서·이중 확인용). |
| `src/components/sections/WelcomeSection.tsx` | `"use client"` 직후 `// @deprecated: SectionRenderer에 미연결. Phase 1에서 정리 예정.` 한 줄 추가. |
| `src/components/sections/CardsSection.tsx` | 동일 deprecated 주석 추가. |
| `src/components/sections/VideoSection.tsx` | 동일 deprecated 주석 추가. |
| `src/app/welcome/` | 빈 디렉터리였음 → **삭제**(파일 없음). Git에 추적된 항목이 없었다면 `git status`에는 안 나올 수 있음. |

**의도적으로 Phase 0 범위 밖인 변경은 되돌림:** 이전 세션에서 수정된 `HeroSection.tsx`(개발 시 히어로 영상 비활성화)는 본 Phase 요구사항에 없어 **원복**함.

---

## 키 로테이션 필요 여부

| 항목 | 값 |
|------|-----|
| **로테이션 권장** | **Yes** |
| **근거** | 저장소 내 `client.ts`에 anon JWT 문자열이 폴백으로 존재했음(Phase 0에서 제거). Git 히스토리에 남아 있으면 노출로 간주. |

---

## `npm run typecheck` / `npm run lint:strict` 수치

| 명령 | 결과 |
|------|------|
| `npm run typecheck` (`tsc --noEmit`) | **181개** `error TS` (exit code 2) |
| `npm run lint:strict` (`eslint .`) | **17개** error, **53개** warning (요약: `✖ 70 problems (17 errors, 53 warnings)`, exit code 1) |

### 타입 에러 상위 20개 (파일:라인 요약)

1. `src/app/admin/sections/page.tsx(629,15)` — TS2322 `unknown` → `ReactNode`
2. `src/app/admin/sections/page.tsx(657,15)` — TS2322
3. `src/app/admin/sections/page.tsx(881,15)` — TS2322
4. `src/app/admin/sections/page.tsx(995,15)` — TS2322
5. `src/app/admin/sections/page.tsx(1054,15)` — TS2322
6. `src/app/admin/sections/page.tsx(1193,15)` — TS2322
7. `src/app/admin/sections/page.tsx(1265,15)` — TS2322
8. `src/app/admin/sections/page.tsx(1319,15)` — TS2322
9. `src/app/admin/sections/page.tsx(1494,15)` — TS2322
10. `src/app/admin/sections/page.tsx(1667,15)` — TS2322
11. `src/app/admin/sections/page.tsx(1808,11)` — TS2322
12. `src/components/sections/DepartmentSection.tsx(58,11)` — TS2322
13. `src/components/sections/DepartmentSection.tsx(63,13)` — TS2322
14. `src/components/sections/DepartmentSection.tsx(65,17)` — TS2322 `{}` → `ReactNode`
15. `src/components/sections/DepartmentSection.tsx(70,11)` — TS2322
16. `src/components/sections/DepartmentSection.tsx(71,11)` — TS2322
17. `src/components/sections/DepartmentSection.tsx(75,19)` — TS2322 `{}` → `string | StaticImport`
18. `src/components/sections/DepartmentSection.tsx(76,19)` — TS2322 `unknown` → `string`
19. `src/components/sections/DepartmentSection.tsx(85,33)` — TS2339 `length` on `{}`
20. `src/components/sections/DepartmentSection.tsx(102,33)` — TS2339 `map` on `{}`

(나머지 161개는 주로 `section.content`의 `unknown`/`Record`와 섹션별 props 불일치 등 동일 계열.)

### ESLint error(17개) 파일·규칙 요약 (상위·전부 나열)

| 파일 | 규칙(요지) |
|------|------------|
| `fix_verse_now.js`, `force_update.js`, `get_id_and_update.js` | `@typescript-eslint/no-require-imports` |
| `src/app/admin/gallery/page.tsx` | `react/no-unescaped-entities` |
| `src/app/not-found.tsx` | `@next/next/no-html-link-for-pages` |
| `src/components/sections/CommunitySection.tsx` | `react/no-unescaped-entities` |
| `src/components/sections/FiveKMovementSection.tsx` | `react/no-unescaped-entities` |

(루트 `*.js` 스크립트 3개가 error의 상당 부분을 차지함.)

---

## 미들웨어 동작 확인 방법 (수동)

1. `.env.example`을 참고해 `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정.
2. `npm run dev` 실행.
3. **비로그인·시크릿 창** 또는 `curl -I` 로 확인:
   - `GET /` → **200** (또는 RSC 환경에 맞는 정상 응답).
   - `GET /admin/login` → **200**, 로그인 폼 표시.
   - `GET /admin/dashboard` → **307** `Location: /admin/login` (또는 브라우저에서 로그인 페이지로 이동).
4. 로그인 후 `/admin/dashboard` 접속 시 → 미들웨어는 세션 있음으로 통과, 기존 `admin/layout.tsx`에서 역할 검사.

**본 작업에서 수행한 자동 검증:** 로컬에 `.env.local`이 있는 상태로 `npm run dev` 실행 후 `curl -sI` 로 확인함.

| 경로 | 결과 |
|------|------|
| `/` | `HTTP/1.1 200 OK` |
| `/admin/login` | `HTTP/1.1 200 OK` |
| `/admin/dashboard` (쿠키 없음) | `HTTP/1.1 307 Temporary Redirect`, `location: /admin/login` |

참고: 당시 포트 **3000이 다른 프로세스 사용 중**이어서 dev 서버는 **3001**에서 기동되었으며, 위 `curl`은 `http://localhost:3001` 기준임.

---

## Phase 1 전 사용자 체크리스트

- [ ] Supabase에서 **anon 키 로테이션**(및 필요 시 관련 키 정리) 여부 결정 후 적용.
- [ ] 배포 환경(Vercel 등)에 **`NEXT_PUBLIC_SUPABASE_URL`**, **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** 설정되어 있는지 확인(미설정 시 앱이 `client.ts`에서 즉시 throw).
- [ ] **`.env.local`은 커밋하지 않음** — `.gitignore`에 `!.env.example`으로 예시만 추적 가능함을 확인.
- [ ] `SUPABASE_SERVICE_ROLE_KEY`는 아직 코드에서 사용하지 않을 수 있으나, **서버 전용**으로만 보관할 것(클라이언트 번들·`NEXT_PUBLIC_*`에 넣지 말 것).
- [ ] 관리자 흐름: 비로그인 → `/admin/*` (login 제외) 리다이렉트, 로그인 → 대시보드, **viewer** 계정은 기존대로 레이아웃에서 차단되는지 샘플로 확인.
- [ ] `npm run typecheck` / `npm run lint:strict` 수치를 기준선으로 삼아, Phase 1에서 `ignoreBuildErrors` 해제를 목표로 할 때 우선순위 정하기.

---

## 기타

- `next.config.ts`의 `typescript.ignoreBuildErrors` / `eslint.ignoreDuringBuilds`는 **변경하지 않음**(요청대로).
- `PROJECT_AUDIT.md`는 이전 단계 산출물로, 본 Phase에서 필수 변경 아님.
