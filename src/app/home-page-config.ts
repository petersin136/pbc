/**
 * 홈 정적 리뉴얼 — URL·카피만 분리 (향후 RSC/데이터 바인딩 시 이 파일만 교체하기 쉽도록)
 */

/** 하늘/분위기 배경 — `GreetingSection` 등에서 쓰이던 Supabase `air1.jpg` */
export const HOME_HERO_IMAGE_URL =
  "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/air1.jpg";

/** 도시 전경 — 기존 `QuickLinksSection` Unsplash 카드와 동일 출처 */
export const HOME_CITY_IMAGE_URL =
  "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1920&auto=format&fit=crop&q=80";

export const HOME_LOGO_URL =
  "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/pbclo-Photoroom.png";

export type QuickLinkDef = {
  title: string;
  description: string;
  href: string;
  icon: "building2" | "bookOpen" | "users" | "hand";
};

export const HOME_QUICK_LINKS: QuickLinkDef[] = [
  {
    title: "포천장로교회와",
    description: "교회를 처음 만나는 분들을 위해",
    href: "/about",
    icon: "building2",
  },
  {
    title: "묵상의 마음",
    description: "말씀으로 하루를 여는 시간",
    href: "/word/articles",
    icon: "bookOpen",
  },
  {
    title: "교회속으로",
    description: "공간과 사역을 한눈에",
    href: "/about/facilities",
    icon: "users",
  },
  {
    title: "기도제목",
    description: "함께 나누는 기도",
    href: "/news/prayer",
    icon: "hand",
  },
];

export const HOME_MESSAGE_TABS = ["주일예배", "수요예배", "새벽기도", "특별집회"] as const;

export type ServiceTimeDef = { label: string; time: string };

export const HOME_SERVICE_TIMES: ServiceTimeDef[] = [
  { label: "주일 1부", time: "오전 9:00" },
  { label: "주일 2부", time: "오전 11:00" },
  { label: "수요예배", time: "오후 7:30" },
  { label: "금요기도", time: "오후 9:00" },
  { label: "새벽기도", time: "오전 5:00" },
];
