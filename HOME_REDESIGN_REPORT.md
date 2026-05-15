# 홈 리뉴얼 보고서 (Quiet Light)

## 1. 백업 및 롤백

- **백업 파일:** `src/app/page.legacy.tsx`  
  상단 주석: `// @legacy: 2026-05-15 리뉴얼 전 백업본. 롤백 필요 시 이 파일을 page.tsx로 복원.`  
  Next.js는 `page.tsx`만 라우트로 인식하므로 `page.legacy.tsx`는 라우트에 노출되지 않습니다.

- **롤백 명령:**

```bash
cp src/app/page.legacy.tsx src/app/page.tsx
```

## 2. 이미지 자산 경로

| 용도 | 경로 | 비고 |
|------|------|------|
| Hero (구름/일출) | `https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/air1.jpg` | 기존 `GreetingSection` 등과 동일 출처(`air1.jpg`). `src/app/home-page-config.ts`의 `HOME_HERO_IMAGE_URL` |
| 교회 전경(도시) | `https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1920&auto=format&fit=crop&q=80` | 기존 `QuickLinksSection` 계열과 동일 Unsplash 계열. `HOME_CITY_IMAGE_URL` |
| 푸터 로고 | `https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/pbclo-Photoroom.png` | `HOME_LOGO_URL` |

**Placeholder:** 없음. 위 URL이 모두 실제 자산(원격)입니다.

## 3. 디자인 토큰 위치

- **`src/app/globals.css`** 의 `:root`에 Quiet Light 변수 추가:  
  `--bg`, `--bg-elevated`, `--ink`, `--ink-muted`, `--line`, `--accent`, `--accent-soft`  
- 히어로 스크롤 라인 애니메이션: 동일 파일의 `@keyframes home-scroll-line` 및 `.home-scroll-line`  
- **`tailwind.config.ts`**: 색 매핑 추가 없음. 페이지에서 `bg-[var(--bg)]` 등으로 직접 참조.

## 4. 새로 설치·사용한 패키지

- **`lucide-react`** (`package.json` 의존성): 퀵링크·푸터·플레이 등 아이콘에 사용.  
- **`framer-motion`**: 기존 프로젝트 의존성; 홈 `page.tsx`에서 섹션·히어로 모션에 사용.

## 5. 헤더(`src/components/header/Header.tsx`)와의 조화 (1–5)

**점수: 4 / 5**

- 고정 헤더가 `bg-black/30 backdrop-blur-sm text-white`로 히어로 위에 얹히는 구조는 새 히어로(어두운 하단 그라데이션·흰 타이포)와 **톤이 맞습니다.**  
- 같은 페이지에서 헤더 로고/교회명과 히어로 한글 타이틀이 **중복**되어 보일 수 있으나, 이는 이전 레이아웃과도 유사한 패턴입니다.  
- `Navigation`에 `scrolled={false}`가 고정이라 스크롤 후 배경 전환 등은 없음(기존 동작 유지).

## 6. 다음 작업 후보 (3가지)

1. **헤더 리뉴얼** — 스크롤 시 `var(--bg-elevated)` / `var(--ink)` 기반의 라이트 바로 전환해 본문 Quiet Light와 일체화.  
2. **청년부 등 서브 페이지**에 동일 토큰·타이포·카드 패턴 확장.  
3. **디자인 토큰을 정식 디자인 시스템으로 추출** — `theme.extend` 또는 CSS 레이어 문서화, 다크 모드 후속 대비.

## 7. 빌드·렌더 확인

- **`npm run build`**: 성공(exit 0). `/` 정적 프리렌더 포함, **프리렌더 단계에서 `/` 관련 오류 없음.**  
- **브라우저에서 `/` 수동 스크린샷·콘솔 확인**은 이 환경에서 수행하지 않았습니다. 로컬에서 `npm run dev` 후 개발자 도구 콘솔로 한 번 더 확인하는 것을 권장합니다.

### 부록: SNS 아이콘

`lucide-react` v1.16에는 **`Youtube` / `Instagram` 브랜드 아이콘이 없어** 빌드 오류가 났습니다. 푸터에는 **`CirclePlay`(YouTube 링크)** 와 **`Camera`(Instagram 링크)** 를 사용했으며, `aria-label`로 채널 의미를 보완했습니다. 실제 공식 채널 URL이 정해지면 `href`만 교체하면 됩니다.
