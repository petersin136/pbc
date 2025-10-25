-- /about 페이지의 모든 섹션 확인
-- Supabase SQL Editor에서 실행하세요

SELECT id, page, kind, title, section_order, content
FROM public.sections
WHERE page = 'about'
ORDER BY section_order;

-- 히어로 섹션이 있는지 확인
SELECT id, page, kind, title, content->'backgroundImage' as background_image
FROM public.sections
WHERE page = 'about' AND kind = 'hero';
