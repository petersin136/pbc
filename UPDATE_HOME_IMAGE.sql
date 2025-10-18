-- 홈페이지 info-cards 섹션의 이미지 업데이트
-- Supabase SQL Editor에서 실행하세요

UPDATE public.sections
SET content = jsonb_set(
  content,
  '{images}',
  '[
    {
      "url": "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/KakaoTalk_Photo_2025-10-18-13-12-42.jpeg",
      "alt": "교회 이미지"
    }
  ]'::jsonb
)
WHERE page = 'home' AND kind = 'info-cards';

-- 확인
SELECT id, page, kind, title, content->'images' as images
FROM public.sections
WHERE page = 'home' AND kind = 'info-cards';

