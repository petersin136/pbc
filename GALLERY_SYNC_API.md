# 📸 갤러리 자동 동기화 API

Google Drive 폴더의 이미지를 Supabase gallery_photos 테이블에 자동으로 갱신하는 API 엔드포인트입니다.

---

## 🔧 설정

### 1. 환경변수 설정 (`.env.local`)

```env
# Google API Key (필수)
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key

# 기본 폴더 ID (선택사항)
NEXT_PUBLIC_DRIVE_FOLDER_ID=your_default_folder_id

# 기본 이벤트 ID (선택사항, 기본값: 2)
NEXT_PUBLIC_DRIVE_EVENT_ID=2

# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🚀 사용 방법

### **방법 1: 환경변수 사용 (권장)**

환경변수에 `NEXT_PUBLIC_DRIVE_FOLDER_ID`와 `NEXT_PUBLIC_DRIVE_EVENT_ID`를 설정하면 간단하게 호출:

```bash
curl http://localhost:3000/api/gallery-sync
```

```javascript
fetch('/api/gallery-sync')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### **방법 2: 쿼리 파라미터 사용**

동적으로 폴더 ID와 이벤트 ID를 지정:

```bash
curl "http://localhost:3000/api/gallery-sync?folder_id=1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO&event_id=2"
```

```javascript
fetch('/api/gallery-sync?folder_id=1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO&event_id=2')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### **방법 3: POST 메서드 (Body로 전달)**

```bash
curl -X POST http://localhost:3000/api/gallery-sync \
  -H "Content-Type: application/json" \
  -d '{"folder_id": "1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO", "event_id": "2"}'
```

```javascript
fetch('/api/gallery-sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    folder_id: '1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO',
    event_id: '2'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 📦 응답 형식

### **성공 응답 (200)**

```json
{
  "success": true,
  "message": "✅ 갤러리 업데이트 완료!",
  "count": 60,
  "folderId": "1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO",
  "eventId": "2",
  "photos": [
    {
      "id": 123,
      "fileName": "교회행사_01.jpg",
      "fileUrl": "https://drive.google.com/thumbnail?id=FILE_ID&sz=w400"
    }
  ]
}
```

### **오류 응답 (400/500)**

```json
{
  "error": "❌ folder_id가 필요합니다. 쿼리 파라미터 또는 환경변수를 설정하세요.",
  "details": "상세 오류 메시지"
}
```

---

## 🎯 동작 순서

1. **Google Drive API 호출**
   - 지정된 폴더 ID에서 이미지 파일 검색 (JPEG, PNG, WebP)
   - 최대 1000개 파일 가져오기

2. **기존 데이터 삭제**
   - 해당 event_id의 기존 사진 모두 삭제 (중복 방지)

3. **새 데이터 삽입**
   - Google Drive 파일 ID를 Supabase에 저장
   - file_url: Google Drive 파일 ID
   - file_name: 파일 이름
   - event_id: 이벤트 ID

4. **결과 반환**
   - 성공 시: 저장된 사진 개수와 정보
   - 실패 시: 오류 메시지

---

## 🧪 테스트

### **로컬 테스트**

```bash
# 서버 실행
npm run dev

# API 호출
curl "http://localhost:3000/api/gallery-sync?folder_id=1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO&event_id=2"
```

### **Vercel 배포 후 테스트**

```bash
curl "https://your-domain.vercel.app/api/gallery-sync?folder_id=YOUR_FOLDER_ID&event_id=2"
```

---

## 📝 주의사항

1. **Google API Key 권한**
   - Google Drive API가 활성화되어 있어야 함
   - API Key 제한 없음 또는 허용된 도메인 설정

2. **폴더 공유 설정**
   - Google Drive 폴더가 "링크가 있는 모든 사용자" 공유되어야 함

3. **Supabase 권한**
   - `gallery_photos` 테이블에 INSERT/DELETE 권한 필요

4. **레이트 리밋**
   - Google Drive API 할당량 주의 (일일 10,000 요청)

---

## 🔄 자동화 (Cron Job)

Vercel Cron Job으로 매일 자동 동기화:

**`vercel.json`**
```json
{
  "crons": [
    {
      "path": "/api/gallery-sync",
      "schedule": "0 0 * * *"
    }
  ]
}
```

매일 자정(UTC)에 자동 실행됩니다.

---

## 🛠️ 문제 해결

### **"folder_id가 필요합니다" 오류**
→ `.env.local`에 `NEXT_PUBLIC_DRIVE_FOLDER_ID` 설정 또는 쿼리 파라미터로 전달

### **"Google API Key가 설정되지 않았습니다" 오류**
→ `.env.local`에 `NEXT_PUBLIC_GOOGLE_API_KEY` 설정

### **"403 Forbidden" 오류**
→ Google Drive API 활성화 및 API Key 권한 확인

### **"Supabase 삽입 실패" 오류**
→ `gallery_photos` 테이블 존재 확인 및 권한 확인

---

## 📚 관련 파일

- **API 엔드포인트**: `/src/app/api/gallery-sync/route.ts`
- **갤러리 페이지**: `/src/app/gallery/page.tsx`
- **갤러리 함수**: `/src/lib/supabase/gallery.ts`
- **환경변수**: `.env.local`

---

## ✅ 완료!

이제 API를 호출하면 Google Drive 폴더의 이미지가 자동으로 Supabase에 동기화됩니다! 🎉


