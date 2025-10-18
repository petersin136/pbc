-- 갤러리 카테고리 테이블 (부서)
CREATE TABLE IF NOT EXISTS gallery_categories (
  id SERIAL PRIMARY KEY,
  name_kr TEXT NOT NULL,
  name_en TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 갤러리 이벤트 테이블 (행사/앨범)
CREATE TABLE IF NOT EXISTS gallery_events (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES gallery_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  cover_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 갤러리 사진 테이블
CREATE TABLE IF NOT EXISTS gallery_photos (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES gallery_events(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 기본 카테고리 데이터 입력
INSERT INTO gallery_categories (name_kr, name_en, description) VALUES
  ('장년부', 'adults', '장년부 활동 및 행사'),
  ('청년부', 'youth', '청년부 활동 및 행사'),
  ('중고등부', 'students', '중고등부 활동 및 행사'),
  ('주일학교', 'children', '주일학교 활동 및 행사'),
  ('유치부', 'preschool', '유치부 활동 및 행사')
ON CONFLICT (name_en) DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_gallery_events_category ON gallery_events(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_events_date ON gallery_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_event ON gallery_photos(event_id);

