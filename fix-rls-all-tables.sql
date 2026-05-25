-- ================================================================
-- 모든 테이블 RLS 정책 수정 (401 오류 해결)
-- ================================================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- ================================================================

-- ================================================================
-- 1. WORSHIP_TIMES, NOTICES, PRAYER_REQUESTS
-- ================================================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read worship_times" ON worship_times;
DROP POLICY IF EXISTS "Public read notices" ON notices;
DROP POLICY IF EXISTS "Public read prayer_requests" ON prayer_requests;
DROP POLICY IF EXISTS "Public write worship_times" ON worship_times;
DROP POLICY IF EXISTS "Public write notices" ON notices;
DROP POLICY IF EXISTS "Public write prayer_requests" ON prayer_requests;
DROP POLICY IF EXISTS "Admin write worship_times" ON worship_times;
DROP POLICY IF EXISTS "Admin write notices" ON notices;
DROP POLICY IF EXISTS "Admin write prayer_requests" ON prayer_requests;

-- 새로운 정책: 모든 사용자가 읽기/쓰기 가능
CREATE POLICY "Public read worship_times" ON worship_times FOR SELECT USING (true);
CREATE POLICY "Public read notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read prayer_requests" ON prayer_requests FOR SELECT USING (true);

CREATE POLICY "Public write worship_times" ON worship_times FOR ALL USING (true);
CREATE POLICY "Public write notices" ON notices FOR ALL USING (true);
CREATE POLICY "Public write prayer_requests" ON prayer_requests FOR ALL USING (true);

-- ================================================================
-- 2. 다른 테이블들도 공개 읽기 허용 (is_active = true인 것만)
-- ================================================================

-- HERO_SECTION
DROP POLICY IF EXISTS "Public read access" ON hero_section;
CREATE POLICY "Public read access" ON hero_section FOR SELECT USING (is_active = true);

-- LARGE_STATEMENTS
DROP POLICY IF EXISTS "Public read access" ON large_statements;
CREATE POLICY "Public read access" ON large_statements FOR SELECT USING (is_active = true);

-- SERVICE_CARDS
DROP POLICY IF EXISTS "Public read access" ON service_cards;
CREATE POLICY "Public read access" ON service_cards FOR SELECT USING (is_active = true);

-- TESTIMONIAL_CARDS
DROP POLICY IF EXISTS "Public read access" ON testimonial_cards;
CREATE POLICY "Public read access" ON testimonial_cards FOR SELECT USING (is_active = true);

-- PROGRAM_CARDS
DROP POLICY IF EXISTS "Public read access" ON program_cards;
CREATE POLICY "Public read access" ON program_cards FOR SELECT USING (is_active = true);

-- STATS_ITEMS
DROP POLICY IF EXISTS "Public read access" ON stats_items;
CREATE POLICY "Public read access" ON stats_items FOR SELECT USING (is_active = true);

-- ================================================================
-- 완료!
-- ================================================================
-- 이제 메인 페이지에서 모든 데이터를 읽을 수 있습니다.
-- ================================================================





















