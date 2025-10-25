-- 현재 /about 페이지 히어로 섹션 상태 확인
-- Supabase SQL Editor에서 실행하세요

SELECT 
  id, 
  page, 
  kind, 
  title,
  section_order,
  content->'backgroundImage' as background_image,
  content->'backgroundVideo' as background_video,
  content
FROM public.sections
WHERE page = 'about' AND kind = 'hero'
ORDER BY section_order;
