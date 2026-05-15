import { z } from "zod";

const infoCardLinkSchema = z
  .object({
    text: z.string().optional(),
    href: z.string().optional(),
  })
  .passthrough();

const infoCardSermonSchema = z
  .object({
    category: z.string().optional(),
    youtubeUrl: z.string().optional(),
    title: z.string().optional(),
  })
  .passthrough();

const infoCardItemSchema = z
  .object({
    icon: z.string().optional(),
    label: z.string().optional(),
    value: z.string().optional(),
  })
  .passthrough();

/** 카드 한 장 — InfoCardsSection + 관리자 폼 필드 합집합 */
export const infoCardBlockSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    href: z.string().optional(),
    image: z.string().optional(),
    link: infoCardLinkSchema.optional(),
    sermons: z.array(infoCardSermonSchema).optional(),
    items: z.array(infoCardItemSchema).optional(),
  })
  .passthrough();

const infoCardImageRowSchema = z
  .object({
    url: z.string().optional(),
    alt: z.string().optional(),
  })
  .passthrough();

const infoCardsCoreSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  cards: z.array(infoCardBlockSchema).optional(),
  images: z.array(infoCardImageRowSchema).optional(),
  autoPlayInterval: z.coerce.number().optional(),
});

export const infoCardsContentSchema = infoCardsCoreSchema.passthrough();

export type InfoCardsContent = z.infer<typeof infoCardsCoreSchema>;
export type InfoCardBlock = z.infer<typeof infoCardBlockSchema>;

export const infoCardsDefaultContent: InfoCardsContent = {
  heading: "",
  description: "",
  cards: [],
  images: [],
};

export function mergeInfoCardsContent(data: InfoCardsContent): InfoCardsContent {
  return {
    ...infoCardsDefaultContent,
    ...data,
    cards: Array.isArray(data.cards) ? data.cards : infoCardsDefaultContent.cards,
    images: Array.isArray(data.images) ? data.images : infoCardsDefaultContent.images,
  };
}
