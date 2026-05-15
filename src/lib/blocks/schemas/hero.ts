import { z } from "zod";

const heroButtonSchema = z
  .object({
    text: z.string().optional(),
    label: z.string().optional(),
    href: z.string().optional(),
  })
  .passthrough();

/** 알려진 필드만으로 타입 추론 (passthrough는 런타임에서만 추가 키 허용) */
const heroCoreSchema = z.object({
  heading: z.string().optional(),
  subheading: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundVideo: z.string().optional(),
  videoLoop: z.coerce.boolean().optional(),
  buttons: z.array(heroButtonSchema).optional(),
  verse: z.string().optional(),
  verseReference: z.string().optional(),
  verseEn: z.string().optional(),
  verseReferenceEn: z.string().optional(),
});

/**
 * HeroSection / 관리자 Hero 폼이 읽는 필드 전부 optional + 알 수 없는 키 보존
 */
export const heroContentSchema = heroCoreSchema.passthrough();

export type HeroContent = z.infer<typeof heroCoreSchema>;

export const heroDefaultContent: HeroContent = {
  heading: "포천중앙침례교회",
  subheading: "하나님의 사랑과 은혜가 가득한 곳",
  buttons: [],
  videoLoop: true,
};

export function mergeHeroContent(data: HeroContent): HeroContent {
  return { ...heroDefaultContent, ...data };
}
