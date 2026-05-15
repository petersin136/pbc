import type { z } from "zod";
import type { AnyBlockDefinition, BlockDefinition } from "./types";
import { formatZodError } from "./format-zod-error";
import {
  heroContentSchema,
  heroDefaultContent,
  type HeroContent,
} from "./schemas/hero";
import { infoCardsContentSchema, infoCardsDefaultContent, type InfoCardsContent } from "./schemas/info-cards";
import { pastorContentSchema, pastorDefaultContent, type PastorContent } from "./schemas/pastor";
import { locationContentSchema, locationDefaultContent, type LocationContent } from "./schemas/location";
import { departmentContentSchema, departmentDefaultContent, type DepartmentContent } from "./schemas/department";
import { nurtureContentSchema, nurtureDefaultContent, type NurtureContent } from "./schemas/nurture";
import { missionContentSchema, missionDefaultContent, type MissionContent } from "./schemas/mission";
import {
  fiveKMovementContentSchema,
  fiveKMovementDefaultContent,
  type FiveKMovementContent,
} from "./schemas/five-k-movement";
import { noticesContentSchema, noticesDefaultContent, type NoticesContent } from "./schemas/notices";
import { prayerContentSchema, prayerDefaultContent, type PrayerContent } from "./schemas/prayer";
import { galleryContentSchema, galleryDefaultContent, type GalleryContent } from "./schemas/gallery";
import { lifegroupContentSchema, lifegroupDefaultContent, type LifegroupContent } from "./schemas/lifegroup";
import {
  imageSliderContentSchema,
  imageSliderDefaultContent,
  type ImageSliderContent,
} from "./schemas/image-slider";
import { textContentSchema, textDefaultContent, type TextContent } from "./schemas/text";
import { imageContentSchema, imageDefaultContent, type ImageContent } from "./schemas/image";
import { contactContentSchema, contactDefaultContent, type ContactContent } from "./schemas/contact";
import { welcomeContentSchema, welcomeDefaultContent, type WelcomeContent } from "./schemas/welcome";
import { cardsContentSchema, cardsDefaultContent, type CardsContent } from "./schemas/cards";
import { videoContentSchema, videoDefaultContent, type VideoContent } from "./schemas/video";

export const heroBlockDefinition = {
  kind: "hero",
  label: "Hero 배너",
  description: "상단 대형 배너(이미지·영상·제목·CTA·성경 구절)",
  icon: "Clapperboard",
  schema: heroContentSchema,
  defaultContent: heroDefaultContent,
  category: "hero",
} satisfies BlockDefinition<HeroContent>;

export const infoCardsBlockDefinition = {
  kind: "info-cards",
  label: "정보 카드",
  description: "말씀 영상·예배 시간 등 카드형 정보",
  icon: "LayoutGrid",
  schema: infoCardsContentSchema,
  defaultContent: infoCardsDefaultContent,
  category: "content",
} satisfies BlockDefinition<InfoCardsContent>;

export const pastorBlockDefinition = {
  kind: "pastor",
  label: "담임목사 소개",
  description: "목사님 프로필·사진·약력",
  icon: "User",
  schema: pastorContentSchema,
  defaultContent: pastorDefaultContent,
  category: "community",
} satisfies BlockDefinition<PastorContent>;

export const locationBlockDefinition = {
  kind: "location",
  label: "오시는 길",
  description: "주소·지도·교통 안내",
  icon: "MapPin",
  schema: locationContentSchema,
  defaultContent: locationDefaultContent,
  category: "community",
} satisfies BlockDefinition<LocationContent>;

export const departmentBlockDefinition = {
  kind: "department",
  label: "부서 안내",
  description: "교육·부서별 소개",
  icon: "GraduationCap",
  schema: departmentContentSchema,
  defaultContent: departmentDefaultContent,
  category: "department",
} satisfies BlockDefinition<DepartmentContent>;

export const nurtureBlockDefinition = {
  kind: "nurture",
  label: "양육",
  description: "양육 과정·커리큘럼",
  icon: "Sprout",
  schema: nurtureContentSchema,
  defaultContent: nurtureDefaultContent,
  category: "department",
} satisfies BlockDefinition<NurtureContent>;

export const missionBlockDefinition = {
  kind: "mission",
  label: "선교",
  description: "국내외 선교 필드·선교사",
  icon: "Globe",
  schema: missionContentSchema,
  defaultContent: missionDefaultContent,
  category: "community",
} satisfies BlockDefinition<MissionContent>;

export const fiveKMovementBlockDefinition = {
  kind: "5k-movement",
  label: "5K 운동",
  description: "NCMN 5K 운동 소개",
  icon: "Activity",
  schema: fiveKMovementContentSchema,
  defaultContent: fiveKMovementDefaultContent,
  category: "content",
} satisfies BlockDefinition<FiveKMovementContent>;

export const noticesBlockDefinition = {
  kind: "notices",
  label: "공지사항",
  description: "교회 공지 목록",
  icon: "Megaphone",
  schema: noticesContentSchema,
  defaultContent: noticesDefaultContent,
  category: "community",
} satisfies BlockDefinition<NoticesContent>;

export const prayerBlockDefinition = {
  kind: "prayer",
  label: "기도제목",
  description: "주간 기도제목",
  icon: "Heart",
  schema: prayerContentSchema,
  defaultContent: prayerDefaultContent,
  category: "community",
} satisfies BlockDefinition<PrayerContent>;

export const galleryBlockDefinition = {
  kind: "gallery",
  label: "갤러리",
  description: "앨범·사진 그리드",
  icon: "Images",
  schema: galleryContentSchema,
  defaultContent: galleryDefaultContent,
  category: "media",
} satisfies BlockDefinition<GalleryContent>;

export const lifegroupBlockDefinition = {
  kind: "lifegroup",
  label: "목장",
  description: "목장 목록",
  icon: "Users",
  schema: lifegroupContentSchema,
  defaultContent: lifegroupDefaultContent,
  category: "community",
} satisfies BlockDefinition<LifegroupContent>;

export const imageSliderBlockDefinition = {
  kind: "image-slider",
  label: "이미지 슬라이더",
  description: "전환되는 이미지 슬라이드",
  icon: "ImagePlay",
  schema: imageSliderContentSchema,
  defaultContent: imageSliderDefaultContent,
  category: "media",
} satisfies BlockDefinition<ImageSliderContent>;

export const textBlockDefinition = {
  kind: "text",
  label: "텍스트",
  description: "제목·본문·정렬",
  icon: "Type",
  schema: textContentSchema,
  defaultContent: textDefaultContent,
  category: "content",
} satisfies BlockDefinition<TextContent>;

export const imageBlockDefinition = {
  kind: "image",
  label: "이미지",
  description: "단일 이미지 섹션",
  icon: "Image",
  schema: imageContentSchema,
  defaultContent: imageDefaultContent,
  category: "media",
} satisfies BlockDefinition<ImageContent>;

export const contactBlockDefinition = {
  kind: "contact",
  label: "연락처",
  description: "연락처(현재 텍스트 섹션으로 렌더)",
  icon: "Phone",
  schema: contactContentSchema,
  defaultContent: contactDefaultContent,
  category: "community",
} satisfies BlockDefinition<ContactContent>;

export const welcomeBlockDefinition = {
  kind: "welcome",
  label: "환영 (레거시)",
  description: "SectionRenderer 미연결 레거시 kind",
  icon: "Sparkles",
  schema: welcomeContentSchema,
  defaultContent: welcomeDefaultContent,
  category: "content",
  deprecated: true,
} satisfies BlockDefinition<WelcomeContent>;

export const cardsBlockDefinition = {
  kind: "cards",
  label: "카드 그리드 (레거시)",
  description: "SectionRenderer 미연결 레거시 kind",
  icon: "SquareStack",
  schema: cardsContentSchema,
  defaultContent: cardsDefaultContent,
  category: "content",
  deprecated: true,
} satisfies BlockDefinition<CardsContent>;

export const videoBlockDefinition = {
  kind: "video",
  label: "동영상 (레거시)",
  description: "SectionRenderer 미연결 레거시 kind",
  icon: "Video",
  schema: videoContentSchema,
  defaultContent: videoDefaultContent,
  category: "media",
  deprecated: true,
} satisfies BlockDefinition<VideoContent>;

export const BLOCK_REGISTRY = {
  hero: heroBlockDefinition,
  "info-cards": infoCardsBlockDefinition,
  pastor: pastorBlockDefinition,
  location: locationBlockDefinition,
  department: departmentBlockDefinition,
  nurture: nurtureBlockDefinition,
  mission: missionBlockDefinition,
  "5k-movement": fiveKMovementBlockDefinition,
  notices: noticesBlockDefinition,
  prayer: prayerBlockDefinition,
  gallery: galleryBlockDefinition,
  lifegroup: lifegroupBlockDefinition,
  "image-slider": imageSliderBlockDefinition,
  text: textBlockDefinition,
  image: imageBlockDefinition,
  contact: contactBlockDefinition,
  welcome: welcomeBlockDefinition,
  cards: cardsBlockDefinition,
  video: videoBlockDefinition,
} as const;

export type BlockKind = keyof typeof BLOCK_REGISTRY;

export function getBlockDefinition(kind: string): AnyBlockDefinition | null {
  if (!Object.prototype.hasOwnProperty.call(BLOCK_REGISTRY, kind)) {
    return null;
  }
  return BLOCK_REGISTRY[kind as BlockKind] as AnyBlockDefinition;
}

export function isKnownBlockKind(kind: string): kind is BlockKind {
  return Object.prototype.hasOwnProperty.call(BLOCK_REGISTRY, kind);
}

export function parseBlockContent(
  kind: string,
  content: unknown
): { success: boolean; data?: unknown; error?: string } {
  const def = getBlockDefinition(kind);
  if (!def) {
    return { success: false, error: `Unknown block kind: ${kind}` };
  }
  const raw = content === null || content === undefined ? {} : content;
  const result = (def.schema as z.ZodType<unknown>).safeParse(raw);
  if (!result.success) {
    return { success: false, error: formatZodError(result.error) };
  }
  return { success: true, data: result.data };
}

export function mergeBlockDefaults(kind: string, data: unknown): Record<string, unknown> {
  const def = getBlockDefinition(kind);
  if (!def || typeof data !== "object" || data === null) {
    return {};
  }
  return {
    ...(def.defaultContent as Record<string, unknown>),
    ...(data as Record<string, unknown>),
  };
}

export {
  heroContentSchema,
  heroDefaultContent,
  mergeHeroContent,
  type HeroContent,
} from "./schemas/hero";

export {
  textContentSchema,
  textDefaultContent,
  mergeTextContent,
  type TextContent,
} from "./schemas/text";

export {
  imageContentSchema,
  imageDefaultContent,
  mergeImageContent,
  resolveImageSectionUrl,
  type ImageContent,
} from "./schemas/image";

export {
  infoCardsContentSchema,
  infoCardsDefaultContent,
  mergeInfoCardsContent,
  infoCardBlockSchema,
  type InfoCardsContent,
  type InfoCardBlock,
} from "./schemas/info-cards";

export { mergeArrayByIndex } from "./merge-helpers";

export {
  noticesContentSchema,
  noticesDefaultContent,
  mergeNoticesContent,
  noticeItemSchema,
  type NoticesContent,
  type NoticeItem,
} from "./schemas/notices";

export {
  prayerContentSchema,
  prayerDefaultContent,
  mergePrayerContent,
  prayerItemSchema,
  type PrayerContent,
  type PrayerItem,
} from "./schemas/prayer";

export {
  lifegroupContentSchema,
  lifegroupDefaultContent,
  mergeLifegroupContent,
  lifegroupItemSchema,
  type LifegroupContent,
  type LifegroupItem,
} from "./schemas/lifegroup";

export type { BlockDefinition, BlockCategory, AnyBlockDefinition } from "./types";
export { formatZodError } from "./format-zod-error";
