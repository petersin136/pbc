-- ⚡ 긴급! Supabase Dashboard > SQL Editor에서 이 SQL을 복사해서 실행하세요!
-- 시편 113:3으로 변경

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
WHERE id = '7705b897-955f-41e4-af55-92233fb05395';

-- 결과 확인
SELECT 
    content->>'verse' as "한글 구절",
    content->>'verseEn' as "영문 구절",
    content->>'verseReference' as "출처",
    updated_at as "업데이트 시각"
FROM sections
WHERE id = '7705b897-955f-41e4-af55-92233fb05395';











