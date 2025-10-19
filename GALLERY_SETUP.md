# 갤러리 관리자 페이지 설정 가이드

## 📂 관리자 페이지 접근

### URL
```
http://localhost:3000/admin/gallery
```

## 🔑 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Google Drive API 설정
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_DRIVE_FOLDER_ID=1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO
NEXT_PUBLIC_DRIVE_EVENT_ID=2
```

### Google API Key 발급 방법

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 신규 생성
3. **API 및 서비스 > 라이브러리** 이동
4. **Google Drive API** 검색 및 활성화
5. **사용자 인증 정보 > 사용자 인증 정보 만들기 > API 키** 선택
6. API 키 복사 후 `.env.local`에 추가

## 📸 사용 방법

### 1단계: Google Drive에 사진 올리기
1. 관리자 페이지에서 **"📂 사진 올리기"** 버튼 클릭
2. Google Drive 폴더가 새 탭에서 열림
3. 폴더에 사진 업로드

### 2단계: 웹사이트에 반영하기
1. 사진 업로드 완료 후 **"💾 올리기 저장"** 버튼 클릭
2. 자동으로 Google Drive 사진을 Supabase DB로 동기화
3. 완료 메시지 확인

### 3단계: 갤러리 페이지 확인
```
http://localhost:3000/gallery
```

## 🛠️ API 엔드포인트

### GET `/api/gallery-sync`

Google Drive 폴더의 이미지를 Supabase DB로 동기화합니다.

#### 쿼리 파라미터
- `folder_id` (선택): Google Drive 폴더 ID (기본값: 환경 변수)
- `event_id` (선택): 갤러리 이벤트 ID (기본값: 환경 변수)

#### 예시
```
GET /api/gallery-sync?folder_id=1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO&event_id=2
```

#### 응답
```json
{
  "success": true,
  "message": "✅ 갤러리 업데이트 완료!",
  "output": "..."
}
```

## 📋 주요 기능

### 갤러리 관리자 페이지 (`/admin/gallery`)
- ✅ Google Drive 폴더 직접 열기
- ✅ 원클릭 동기화 (Drive → Supabase)
- ✅ 실시간 상태 메시지
- ✅ 성공/실패 알림

### API 자동화 (`/api/gallery-sync`)
- ✅ Google Drive API 연동
- ✅ 파일 ID 자동 추출
- ✅ Supabase DB 자동 업데이트
- ✅ 에러 핸들링

## ⚠️ 주의사항

1. **Google API Key 필수**
   - API Key가 없으면 동기화 실패
   - 환경 변수에 올바른 Key 설정 필요

2. **폴더 ID 확인**
   - Google Drive 폴더 URL에서 ID 추출
   - 예: `https://drive.google.com/drive/folders/[FOLDER_ID]`

3. **이벤트 ID**
   - Supabase `gallery_events` 테이블의 ID
   - 사진이 속할 이벤트를 지정

4. **동기화 시간**
   - 사진 개수에 따라 몇 초 ~ 몇 분 소요
   - 너무 빠르게 연속으로 클릭하지 마세요

## 🎯 Vercel 배포 시

### 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정하세요:

1. **Settings > Environment Variables** 이동
2. 다음 변수 추가:
   ```
   NEXT_PUBLIC_GOOGLE_API_KEY=your_key
   NEXT_PUBLIC_DRIVE_FOLDER_ID=your_folder_id
   NEXT_PUBLIC_DRIVE_EVENT_ID=your_event_id
   ```

## 🔗 관련 파일

- `/src/app/admin/gallery/page.tsx` - 관리자 페이지
- `/src/app/api/gallery-sync/route.ts` - 동기화 API
- `/scripts/import-drive-folder.ts` - Google Drive 연동 스크립트
- `/src/lib/supabase/gallery.ts` - Supabase 갤러리 함수

## 📚 추가 문서

- [GALLERY_SYNC_API.md](./GALLERY_SYNC_API.md) - API 상세 문서
- [README.md](./README.md) - 프로젝트 전체 가이드


