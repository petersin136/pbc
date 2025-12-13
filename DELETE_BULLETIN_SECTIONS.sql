-- 주보 페이지 관련 섹션 데이터 완전 삭제
-- 이 SQL은 news-bulletin 페이지의 모든 섹션을 삭제합니다.

-- 1. 먼저 삭제될 데이터 확인
SELECT 
  id,
  page,
  kind,
  title,
  section_order,
  created_at
FROM sections
WHERE page = 'news-bulletin'
ORDER BY section_order;

-- 2. 주보 페이지의 모든 섹션 삭제
DELETE FROM sections
WHERE page = 'news-bulletin';

-- 3. 삭제 확인 (결과가 없어야 함)
SELECT COUNT(*) as remaining_bulletin_sections
FROM sections
WHERE page = 'news-bulletin';



