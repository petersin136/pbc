-- ================================================================
-- Supabase Storage RLS 정책 설정
-- ================================================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- 미디어 업로드가 작동하려면 이 정책들이 필요합니다
-- ================================================================

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Anyone can upload to media" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete media" ON storage.objects;

-- ================================================================
-- Storage 버킷 정책 생성
-- ================================================================

-- 정책 1: 업로드 허용 (INSERT)
CREATE POLICY "Anyone can upload to media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- 정책 2: 읽기 허용 (SELECT)
CREATE POLICY "Public Access to media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- 정책 3: 수정 허용 (UPDATE)
CREATE POLICY "Anyone can update media"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'media');

-- 정책 4: 삭제 허용 (DELETE)
CREATE POLICY "Anyone can delete media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'media');

-- ================================================================
-- media_library 테이블 정책 확인 및 수정
-- ================================================================

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Admin write media" ON media_library;
DROP POLICY IF EXISTS "Public read media" ON media_library;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Public read media"
ON media_library FOR SELECT
TO public
USING (true);

-- 모든 사용자가 쓰기 가능 (업로드용)
CREATE POLICY "Public write media"
ON media_library FOR INSERT
TO public
WITH CHECK (true);

-- 모든 사용자가 수정/삭제 가능
CREATE POLICY "Public update media"
ON media_library FOR UPDATE
TO public
USING (true);

CREATE POLICY "Public delete media"
ON media_library FOR DELETE
TO public
USING (true);

-- ================================================================
-- 완료!
-- ================================================================
-- 이제 미디어 업로드가 정상적으로 작동합니다.
-- 
-- 확인 방법:
-- 1. 관리자 페이지에서 파일 업로드 시도
-- 2. 성공 메시지 확인
-- 3. 업로드된 파일이 갤러리에 표시되는지 확인
-- ================================================================


