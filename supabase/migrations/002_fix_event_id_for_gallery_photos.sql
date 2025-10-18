-- ============================================
-- 갤러리 사진 이벤트 연결 수정
-- ============================================
-- 목적: gallery_photos의 event_id를 올바른 이벤트와 연결
-- 작성일: 2025-10-18
-- ============================================

-- "2025 교회행사" 이벤트의 ID 확인
DO $$
DECLARE
  target_event_id INTEGER;
BEGIN
  -- "2025 교회행사" 이벤트 ID 가져오기
  SELECT id INTO target_event_id
  FROM gallery_events
  WHERE title LIKE '%2025%' AND title LIKE '%교회행사%'
  LIMIT 1;
  
  -- 이벤트가 있으면 사진들을 해당 이벤트로 연결
  IF target_event_id IS NOT NULL THEN
    UPDATE gallery_photos
    SET event_id = target_event_id
    WHERE event_id != target_event_id;
    
    RAISE NOTICE '✅ 사진들이 이벤트 ID: %로 연결되었습니다.', target_event_id;
  ELSE
    RAISE NOTICE '⚠️ "2025 교회행사" 이벤트를 찾을 수 없습니다.';
  END IF;
END $$;

-- 결과 확인
SELECT 
  ge.id AS event_id,
  ge.title AS event_title,
  COUNT(gp.id) AS photo_count
FROM gallery_events ge
LEFT JOIN gallery_photos gp ON ge.id = gp.event_id
GROUP BY ge.id, ge.title
ORDER BY ge.id;

