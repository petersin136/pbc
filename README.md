# 포천중앙침례교회 홈페이지 시스템 (Pocheon Central Baptist Church)

Next.js 없이 순수 HTML + Tailwind + Supabase로 구현된 교회 홈페이지

## 🎯 완성된 기능

### ✅ 메인 홈페이지 (index.html)
- 티커 애니메이션
- 히어로 섹션 (전체 화면)
- **가로 스크롤 예배 카드** (400vh)
- **스택 카드 간증** (500vh)
- 통계 섹션
- 프로그램 카드
- 부드러운 애니메이션

### ✅ Supabase 백엔드
- 완전한 데이터베이스 스키마
- Row Level Security (RLS) 설정
- API 함수 모음 (supabase-config.js)

### ✅ 관리자 시스템
- 로그인 페이지
- 대시보드
- 각 섹션 편집 (예정)

---

## 📦 설치 순서

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 가입 및 새 프로젝트 생성
2. 프로젝트 이름: `pocheon-central-baptist-church` (또는 `pcbc`)
3. 비밀번호 설정 (안전하게 보관!)
4. 리전 선택: `Northeast Asia (Seoul)`

### 2. 데이터베이스 설정

1. Supabase 대시보드 → **SQL Editor**
2. `supabase-setup.sql` 파일 내용 전체 복사
3. **New query** → 붙여넣기 → **Run** 실행
4. 성공 메시지 확인

### 3. Storage 버킷 생성

Supabase 대시보드 → **Storage** → **New bucket**

#### 버킷 1: `images`
- 이름: `images`
- Public bucket: ✅
- Allowed MIME types: `image/*`
- File size limit: 5MB

#### 버킷 2: `bulletins`
- 이름: `bulletins`
- Public bucket: ✅
- Allowed MIME types: `application/pdf`
- File size limit: 10MB

#### 버킷 3: `uploads`
- 이름: `uploads`
- Public bucket: ✅
- File size limit: 20MB

### 4. Authentication 설정

Supabase 대시보드 → **Authentication** → **Providers**

1. **Email** 활성화
2. **Confirm email** → 비활성화 (테스트용)

### 5. 관리자 계정 생성

Supabase 대시보드 → **Authentication** → **Users** → **Add user**

- Email: `admin@pocheoncentralbaptist.kr` (원하는 이메일)
- Password: 안전한 비밀번호
- Auto Confirm User: ✅

### 6. API 키 설정

1. Supabase 대시보드 → **Settings** → **API**
2. 다음 값들 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJxxx...` (공개 키)

3. 다음 파일들을 수정:

#### `js/supabase-config.js`
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // 여기에 붙여넣기
const SUPABASE_ANON_KEY = 'eyJxxx...';  // 여기에 붙여넣기
```

#### `admin/login.html`
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // 여기에 붙여넣기
const SUPABASE_ANON_KEY = 'eyJxxx...';  // 여기에 붙여넣기
```

#### `admin/index.html`
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // 여기에 붙여넣기
const SUPABASE_ANON_KEY = 'eyJxxx...';  // 여기에 붙여넣기
```

---

## 🚀 로컬 실행

### 방법 1: PHP 내장 서버 (현재 실행 중)
```bash
php -S localhost:3000
```

### 방법 2: Python 서버
```bash
python3 -m http.server 8000
```

### 방법 3: npx serve
```bash
npx serve -l 3000
```

---

## 📂 파일 구조

```
pocheon-central-baptist-church/
├── index.html              # ✅ 메인 홈페이지 (완성)
├── supabase-setup.sql      # ✅ 데이터베이스 스키마 (완성)
├── js/
│   └── supabase-config.js  # ✅ Supabase 설정 (완성)
├── admin/
│   ├── login.html          # ✅ 관리자 로그인 (완성)
│   ├── index.html          # ✅ 대시보드 (완성)
│   ├── hero.html           # 🔜 히어로 편집 (예정)
│   ├── about.html          # 🔜 소개 편집 (예정)
│   ├── services.html       # 🔜 예배 카드 편집 (예정)
│   ├── testimonials.html   # 🔜 간증 카드 편집 (예정)
│   ├── programs.html       # 🔜 프로그램 편집 (예정)
│   ├── stats.html          # 🔜 통계 편집 (예정)
│   ├── weekly.html         # 🔜 주보 관리 (예정)
│   └── settings.html       # 🔜 기본 설정 (예정)
└── board/
    ├── index.html          # 🔜 게시판 목록 (예정)
    ├── write.html          # 🔜 글쓰기 (예정)
    └── view.html           # 🔜 글 상세 (예정)
```

---

## 🔐 보안 설정

### 환경변수 (선택사항)
프로덕션 배포 시 API 키를 환경변수로 관리:

Vercel 배포 시:
1. Vercel Dashboard → Settings → Environment Variables
2. `SUPABASE_URL` 추가
3. `SUPABASE_ANON_KEY` 추가

---

## 📊 데이터베이스 테이블

| 테이블명 | 설명 | RLS |
|---------|------|-----|
| `site_settings` | 사이트 기본 설정 | 읽기: 공개 |
| `hero_section` | 히어로 섹션 | 읽기: 공개 |
| `about_section` | 소개 섹션 | 읽기: 공개 |
| `large_statements` | 대형 문구들 | 읽기: 공개 |
| `service_cards` | 예배 카드 (3개) | 읽기: 공개 |
| `testimonial_cards` | 간증 카드 (3개) | 읽기: 공개 |
| `program_cards` | 프로그램 카드 | 읽기: 공개 |
| `stats_items` | 통계 숫자 | 읽기: 공개 |
| `features_section` | 특징 섹션 | 읽기: 공개 |
| `weekly_bulletins` | 주보 | 읽기: 공개 |
| `board_posts` | 게시판 글 | 읽기/쓰기: 공개 |
| `board_comments` | 댓글 | 읽기/쓰기: 공개 |
| `visitor_registrations` | 새가족 등록 | 쓰기: 공개 |
| `admin_users` | 관리자 | 인증 필요 |
| `media_library` | 미디어 | 인증 필요 |

---

## 🎨 다음 구현할 기능

### Phase 1 (현재)
- [x] 메인 홈페이지 UI
- [x] Supabase 데이터베이스 설계
- [x] 관리자 로그인
- [x] 관리자 대시보드

### Phase 2 (다음)
- [ ] 메인 페이지 Supabase 연동
- [ ] 각 섹션 동적 렌더링
- [ ] 관리자 편집 페이지들
- [ ] 이미지 업로드 + 자동 압축

### Phase 3
- [ ] 주보 관리 시스템
- [ ] 게시판 (CRUD)
- [ ] 새가족 등록 폼
- [ ] 이메일 알림

### Phase 4
- [ ] 설교 영상 관리
- [ ] 검색 기능
- [ ] SEO 최적화
- [ ] Vercel 배포

---

## 🌐 배포 (Vercel)

### 1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pocheon-central-baptist-church.git
git push -u origin main
```

### 2. Vercel 배포
1. [Vercel](https://vercel.com) 가입
2. **New Project** → GitHub 저장소 선택
3. **Deploy** 클릭
4. 완료!

### 3. 커스텀 도메인 (선택)
Vercel Dashboard → Settings → Domains → Add Domain

---

## 💡 팁

### 로컬 테스트
- 메인 페이지: `http://localhost:3000`
- 관리자: `http://localhost:3000/admin/login.html`

### Supabase 대시보드
- Table Editor에서 데이터 직접 수정 가능
- SQL Editor에서 쿼리 실행 가능
- Storage에서 업로드된 파일 확인

### 디버깅
브라우저 콘솔(F12)에서:
```javascript
// Supabase 연결 확인
window.PocheonChurchAPI.supabase

// 데이터 가져오기 테스트
window.PocheonChurchAPI.fetchHeroSection()
```

---

## 📞 문의

문제가 있으신가요? GitHub Issues 또는 이메일로 문의주세요!

---

## 📝 라이센스

MIT License - 자유롭게 사용하세요!

---

**다음 단계: 메인 페이지를 Supabase와 연동하여 동적으로 만들기!**





























