# 섹션 관리 시스템 설정 가이드

## 📋 개요

`/admin/sections` 페이지는 웹사이트의 각 페이지별 섹션을 관리하는 시스템입니다.

## 🗄️ Supabase 테이블 생성

### 1. Supabase SQL Editor로 이동

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `czbffjnslwauemngpayh`
3. 좌측 메뉴: **SQL Editor** 클릭

### 2. SQL 실행

프로젝트 폴더의 `supabase/migrations/001_create_sections_table.sql` 파일 내용을 복사하여 실행하세요.

또는 아래 SQL을 직접 실행:

```sql
-- Sections 테이블 생성
-- app_public 스키마가 없으면 생성
CREATE SCHEMA IF NOT EXISTS app_public;

CREATE TABLE IF NOT EXISTS app_public.sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  section_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sections_page ON app_public.sections(page);
CREATE INDEX IF NOT EXISTS idx_sections_order ON app_public.sections(page, section_order);

-- RLS 활성화
ALTER TABLE app_public.sections ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Anyone can read sections"
ON app_public.sections FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin and Editor can insert sections"
ON app_public.sections FOR INSERT TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor'));

CREATE POLICY "Admin and Editor can update sections"
ON app_public.sections FOR UPDATE TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor'));

CREATE POLICY "Admin and Editor can delete sections"
ON app_public.sections FOR DELETE TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor'));

-- 트리거 생성
CREATE OR REPLACE FUNCTION app_public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON app_public.sections
FOR EACH ROW EXECUTE FUNCTION app_public.update_updated_at_column();

-- 샘플 데이터
INSERT INTO app_public.sections (page, kind, title, content, section_order) VALUES
('home', 'hero', '메인 히어로', '{"heading": "포천중앙침례교회", "subheading": "하나님의 사랑과 은혜가 가득한 곳", "backgroundImage": "/images/hero-bg.jpg"}'::jsonb, 1),
('home', 'welcome', '환영 메시지', '{"title": "환영합니다", "description": "포천중앙침례교회는 하나님의 말씀을 따라 살아가며, 서로 사랑하고 돌보는 공동체입니다."}'::jsonb, 2),
('about', 'pastor', '담임목사', '{"name": "목사님 성함", "title": "담임목사", "description": "목사님 소개", "image": "/images/pastor.jpg"}'::jsonb, 1);
```

### 3. 테이블 확인

SQL Editor에서 다음 쿼리로 테이블이 잘 생성되었는지 확인:

```sql
SELECT * FROM app_public.sections ORDER BY page, section_order;
```

---

## 🚀 사용 방법

### 1. 관리자 대시보드 접속

```
http://localhost:3000/admin/dashboard
```

"섹션 관리 (NEW)" 카드를 클릭하여 `/admin/sections`로 이동합니다.

### 2. 페이지 선택

드롭다운에서 관리하고 싶은 페이지를 선택:
- 홈 (home)
- 교회소개 (about)
- 말씀 (word)
- 교육 (education)
- 양육 (nurture)
- 선교 (mission)
- 목장 (lifegroup)
- 교회소식 (news)
- 갤러리 (gallery)

### 3. 섹션 추가

1. **"섹션 추가"** 버튼 클릭
2. 섹션 타입 선택:
   - Hero 배너
   - 환영 메시지
   - 주요 기능/서비스
   - 카드 그리드
   - 간증/후기
   - 갤러리
   - 교역자/스태프
   - 예배 시간
   - 연락처/오시는 길
   - 텍스트 콘텐츠
   - 커스텀
3. 섹션 제목 입력
4. **"추가"** 버튼 클릭

### 4. 섹션 내용 수정

1. 섹션 카드의 **연필 아이콘** 클릭
2. JSON 에디터에서 content 수정
3. **"저장"** 버튼 클릭

#### Content JSON 예시

**Hero 섹션:**
```json
{
  "heading": "포천중앙침례교회",
  "subheading": "하나님의 사랑과 은혜가 가득한 곳",
  "backgroundImage": "/images/hero-bg.jpg",
  "buttons": [
    {"text": "교회 소개", "href": "/about"},
    {"text": "말씀 보기", "href": "/word/sermons"}
  ]
}
```

**카드 그리드:**
```json
{
  "title": "교회 안내",
  "cards": [
    {
      "icon": "book",
      "title": "말씀",
      "description": "주일 설교와 말씀 기고",
      "link": "/word/sermons"
    },
    {
      "icon": "graduation-cap",
      "title": "교육",
      "description": "주일학교와 성경공부",
      "link": "/education/sunday-school"
    }
  ]
}
```

### 5. 섹션 순서 변경

**방법 1: 위/아래 버튼**
- ▲ 버튼: 위로 이동
- ▼ 버튼: 아래로 이동

**방법 2: 순서 번호 입력**
- 순서 입력란에 숫자 입력 (예: 1, 2, 3)
- Enter 키 또는 다른 곳 클릭하면 자동 저장

### 6. 섹션 삭제

1. 섹션 카드의 **휴지통 아이콘** 클릭
2. 확인 메시지에서 **"확인"** 클릭

---

## 📊 테이블 구조

### sections 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 고유 식별자 (자동 생성) |
| page | TEXT | 페이지 (home, about 등) |
| kind | TEXT | 섹션 타입 (hero, cards 등) |
| title | TEXT | 섹션 제목 |
| content | JSONB | 섹션 내용 (JSON 형식) |
| section_order | INTEGER | 표시 순서 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |
| created_by | UUID | 생성자 (사용자 ID) |

---

## 🔒 권한 관리

### RLS (Row Level Security) 정책

1. **읽기**: 모든 사용자 (anon, authenticated)
2. **추가/수정/삭제**: admin 또는 editor 역할만 가능

### 역할 확인

SQL Editor에서 사용자 역할 확인:

```sql
SELECT email, raw_user_meta_data->'role' as role
FROM auth.users
WHERE email = 'your-email@example.com';
```

---

## 🐛 트러블슈팅

### "Failed to fetch" 오류
- Supabase 테이블이 생성되었는지 확인
- RLS 정책이 제대로 설정되었는지 확인

### "관리자 권한이 필요합니다" 오류
- 사용자의 role이 admin 또는 editor인지 확인
- SQL로 role 설정:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';
```

### 섹션이 표시되지 않음
- 페이지 드롭다운에서 올바른 페이지를 선택했는지 확인
- SQL로 데이터 확인:
```sql
SELECT * FROM app_public.sections WHERE page = 'home';
```

---

## 📝 다음 단계

1. **프론트엔드 컴포넌트 생성**: sections 데이터를 실제 페이지에 표시할 컴포넌트 만들기
2. **섹션 렌더러**: kind에 따라 다른 UI로 렌더링하는 시스템 구축
3. **이미지 업로드**: content에서 사용할 이미지를 Supabase Storage에 업로드하는 기능
4. **미리보기**: 섹션 수정 전에 미리보기 기능

---

## 📞 문의

설정이나 사용 중 문제가 있으면 개발자에게 연락해주세요.

