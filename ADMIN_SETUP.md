# 관리자 로그인 설정 가이드

## 📋 필수 작업

### 1. Supabase SDK 설치

```bash
npm install @supabase/supabase-js
```

### 2. .env.local 파일 설정

프로젝트 루트에 `.env.local` 파일이 있는지 확인하고, 다음 내용을 추가/수정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Supabase 대시보드에서 확인:**
1. https://app.supabase.com 접속
2. 프로젝트 선택
3. Settings > API 메뉴
4. Project URL과 anon public key 복사

---

## 🗄️ Supabase 데이터베이스 설정

### 1. 사용자 메타데이터에 역할(role) 추가

Supabase SQL Editor에서 다음 쿼리 실행:

```sql
-- 관리자 사용자 생성 예시 (Supabase Auth에서 먼저 사용자 생성 필요)
-- Authentication > Users에서 Add User로 이메일/비밀번호 생성

-- 그 후 해당 사용자의 메타데이터에 역할 추가
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

**역할 종류:**
- `admin`: 모든 권한 (사용자 관리, 설정 포함)
- `editor`: 콘텐츠 편집 권한만
- `viewer`: 읽기 전용 (로그인 불가)

### 2. 테스트 관리자 계정 만들기

1. **Supabase 대시보드** → Authentication → Users
2. **Add User** 버튼 클릭
3. 이메일: `admin@test.com`
4. 비밀번호: `TestPassword123!`
5. **Create User**

6. **SQL Editor**에서 역할 부여:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@test.com';
```

---

## 🚀 사용 방법

### 로그인 페이지 접속
```
http://localhost:3000/admin/login
```

### 테스트 계정 로그인
- 이메일: `admin@test.com`
- 비밀번호: `TestPassword123!`

### 로그인 후 이동
로그인 성공 시 자동으로 `/admin/dashboard`로 리다이렉트됩니다.

---

## 📁 생성된 파일들

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts          # Supabase 클라이언트 설정
│       └── auth.ts            # 인증 유틸리티 함수
│
└── app/
    └── admin/
        ├── login/
        │   └── page.tsx       # 로그인 페이지
        └── dashboard/
            └── page.tsx       # 관리자 대시보드
```

---

## 🔒 보안 규칙

### Row Level Security (RLS) 설정 예시

나중에 콘텐츠 테이블을 만들 때 다음과 같이 RLS를 설정하세요:

```sql
-- 예: notices 테이블
CREATE TABLE public.notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- admin, editor만 작성 가능
CREATE POLICY "Admin and Editor can insert"
ON public.notices
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor')
);

-- 모든 사용자 읽기 가능
CREATE POLICY "Anyone can read"
ON public.notices
FOR SELECT
TO anon, authenticated
USING (true);
```

---

## ⚠️ 주의사항

1. **프로덕션 환경**에서는 절대 테스트 계정을 사용하지 마세요.
2. **.env.local** 파일은 Git에 커밋하지 마세요 (.gitignore에 이미 포함됨).
3. **SUPABASE_SERVICE_ROLE_KEY**는 서버사이드에서만 사용하세요 (현재는 미사용).

---

## 🐛 트러블슈팅

### "Invalid login credentials" 오류
- 이메일/비밀번호가 정확한지 확인
- Supabase에서 사용자가 생성되었는지 확인

### "관리자 권한이 없습니다" 오류
- SQL로 user_metadata에 role이 제대로 설정되었는지 확인:
```sql
SELECT email, raw_user_meta_data->'role' as role
FROM auth.users
WHERE email = 'your-email@example.com';
```

### "Supabase URL과 Anon Key가 설정되어 있지 않습니다" 오류
- .env.local 파일 확인
- 개발 서버 재시작 (`npm run dev` 중단 후 다시 실행)

---

## 📞 문의

설정에 문제가 있으면 담당자에게 연락해주세요.

