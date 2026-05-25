-- ================================================================
-- 예배시간, 공지사항, 기도제목 관리 테이블
-- ================================================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- ================================================================

-- ================================================================
-- 1. WORSHIP TIMES (예배시간)
-- ================================================================
CREATE TABLE IF NOT EXISTS worship_times (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_time VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(20),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO worship_times (service_name, service_time, day_of_week, display_order) VALUES
('주 일 예 배', '오전 11시', '일요일', 1),
('수 요 예 배', '오후 8시', '수요일', 2),
('금 요 예 배', '오후 9시', '금요일', 3),
('학생부예배', '오후 2시', '토요일', 4),
('유치부예배', '오전 11시', '일요일', 5)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 2. NOTICES (공지사항)
-- ================================================================
CREATE TABLE IF NOT EXISTS notices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200),
    content TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO notices (title, content, display_order) VALUES
('연말 휴가 안내', 
'12월 25일 부터 29일 까지
연말 휴가로 잠시 쉬어가려 합니다.
해당 날짜에 모든 업무가 중단되오니
이용에 참고 부탁 드립니다.
예약 문의는 DM으로 부탁드립니다.', 1),
('새해 예배 안내', 
'새해 예배 안내
새해를 맞이하여 특별 예배를 드립니다.
많은 참석 부탁드립니다.', 2),
('교회 행사 안내', 
'교회 행사 안내
다가오는 교회 행사에 대한 안내입니다.
자세한 내용은 교회 게시판을 확인해 주세요.', 3)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 3. PRAYER REQUESTS (기도제목)
-- ================================================================
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200),
    content TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO prayer_requests (title, content, display_order) VALUES
('교회를 위한 기도', 
'교회를 위한 기도
교회가 하나님의 뜻을 따라
섬기는 공동체가 되도록
기도해 주세요.', 1),
('성도들을 위한 기도', 
'성도들을 위한 기도
모든 성도들이 하나님의
사랑 안에서 성장하도록
기도해 주세요.', 2),
('선교를 위한 기도', 
'선교를 위한 기도
전 세계 복음 전파를 위한
기도에 함께해 주세요.', 3),
('사회를 위한 기도', 
'사회를 위한 기도
우리 사회가 하나님의
평화와 정의로 가득하도록
기도해 주세요.', 4)
ON CONFLICT DO NOTHING;

-- ================================================================
-- ROW LEVEL SECURITY (RLS) 설정
-- ================================================================

-- RLS 활성화
ALTER TABLE worship_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- 읽기: 누구나 가능 (모든 데이터, 관리자 페이지에서도 읽을 수 있도록)
CREATE POLICY "Public read worship_times" ON worship_times FOR SELECT USING (true);
CREATE POLICY "Public read notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read prayer_requests" ON prayer_requests FOR SELECT USING (true);

-- 쓰기: 누구나 가능 (관리자 페이지에서 인증 없이도 수정 가능하도록)
CREATE POLICY "Public write worship_times" ON worship_times FOR ALL USING (true);
CREATE POLICY "Public write notices" ON notices FOR ALL USING (true);
CREATE POLICY "Public write prayer_requests" ON prayer_requests FOR ALL USING (true);

-- ================================================================
-- 인덱스 생성 (성능 최적화)
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_worship_times_order ON worship_times(display_order);
CREATE INDEX IF NOT EXISTS idx_notices_order ON notices(display_order);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_order ON prayer_requests(display_order);

-- ================================================================
-- 완료!
-- ================================================================





















