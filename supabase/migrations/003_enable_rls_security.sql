-- 003_enable_rls_security.sql
-- RLS(Row Level Security) 활성화 및 정책 추가

-- ============================================
-- 1. app_public.sections 테이블 RLS 활성화
-- ============================================
ALTER TABLE app_public.sections ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. public 스키마 갤러리 테이블들 RLS 활성화
-- ============================================

-- gallery_categories: 모든 사용자가 읽을 수 있음
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_categories_read_all"
ON public.gallery_categories
FOR SELECT
USING (true);

CREATE POLICY "gallery_categories_write_admin"
ON public.gallery_categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
  )
);

-- gallery_events: 모든 사용자가 읽을 수 있음
ALTER TABLE public.gallery_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_events_read_all"
ON public.gallery_events
FOR SELECT
USING (true);

CREATE POLICY "gallery_events_write_admin"
ON public.gallery_events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
  )
);

-- gallery_photos: 모든 사용자가 읽을 수 있음
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_photos_read_all"
ON public.gallery_photos
FOR SELECT
USING (true);

CREATE POLICY "gallery_photos_write_admin"
ON public.gallery_photos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
  )
);

-- ============================================
-- 3. public.sections 테이블 RLS 활성화
-- ============================================

-- sections: 모든 사용자가 읽을 수 있음
CREATE POLICY "sections_read_all"
ON public.sections
FOR SELECT
USING (true);

-- sections: 인증된 사용자만 쓰기 가능
CREATE POLICY "sections_write_admin"
ON public.sections
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
  )
);

-- ============================================
-- 4. app_public 스키마의 다른 테이블들도 RLS 활성화
-- ============================================

-- users 테이블
ALTER TABLE app_public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own"
ON app_public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "users_write_own"
ON app_public.users
FOR UPDATE
USING (auth.uid() = id);

-- pages 테이블 (모든 사용자 읽기 가능)
ALTER TABLE app_public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pages_read_all"
ON app_public.pages
FOR SELECT
USING (true);

CREATE POLICY "pages_write_admin"
ON app_public.pages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
  )
);

-- departments 테이블 (모든 사용자 읽기 가능)
ALTER TABLE app_public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departments_read_all"
ON app_public.departments
FOR SELECT
USING (true);

-- settings 테이블 (모든 사용자 읽기 가능)
ALTER TABLE app_public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_read_all"
ON app_public.settings
FOR SELECT
USING (true);

-- media 테이블 (공개된 미디어만 읽기 가능)
ALTER TABLE app_public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_read_public"
ON app_public.media
FOR SELECT
USING (is_public = true);

-- posts 테이블 (발행된 게시물만 읽기 가능)
ALTER TABLE app_public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_read_published"
ON app_public.posts
FOR SELECT
USING (is_published = true);

-- sermons 테이블 (발행된 설교만 읽기 가능)
ALTER TABLE app_public.sermons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sermons_read_published"
ON app_public.sermons
FOR SELECT
USING (is_published = true);

-- events 테이블 (발행된 이벤트만 읽기 가능)
ALTER TABLE app_public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_read_published"
ON app_public.events
FOR SELECT
USING (is_published = true);

-- albums 테이블 (활성 앨범만 읽기 가능)
ALTER TABLE app_public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "albums_read_active"
ON app_public.albums
FOR SELECT
USING (is_active = true);

-- app_public.gallery_photos (보이는 사진만 읽기 가능)
ALTER TABLE app_public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_gallery_photos_read_visible"
ON app_public.gallery_photos
FOR SELECT
USING (is_visible = true);

-- gallery_comments (삭제되지 않고 숨겨지지 않은 댓글만 읽기 가능)
ALTER TABLE app_public.gallery_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_comments_read_visible"
ON app_public.gallery_comments
FOR SELECT
USING (is_deleted = false AND is_hidden = false);

