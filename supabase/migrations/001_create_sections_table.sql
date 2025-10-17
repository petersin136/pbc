-- Sections 테이블 생성
-- 각 페이지별로 섹션을 관리하는 테이블

CREATE TABLE IF NOT EXISTS public.sections (
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
CREATE INDEX IF NOT EXISTS idx_sections_page ON public.sections(page);
CREATE INDEX IF NOT EXISTS idx_sections_order ON public.sections(page, section_order);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기 가능
CREATE POLICY "Anyone can read sections"
ON public.sections
FOR SELECT
TO anon, authenticated
USING (true);

-- Admin과 Editor만 섹션 추가 가능
CREATE POLICY "Admin and Editor can insert sections"
ON public.sections
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor')
);

-- Admin과 Editor만 섹션 수정 가능
CREATE POLICY "Admin and Editor can update sections"
ON public.sections
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor')
);

-- Admin과 Editor만 섹션 삭제 가능
CREATE POLICY "Admin and Editor can delete sections"
ON public.sections
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'editor')
);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON public.sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 (선택사항)
INSERT INTO public.sections (page, kind, title, content, section_order) VALUES
('home', 'hero', '메인 히어로', '{"heading": "포천중앙침례교회", "subheading": "하나님의 사랑과 은혜가 가득한 곳", "backgroundImage": "/images/hero-bg.jpg"}'::jsonb, 1),
('home', 'welcome', '환영 메시지', '{"title": "환영합니다", "description": "포천중앙침례교회는 하나님의 말씀을 따라 살아가며, 서로 사랑하고 돌보는 공동체입니다."}'::jsonb, 2),
('about', 'pastor', '담임목사', '{"name": "목사님 성함", "title": "담임목사", "description": "목사님 소개", "image": "/images/pastor.jpg"}'::jsonb, 1);

