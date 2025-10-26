# Supabase Storage 버킷 생성 가이드

## 🎯 버킷 생성 (1회만 실행)

### 1. Supabase Dashboard 접속
https://supabase.com/dashboard/project/czbffjnslwauemngpayh

### 2. Storage 메뉴로 이동
왼쪽 사이드바 → **Storage**

### 3. 새 버킷 생성
- **"New bucket"** 버튼 클릭
- **Bucket name**: `church-images`
- **Public bucket**: ✅ **체크** (공개 버킷으로 생성)
- **File size limit**: 5MB (권장)
- **Allowed MIME types**: image/* (모든 이미지 타입 허용)

### 4. 생성 완료!
✅ `church-images` 버킷이 생성되면 완료

---

## 🔧 이미지 업로드 테스트

버킷 생성 후:
1. 개발 서버 재시작: `npm run dev`
2. 관리자 페이지 접속: `http://localhost:3000/admin/sections`
3. 이미지 업로드 테스트
4. 자동 압축 확인! 🎉

---

## 📊 압축 효과

- **원본**: JPG/PNG (2-5MB)
- **압축 후**: WebP (200-800KB)
- **절감률**: 약 **80% 용량 감소** ✨

---

## ✅ 완료 체크리스트

- [ ] Supabase Dashboard 접속
- [ ] Storage 메뉴 진입
- [ ] `church-images` 버킷 생성 (Public)
- [ ] 개발 서버 재시작
- [ ] 이미지 업로드 테스트

---

## 🆘 문제 해결

### 버킷 생성 실패
- Supabase 프로젝트 상태 확인
- 브라우저 새로고침 후 재시도

### 업로드 실패
- 터미널에서 오류 메시지 확인
- 버킷 이름이 `church-images`인지 확인
- Public 버킷으로 설정했는지 확인

