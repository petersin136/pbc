# 📸 Google Drive Gallery Import Script

Google Drive 폴더에서 이미지를 자동으로 가져와 Supabase `gallery_photos` 테이블에 삽입하는 스크립트입니다.

## 🔧 사전 준비

### 1. Google Drive API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. **APIs & Services > Credentials** 이동
4. **+ CREATE CREDENTIALS > API key** 클릭
5. API 키 복사
6. **API Library**에서 **Google Drive API** 활성화

### 2. 환경 변수 설정

`.env.local` 파일에 다음 내용 추가:

```env
GOOGLE_DRIVE_API_KEY=YOUR_GOOGLE_DRIVE_API_KEY_HERE
```

### 3. Google Drive 폴더 공개 설정

1. Google Drive에서 이미지가 있는 폴더 우클릭
2. **공유** 클릭
3. **일반 액세스**를 **"링크가 있는 모든 사용자"**로 변경
4. 폴더 URL에서 Folder ID 복사
   - 예: `https://drive.google.com/drive/folders/1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO`
   - Folder ID: `1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO`

## 🚀 사용 방법

### 기본 사용법

```bash
npx tsx scripts/import-drive-folder.ts <folder_id> <event_id>
```

### 예시

```bash
# 폴더 ID: 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO
# Event ID: 4 (gallery_events 테이블의 ID)
npx tsx scripts/import-drive-folder.ts 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO 4
```

## 📊 실행 결과

성공 시 다음과 같은 메시지가 출력됩니다:

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
   1. image1.jpg
   2. image2.png
   3. image3.jpg
   ...
```

## 🔍 지원 파일 형식

- **JPEG** (`.jpg`, `.jpeg`)
- **PNG** (`.png`)

## ⚠️ 주의사항

1. **중복 삽입**: 같은 폴더를 여러 번 실행하면 중복 데이터가 삽입됩니다.
2. **Event ID 확인**: `gallery_events` 테이블에 해당 Event ID가 존재해야 합니다.
3. **파일 개수 제한**: 한 번에 최대 1000개의 파일까지 처리 가능합니다.
4. **공개 권한**: 폴더가 공개되어 있지 않으면 파일을 가져올 수 없습니다.

## 🐛 문제 해결

### "GOOGLE_DRIVE_API_KEY not found" 오류

`.env.local` 파일에 API 키를 추가했는지 확인하세요.

### "No image files found" 메시지

1. 폴더 ID가 올바른지 확인
2. 폴더가 공개되어 있는지 확인
3. Google Drive API가 활성화되어 있는지 확인

### "Error fetching files from Google Drive" 오류

1. API 키가 유효한지 확인
2. Google Drive API가 활성화되어 있는지 확인
3. 폴더 ID가 올바른지 확인

## 📝 데이터베이스 스키마

스크립트는 다음과 같은 형태로 데이터를 삽입합니다:

```sql
INSERT INTO gallery_photos (event_id, file_url, file_name)
VALUES (
  4,
  'https://drive.google.com/file/d/${file_id}/preview',
  'image1.jpg'
);
```

## 🎯 워크플로우

1. Google Drive에 이미지 업로드
2. 폴더 공개 설정
3. Supabase에 Event 생성 (`gallery_events` 테이블)
4. 스크립트 실행하여 이미지 자동 import
5. 갤러리 페이지에서 확인

---

Made with ❤️ for 포천중앙침례교회

