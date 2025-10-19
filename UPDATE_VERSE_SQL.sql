-- 시편 113:3으로 변경하는 SQL
-- Supabase 대시보드 > SQL Editor에서 실행하세요

UPDATE sections
SET content = jsonb_set(
  jsonb_set(
    jsonb_set(
      content,
      '{verse}',
      '"해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다"'
    ),
    '{verseEn}',
    '"From the rising of the sun to its setting, the name of the LORD is to be praised."'
  ),
  '{verseReference}',
  '"시편 113:3"'
)
WHERE page = 'home' AND kind = 'hero';

-- 결과 확인
SELECT 
  page,
  kind,
  content->>'verse' as verse_korean,
  content->>'verseEn' as verse_english,
  content->>'verseReference' as reference
FROM sections
WHERE page = 'home' AND kind = 'hero';


