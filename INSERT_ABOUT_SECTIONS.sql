-- 교회소개 페이지 샘플 섹션 추가
-- Supabase SQL Editor에서 실행하세요

-- 1. Hero 섹션
INSERT INTO public.sections (page, kind, title, content, section_order)
VALUES (
  'about',
  'hero',
  '교회소개',
  '{
    "heading": "포천중앙침례교회",
    "subheading": "하나님의 사랑으로 세워진 교회",
    "backgroundVideo": "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/pbc.mp4"
  }'::jsonb,
  1
);

-- 2. 목사님 소개 섹션
INSERT INTO public.sections (page, kind, title, content, section_order)
VALUES (
  'about',
  'pastor',
  '담임목사 소개',
  '{
    "name": "홍길동",
    "title": "담임목사",
    "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    "description": "포천중앙침례교회 담임목사 홍길동입니다.\n\n하나님의 말씀을 전하고 성도들과 함께 신앙의 길을 걸어가는 것이 제 사명입니다.\n언제나 여러분과 함께하며 하나님의 사랑을 나누고 싶습니다.",
    "education": [
      "○○신학대학교 신학과 졸업",
      "△△대학교 신학대학원 석사",
      "□□신학교 목회학 박사"
    ],
    "ministry": [
      "2020년 ~ 현재: 포천중앙침례교회 담임목사",
      "2015년 ~ 2020년: ○○교회 부목사",
      "2010년 ~ 2015년: △△교회 전도사"
    ]
  }'::jsonb,
  2
);

-- 3. 교회 위치 섹션
INSERT INTO public.sections (page, kind, title, content, section_order)
VALUES (
  'about',
  'location',
  '교회 오시는 길',
  '{
    "address": "경기도 포천시 중앙로 123 (실제 주소를 입력하세요)",
    "description": "찾아오시는 길을 안내해 드립니다",
    "mapUrl": "https://maps.google.com/?q=경기도+포천시",
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25395.557899999998!2d127.20000000000001!3d38.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDAwJzAwLjAiTiAxMjfCsDEyJzAwLjAiRQ!5e0!3m2!1sko!2skr!4v1234567890"
  }'::jsonb,
  3
);

-- 4. 연락처 섹션
INSERT INTO public.sections (page, kind, title, content, section_order)
VALUES (
  'about',
  'contact',
  '교회 연락처',
  '{
    "phone": "031-1234-5678",
    "fax": "031-1234-5679",
    "email": "pbc@example.com",
    "address": "경기도 포천시 중앙로 123",
    "kakaoTalk": "http://pf.kakao.com/_your_channel",
    "instagram": "https://instagram.com/pbc_church",
    "facebook": "https://facebook.com/pbc.church",
    "youtube": "https://youtube.com/@pbc-church"
  }'::jsonb,
  4
);

-- 확인
SELECT * FROM public.sections WHERE page = 'about' ORDER BY section_order;

