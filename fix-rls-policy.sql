-- ================================================================
-- RLS 정책 수정 (관리자 페이지에서 데이터 읽기/쓰기 가능하도록)
-- ================================================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- ================================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read worship_times" ON worship_times;
DROP POLICY IF EXISTS "Public read notices" ON notices;
DROP POLICY IF EXISTS "Public read prayer_requests" ON prayer_requests;
DROP POLICY IF EXISTS "Admin write worship_times" ON worship_times;
DROP POLICY IF EXISTS "Admin write notices" ON notices;
DROP POLICY IF EXISTS "Admin write prayer_requests" ON prayer_requests;

-- 새로운 정책 생성: 모든 사용자가 읽기/쓰기 가능
CREATE POLICY "Public read worship_times" ON worship_times FOR SELECT USING (true);
CREATE POLICY "Public read notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read prayer_requests" ON prayer_requests FOR SELECT USING (true);

CREATE POLICY "Public write worship_times" ON worship_times FOR ALL USING (true);
CREATE POLICY "Public write notices" ON notices FOR ALL USING (true);
CREATE POLICY "Public write prayer_requests" ON prayer_requests FOR ALL USING (true);

-- ================================================================
-- 완료!
-- ================================================================





















