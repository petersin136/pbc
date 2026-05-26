-- ================================================================
-- 예배시간, 공지사항, 기도제목 관리 테이블 (Clean 버전)
-- ================================================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- 포천중앙침례교회(pbc) 새 Supabase 프로젝트 초기 세팅용
--
-- content-tables.sql 과의 차이:
--   - worship_times 초기 데이터(13개)는 유지 (포천교회도 동일하게 사용 예정)
--   - notices, prayer_requests 더미 데이터는 제거 (부천교회 시절 데이터였음)
-- ================================================================

-- ================================================================
-- 1. WORSHIP TIMES (예배시간)
-- ================================================================
CREATE TABLE IF NOT EXISTS worship_times (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_time VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(20),
    category VARCHAR(30) DEFAULT '정기 예배',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기존 테이블에 category 컬럼이 없다면 추가 (마이그레이션용)
ALTER TABLE worship_times ADD COLUMN IF NOT EXISTS category VARCHAR(30) DEFAULT '정기 예배';

-- 초기 데이터 (포천중앙침례교회 예배 시간)
INSERT INTO worship_times (service_name, service_time, day_of_week, category, display_order) VALUES
-- 정기 예배
('새벽기도회',   '오전 5:00',  '매일',   '정기 예배',   1),
('주일아침예배', '오전 7:00',  '주일',   '정기 예배',   2),
('주일 낮 예배', '오전 10:30', '주일',   '정기 예배',   3),
('새가족 모임',  '오후 12:50', '주일',   '정기 예배',   4),
('주일오후 예배', '오후 7:30',  '주일',   '정기 예배',   5),
('수요일 예배',  '오후 7:30',  '수요일', '정기 예배',   6),
('금요기도회',   '오후 7:30',  '금요일', '정기 예배',   7),
('중보기도회',   '오후 8:00',  '매일',   '정기 예배',   8),
-- 부서별 예배
('유치부',       '오전 10:30', '주일',   '부서별 예배', 9),
('초등부',       '오후 2:30',  '주일',   '부서별 예배', 10),
('중·고등부',    '오후 2:30',  '주일',   '부서별 예배', 11),
('1청년부',      '오후 5:00',  '토요일', '부서별 예배', 12),
('2청년부',      '오후 2:00',  '주일',   '부서별 예배', 13)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 2. NOTICES (공지사항)
-- ================================================================
-- 더미 데이터 없음: admin 페이지에서 직접 등록하세요
CREATE TABLE IF NOT EXISTS notices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200),
    content TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 3. PRAYER REQUESTS (기도제목)
-- ================================================================
-- 더미 데이터 없음: admin 페이지에서 직접 등록하세요
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200),
    content TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
