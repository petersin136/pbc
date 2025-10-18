# 🎯 사용 예시

## 1. 기본 사용법

```bash
# 방법 1: npx tsx 직접 사용
npx tsx scripts/import-drive-folder.ts <folder_id> <event_id>

# 방법 2: npm script 사용 (더 간편)
npm run import:gallery <folder_id> <event_id>
```

## 2. 실전 예시

### 예시 1: 2025년 교회행사 사진 임포트

```bash
# Event ID 2번 이벤트에 사진 60장 추가
npm run import:gallery 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO 2
```

### 예시 2: 장년부 모임 사진 임포트

```bash
# Event ID 4번 이벤트에 사진 추가
npm run import:gallery 1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456 4
```

## 3. 단계별 워크플로우

### Step 1: Supabase에서 Event 먼저 생성

```sql
-- gallery_events 테이블에 새 이벤트 생성
INSERT INTO gallery_events (category_id, title, date, description, cover_url)
VALUES (
  1,  -- 장년부 카테고리 ID
  '2025 교회행사',
  '2025-01-15',
  '2025년 첫 교회 행사',
  'https://drive.google.com/file/d/1ABC.../preview'  -- 대표 이미지
);

-- 생성된 event_id 확인 (예: 4)
SELECT id, title FROM gallery_events ORDER BY id DESC LIMIT 1;
```

### Step 2: Google Drive에서 Folder ID 가져오기

1. Google Drive에서 사진 폴더 열기
2. URL 확인:
   ```
   https://drive.google.com/drive/folders/1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO
   ```
3. Folder ID 복사: `1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO`

### Step 3: 폴더 공개 설정

1. 폴더 우클릭 → **공유**
2. **일반 액세스** → **"링크가 있는 모든 사용자"**로 변경
3. 저장

### Step 4: 스크립트 실행

```bash
npm run import:gallery 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO 4
```

### Step 5: 갤러리 페이지에서 확인

```
http://localhost:3000/gallery/event/4
```

## 4. 출력 예시

```
🚀 Starting Google Drive to Supabase import...
📁 Folder ID: 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO
🎫 Event ID: 4

🔍 Fetching files from folder: 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO
✅ Found 60 image files
📥 Inserting 60 photos into Supabase...

✅ Import completed successfully!
📊 Total photos imported: 60

📋 Summary:
   1. IMG_001.jpg
   2. IMG_002.jpg
   3. IMG_003.png
   ... (중략)
   60. IMG_060.jpg
```

## 5. 여러 폴더를 한 번에 임포트

```bash
# 장년부 사진 (Event 4)
npm run import:gallery 1ABC... 4

# 청년부 사진 (Event 5)
npm run import:gallery 2DEF... 5

# 중고등부 사진 (Event 6)
npm run import:gallery 3GHI... 6
```

## 6. 트러블슈팅

### Q: "GOOGLE_DRIVE_API_KEY not found" 에러

**A:** `.env.local` 파일에 API 키 추가 필요

```env
GOOGLE_DRIVE_API_KEY=AIzaSyD...
```

### Q: "No image files found" 메시지

**A:** 다음을 확인하세요:
1. Folder ID가 올바른지 확인
2. 폴더가 **"링크가 있는 모든 사용자"**로 공개되어 있는지 확인
3. 폴더에 jpg/png 이미지가 있는지 확인

### Q: 중복 데이터가 삽입됨

**A:** 같은 폴더를 여러 번 실행하면 중복됩니다. 
해결 방법:
1. Supabase에서 해당 event_id의 photos 삭제 후 재실행
   ```sql
   DELETE FROM gallery_photos WHERE event_id = 4;
   ```
2. 다시 스크립트 실행

---

🎉 이제 Google Drive에서 갤러리 사진을 자동으로 가져올 수 있습니다!

