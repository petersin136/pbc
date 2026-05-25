-- ================================================================
-- 부천교회 Supabase 데이터베이스 초기 설정 스크립트
-- ================================================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- ================================================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. SITE SETTINGS (사이트 기본 설정)
-- ================================================================
CREATE TABLE site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    church_name VARCHAR(100) DEFAULT '부천교회',
    pastor_name VARCHAR(50) DEFAULT '이영호',
    phone VARCHAR(20),
    address TEXT,
    email VARCHAR(100),
    kakao_link VARCHAR(255),
    youtube_link VARCHAR(255),
    instagram_link VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO site_settings (church_name, pastor_name, phone, address, email) VALUES
('부천교회', '이영호', '032-XXX-XXXX', '경기도 부천시', 'contact@bucheonchurch.kr');

-- ================================================================
-- 2. HERO SECTION (히어로 섹션)
-- ================================================================
CREATE TABLE hero_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    main_title VARCHAR(100) DEFAULT '믿음의 여정',
    sub_text TEXT,
    background_image VARCHAR(500),
    thumbnail_image VARCHAR(500),
    button_text VARCHAR(50) DEFAULT '방문 예약',
    button_link VARCHAR(255),
    location_label VARCHAR(50) DEFAULT '경기도 부천',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO hero_section (main_title, sub_text, background_image, thumbnail_image, location_label, description) VALUES
('믿음의 여정', '부천교회에서 함께 예배드립니다', 
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=200&q=80',
 '경기도 부천',
 '믿음, 소망, 사랑으로 함께 성장하며 하나님의 은혜를 나누는 공동체입니다.');

-- ================================================================
-- 3. ABOUT SECTION (소개 섹션)
-- ================================================================
CREATE TABLE about_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_label VARCHAR(50) DEFAULT '교회 소개',
    main_text TEXT,
    sub_text TEXT,
    link_text VARCHAR(50) DEFAULT '예배 안내',
    link_url VARCHAR(255),
    pastor_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO about_section (main_text, sub_text, pastor_image) VALUES
('우리는 성도들에게 믿음의 확신과 영적 성장을 위한 명확한 방향을 제시합니다. 성경적 가르침과 실천적 적용을 통해 삶을 변화시킵니다.',
 '처음 오신 분이든, 신앙의 다음 단계로 나아가고자 하는 분이든, 우리는 여러분의 영적 여정의 모든 단계에서 함께합니다.',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop');

-- ================================================================
-- 4. LARGE STATEMENTS (대형 문구 섹션들)
-- ================================================================
CREATE TABLE large_statements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_key VARCHAR(50) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO large_statements (section_key, content, display_order) VALUES
('intro', '우리는 복음 안에서 하나 되어 서로를 세워가며, 지역 사회에 그리스도의 사랑을 전하는 교회입니다.', 1),
('quote', '너희는 세상의 빛이라<br>산 위에 있는 동네가 숨겨지지 못할 것이요', 2),
('sky_text', '우리는 복음의 진리 안에서 하나님의 사랑을 실천합니다', 3);

-- ================================================================
-- 5. SERVICE CARDS (예배 카드 - 가로 스크롤)
-- ================================================================
CREATE TABLE service_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    card_number VARCHAR(2) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    background_color VARCHAR(7) DEFAULT '#FF6B6B',
    layout_type VARCHAR(20) DEFAULT 'left',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO service_cards (card_number, title, description, image_url, background_color, layout_type, display_order) VALUES
('01', '주일예배', 
 '하나님 말씀을 중심으로 한 예배를 통해 영적 성장의 기초를 다집니다. 성경적 가르침과 현실적 적용으로 신앙의 깊이를 더합니다.',
 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
 '#FF6B6B', 'left', 1),
('02', '수요예배',
 '주중의 영적 충전을 위한 예배입니다. 깊은 말씀 묵상과 기도로 한 주를 새롭게 준비합니다.',
 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
 '#FFB800', 'right', 2),
('03', '새벽기도',
 '하루를 하나님께 먼저 드리는 시간입니다. 새벽의 고요함 속에서 주님과 깊이 교제합니다.',
 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
 '#87CEEB', 'left', 3);

-- ================================================================
-- 6. TESTIMONIAL CARDS (간증 카드 - 스택)
-- ================================================================
CREATE TABLE testimonial_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    initial_letter VARCHAR(1) NOT NULL,
    quote TEXT NOT NULL,
    author_name VARCHAR(50) NOT NULL,
    author_title VARCHAR(100),
    author_image VARCHAR(500),
    background_color VARCHAR(7) DEFAULT '#FFB800',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO testimonial_cards (initial_letter, quote, author_name, author_title, author_image, background_color, display_order) VALUES
('G', '전문적이고, 신뢰할 수 있으며, 이해하기 쉬운 가르침 — 이영호 목사님께서 제게 주신 말씀은 제 삶을 계획하는 데 필요한 명확함을 주었습니다.',
 '김성훈', '청년부 리더', 
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
 '#FFB800', 1),
('M', '명확하고 실천적인 가르침이 정말 큰 도움이 되었습니다. 제가 받은 양육은 제가 확신을 갖고 앞으로 나아갈 수 있게 해주었습니다.',
 '박미영', '여전도회 회장',
 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
 '#FF6B6B', 2),
('S', '솔직하고 지지적입니다. 함께 일하면서 믿음을 실천 가능한 계획으로 바꿀 수 있었고, 제가 신뢰할 수 있었습니다.',
 '이준호', '집사',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
 '#87CEEB', 3);

-- ================================================================
-- 7. PROGRAM CARDS (프로그램 카드)
-- ================================================================
CREATE TABLE program_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    duration_label VARCHAR(20) DEFAULT '과정',
    button_text VARCHAR(50) DEFAULT '자세히 보기',
    button_link VARCHAR(255),
    features TEXT[],
    is_recommended BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO program_cards (title, description, duration, features, is_recommended, display_order) VALUES
('새가족 환영', '처음 오신 분들을 위한 교회 소개와 신앙의 기초를 다지는 시간입니다.', '4주',
 ARRAY['교회 소개', '기초 신앙 교육', '소그룹 배정'],
 false, 1),
('제자훈련', '깊이 있는 성경 공부와 실천적 적용을 통해 성숙한 신앙인으로 성장합니다.', '12주',
 ARRAY['심화 성경 공부', '멘토링 프로그램', '사역 참여 기회'],
 true, 2),
('사역자 훈련', '하나님의 부르심에 응답하여 사역자로 세워지는 전문 과정입니다.', '6개월',
 ARRAY['리더십 훈련', '신학 교육', '사역 실습'],
 false, 3);

-- ================================================================
-- 8. STATS ITEMS (통계 숫자)
-- ================================================================
CREATE TABLE stats_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    value VARCHAR(20) NOT NULL,
    description VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO stats_items (label, value, description, display_order) VALUES
('설립 연도', '1985', '48년간 지역사회와 함께 성장해왔습니다', 1),
('등록 성도', '850+', '믿음 안에서 든든한 관계를 맺고 있습니다', 2),
('소그룹', '42', '다양한 분야에서 성공적인 결실을 맺습니다', 3);

-- ================================================================
-- 9. FEATURES SECTION (특징 섹션)
-- ================================================================
CREATE TABLE features_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE features_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    size_type VARCHAR(20) DEFAULT 'large',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO features_section (title, description, display_order) VALUES
('더 빠른 결정, 더 확실한 성장', '복잡한 신앙의 질문들을 명확한 실천으로 바꿉니다. 여러분의 믿음을 확신 있게 세워나가는 데 도움이 되는 실천적 통찰력을 제공합니다.', 1),
('흔들리지 않는 신앙', '실시간으로 목표를 향해 나아가는 과정을 점검합니다. 모든 성도가 한 방향으로 정렬되어 목적을 갖고 성장하도록 돕습니다.', 2),
('위기 전에 찾는 기회', '영적 변화의 신호를 미리 감지합니다. 위기를 기회로 바꾸며, 앞서 나아갑니다.', 3);

INSERT INTO features_images (image_url, alt_text, size_type, display_order) VALUES
('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', '특징 이미지 1', 'large', 1),
('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', '특징 이미지 2', 'large', 2),
('https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&q=80', '특징 이미지 3', 'wide', 3);

-- ================================================================
-- 10. WEEKLY BULLETINS (주보)
-- ================================================================
CREATE TABLE weekly_bulletins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    bulletin_date DATE NOT NULL,
    pdf_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    content TEXT,
    download_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 11. SERMON VIDEOS (설교 영상)
-- ================================================================
CREATE TABLE sermon_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    preacher VARCHAR(50) DEFAULT '이영호 목사',
    sermon_date DATE NOT NULL,
    youtube_url VARCHAR(255),
    youtube_id VARCHAR(20),
    bible_verse VARCHAR(100),
    description TEXT,
    view_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 12. BOARD POSTS (게시판 글)
-- ================================================================
CREATE TABLE board_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(50) DEFAULT '자유게시판',
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    view_count INT DEFAULT 0,
    is_notice BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 13. BOARD COMMENTS (게시판 댓글)
-- ================================================================
CREATE TABLE board_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES board_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 14. VISITOR REGISTRATIONS (새가족 등록)
-- ================================================================
CREATE TABLE visitor_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    visit_date DATE,
    message TEXT,
    is_contacted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 15. ADMIN USERS (관리자 계정)
-- ================================================================
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- ================================================================
-- 16. MEDIA LIBRARY (미디어 라이브러리)
-- ================================================================
CREATE TABLE media_library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    width INT,
    height INT,
    uploaded_by UUID REFERENCES admin_users(id),
    folder VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) 설정
-- ================================================================

-- 모든 테이블 RLS 활성화
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE large_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE features_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE features_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- 읽기: 누구나 가능 (is_active = true인 것만)
CREATE POLICY "Public read access" ON hero_section FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON about_section FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON large_statements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON service_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON testimonial_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON program_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON stats_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON features_section FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON features_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON weekly_bulletins FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON sermon_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);

-- 게시판: 누구나 읽기/쓰기 가능
CREATE POLICY "Public read posts" ON board_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert posts" ON board_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read comments" ON board_comments FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert comments" ON board_comments FOR INSERT WITH CHECK (true);

-- 새가족 등록: 누구나 쓰기 가능
CREATE POLICY "Public insert visitors" ON visitor_registrations FOR INSERT WITH CHECK (true);

-- 관리자 전용: 인증된 사용자만 수정 가능
CREATE POLICY "Admin write access" ON hero_section FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON about_section FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON service_cards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON testimonial_cards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON program_cards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON stats_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON weekly_bulletins FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON sermon_videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read visitors" ON visitor_registrations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write media" ON media_library FOR ALL USING (auth.role() = 'authenticated');

-- ================================================================
-- 인덱스 생성 (성능 최적화)
-- ================================================================
CREATE INDEX idx_service_cards_order ON service_cards(display_order);
CREATE INDEX idx_testimonial_cards_order ON testimonial_cards(display_order);
CREATE INDEX idx_program_cards_order ON program_cards(display_order);
CREATE INDEX idx_board_posts_created ON board_posts(created_at DESC);
CREATE INDEX idx_board_comments_post ON board_comments(post_id);
CREATE INDEX idx_bulletins_date ON weekly_bulletins(bulletin_date DESC);
CREATE INDEX idx_sermons_date ON sermon_videos(sermon_date DESC);

-- ================================================================
-- 완료!
-- ================================================================
-- 이제 Supabase 대시보드에서:
-- 1. Storage 버킷 생성 (images, bulletins, uploads)
-- 2. Authentication 설정 (Email/Password 활성화)
-- 3. API Keys 확인
-- ================================================================










