-- 메인 페이지 Hero 섹션의 버튼 링크 수정
-- "교회 소개" 버튼 → /about (교회안내)
-- "오시는 길" 버튼 → /about/location (오시는 길)

UPDATE sections
SET content = jsonb_set(
  jsonb_set(
    content,
    '{buttons,0,href}',
    '"/about"'
  ),
  '{buttons,1,href}',
  '"/about/location"'
)
WHERE page = 'home' 
  AND kind = 'hero'
  AND content->'buttons' IS NOT NULL;

-- 확인
SELECT 
  id, 
  page, 
  kind,
  content->'buttons' as buttons
FROM sections 
WHERE page = 'home' AND kind = 'hero';





