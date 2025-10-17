# 🎯 빠른 시작 가이드

## 1️⃣ 이미지 파일 준비

교회 사진 3~5장을 준비하세요:
- 교회 건물 전경
- 주일 예배 모습
- 찬양 모습
- 교제 모습
- 특별 행사 사진

## 2️⃣ 이미지 파일 저장

이 폴더(`public/images/`)에 이미지 복사:

```
public/
└── images/
    ├── church-1.jpg    ← 교회 전경
    ├── church-2.jpg    ← 예배 모습
    └── worship-1.jpg   ← 찬양 모습
```

## 3️⃣ 관리자 페이지에서 설정

### 접속:
```
http://localhost:3000/admin/sections
```

### 수정 단계:
1. 페이지 드롭다운: **"home"** 선택
2. 섹션 목록에서 **"info-cards"** 클릭
3. JSON 에디터가 나타남

### JSON 수정 예시:
```json
{
  "cards": [
    // ... (카드 정보는 그대로 유지)
  ],
  "images": [
    {
      "url": "/images/church-1.jpg",
      "alt": "포천중앙침례교회 전경"
    },
    {
      "url": "/images/church-2.jpg",
      "alt": "주일 예배 모습"
    },
    {
      "url": "/images/worship-1.jpg",
      "alt": "찬양하는 모습"
    }
  ],
  "autoPlayInterval": 5000
}
```

4. **"Save"** 버튼 클릭
5. 홈페이지 새로고침 (`Cmd + Shift + R`)

## 4️⃣ 임시 테스트용 이미지

아직 이미지가 없다면, 임시로 이렇게 설정:

```json
{
  "images": [
    {
      "url": "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=800&fit=crop",
      "alt": "교회 예배 모습"
    },
    {
      "url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&h=800&fit=crop",
      "alt": "교회 건물"
    }
  ]
}
```

나중에 실제 이미지로 교체하세요!

## 🔄 슬라이드 속도 조절

- `"autoPlayInterval": 3000` → 3초
- `"autoPlayInterval": 5000` → 5초 (기본값)
- `"autoPlayInterval": 7000` → 7초

## ✅ 확인 사항

- [ ] 이미지 파일이 `public/images/` 폴더에 있음
- [ ] 파일명이 JSON의 `url`과 일치함
- [ ] 이미지 비율이 가로형 (4:3 또는 16:9)
- [ ] 파일 크기가 2MB 이하
- [ ] 관리자 페이지에서 저장 완료
- [ ] 홈페이지에서 슬라이드 정상 작동

---

**문제가 있나요?**
- 이미지가 안 보이면: 파일 경로 확인 (`/images/파일명.jpg`)
- 슬라이드가 안 넘어가면: `autoPlayInterval` 값 확인
- 관리자 페이지 접속 안 되면: 로그인 필요 (`/admin/login`)

