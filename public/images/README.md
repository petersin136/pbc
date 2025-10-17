# 📸 이미지 슬라이드용 이미지 폴더

이 폴더에 교회 사진을 저장하세요.

## 📁 권장 파일명
- `church-1.jpg` - 교회 전경
- `church-2.jpg` - 예배 모습
- `church-3.jpg` - 찬양 모습
- `worship-1.jpg` - 주일 예배
- `worship-2.jpg` - 수요 예배
- `building-1.jpg` - 교회 건물 외관

## 🖼️ 이미지 권장 사양
- **비율**: 가로 사진 (4:3 또는 16:9)
- **해상도**: 최소 1200 x 800px
- **파일 형식**: JPG, PNG, WebP
- **파일 크기**: 2MB 이하 (빠른 로딩)

## ✏️ 관리자 페이지에서 추가하는 방법

1. 이미지 파일을 이 폴더(`public/images/`)에 복사
2. `http://localhost:3000/admin/sections` 접속
3. 페이지: **home** 선택
4. **info-cards** 섹션 클릭
5. JSON 에디터에서 `images` 배열에 추가:

```json
{
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

6. **저장** 버튼 클릭
7. 홈페이지 새로고침

## 🔄 자동 슬라이드 속도 조절
`autoPlayInterval`: 밀리초 단위 (5000 = 5초)

