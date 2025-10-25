-- /about 페이지 히어로 섹션의 배경 비디오를 이미지로 변경
-- Supabase SQL Editor에서 실행하세요

-- 1단계: 배경 비디오 제거하고 이미지로 변경
UPDATE public.sections
SET content = content - 'backgroundVideo' || 
  jsonb_build_object('backgroundImage', 'https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/4.jpg')
WHERE page = 'about' AND kind = 'hero';

-- 확인
SELECT id, page, kind, title, 
  content->'backgroundVideo' as background_video,
  content->'backgroundImage' as background_image
FROM public.sections
WHERE page = 'about' AND kind = 'hero';
