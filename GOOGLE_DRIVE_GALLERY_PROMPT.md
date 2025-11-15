# 📸 Google Drive 갤러리 연동 시스템 구축 프롬프트

다음에 다시 구축할 때 이 프롬프트를 AI에게 그대로 복사해서 주세요!

---

## 🎯 프롬프트 (복사해서 사용)

```
Google Drive 갤러리 연동 시스템을 구축해줘.

## 요구사항:
1. Google Drive에 업로드된 사진들을 홈페이지 갤러리에 자동으로 표시
2. Supabase Storage는 사용하지 말고, Google Drive의 이미지를 직접 임베드
3. 관리자 페이지에서 "동기화" 버튼 클릭하면 Google Drive 사진들이 Supabase DB(gallery_photos 테이블)에 자동 저장
4. 갤러리 페이지에서 그리드 레이아웃으로 예쁘게 표시 (반응형 디자인)
5. 이미지 클릭 시 라이트박스로 크게 보기 기능
6. 모바일 최적화 필수 (모든 관리자 페이지 포함)

## 기술 스택:
- Next.js (App Router)
- Supabase (DB만 사용, Storage는 X)
- Google Drive API
- Tailwind CSS

## 필요한 설정:
- Google Cloud Console에서 API Key 발급 방법 안내
- Google Drive 폴더 ID 찾는 방법 안내
- 폴더 공유 설정 (링크 있는 모든 사용자 + 뷰어 권한)
- .env.local 환경변수 설정
- 서버 재시작 방법 안내

## 페이지 구성:
1. /gallery - 메인 갤러리 페이지 (그리드 레이아웃, 라이트박스)
2. /admin/gallery - 관리자 동기화 페이지 (모바일 최적화)

## 주의사항:
- 이미지는 Google Drive에서 직접 로딩 (Supabase Storage 용량 절약)
- 썸네일은 Google Drive API의 thumbnailLink 사용
- 에러 처리 철저히 (API Key 없을 때, 폴더 없을 때, 공유 설정 안 됐을 때 등)
- 로딩 상태 UI 추가
- 반응형 디자인 (모바일, 태블릿, 데스크탑)
- 모든 관리자 페이지 모바일 최적화 (섹션 관리, 갤러리 관리 등)
- Google Drive 공유 설정 가이드 포함 (302 리다이렉트 방지)

## API 엔드포인트:
- GET /api/gallery-sync?folder_id={FOLDER_ID}&event_id={EVENT_ID}
  - Google Drive 폴더의 이미지를 Supabase gallery_photos 테이블에 동기화
  - 환경변수 체크 (GOOGLE_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY)
  - 에러 메시지 명확하게 반환

## Supabase 테이블 구조:
- gallery_photos
  - id (uuid, primary key)
  - event_id (text)
  - image_url (text) - Google Drive 썸네일 URL
  - title (text, nullable)
  - created_at (timestamp)
  - RLS 정책: 모든 사용자 읽기/쓰기 가능

## 환경변수 (.env.local):
```env
NEXT_PUBLIC_GOOGLE_API_KEY=여기에_발급받은_API키
NEXT_PUBLIC_DRIVE_FOLDER_ID=여기에_폴더ID
NEXT_PUBLIC_DRIVE_EVENT_ID=2
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_아논키
```

## 추가 기능 (선택사항):
- 사진 캡션/설명 표시
- 날짜별 정렬
- 카테고리/앨범 구분
- 이미지 검색 기능
- 페이지네이션 (무한 스크롤)
- 관리자 페이지에서 사진 삭제 기능
```

---

## 💡 사용 방법

1. **위 프롬프트를 복사**
2. **AI에게 붙여넣기**
3. **AI가 자동으로 구축**
4. **Google API Key 발급** (AI가 안내)
5. **`.env.local` 설정**
6. **서버 재시작** (`npm run dev`)
7. **Google Drive 공유 설정** (링크 있는 모든 사용자 + 뷰어)
8. **완성! 🎉**

---

## 🎊 장점

| 항목 | Google Drive | Supabase Storage |
|------|--------------|------------------|
| 용량 | **15GB 무료** | 1GB 무료 |
| 비용 | $0 | 초과시 유료 |
| 관리 | Google 포토앱 | 웹 대시보드 |
| 백업 | 자동 | 수동 |
| 속도 | 빠름 | 빠름 |

---

## 🔧 트러블슈팅

### 문제 1: "Invalid API key"
- `.env.local` 파일 확인
- 서버 재시작 (`Ctrl+C` → `npm run dev`)

### 문제 2: 이미지가 회색 박스로 표시
- Google Drive 공유 설정 확인
- "링크 있는 모든 사용자" + "뷰어" 권한 설정

### 문제 3: "Bucket not found"
- 이 시스템은 Supabase Storage를 사용하지 않음
- Google Drive만 사용하므로 무시 가능

---

## 📝 메모

- 이 프롬프트는 2025년 1월 기준으로 작성됨
- Next.js 15, Supabase v2, Google Drive API v3 기준
- 모바일 최적화 포함 (Tailwind CSS 반응형)
- 한 번에 완벽하게 작동하도록 설계됨

---

**저장 날짜:** 2025-01-26  
**작성자:** AI Assistant  
**프로젝트:** 포천중앙침례교회 홈페이지



