-- /about 페이지에 히어로 섹션 추가
-- Supabase SQL Editor에서 실행하세요

INSERT INTO public.sections (page, kind, title, content, section_order)
VALUES (
  'about',
  'hero',
  '교회 소개',
  '{
    "heading": "교회 소개",
    "subheading": "포천중앙침례교회를 소개합니다",
    "backgroundImage": "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/4.jpg"
  }'::jsonb,
  0
);

-- 확인
SELECT id, page, kind, title, content->'backgroundImage' as background_image
FROM public.sections
WHERE page = 'about' AND kind = 'hero';
