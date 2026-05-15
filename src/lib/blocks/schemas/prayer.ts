import { z } from "zod";
import { mergeArrayByIndex } from "../merge-helpers";

const prayerItemCoreSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  date: z.string().optional(),
  category: z.string().optional(),
  urgent: z.boolean().optional(),
  requestedBy: z.string().optional(),
  verse: z.string().optional(),
  verseRef: z.string().optional(),
});

export const prayerItemSchema = prayerItemCoreSchema.passthrough();

export type PrayerItem = z.infer<typeof prayerItemCoreSchema>;

const prayerCoreSchema = z.object({
  description: z.string().optional(),
  headerImage: z.string().optional(),
  prayers: z.array(prayerItemSchema).optional(),
});

export const prayerContentSchema = prayerCoreSchema.passthrough();

export type PrayerContent = z.infer<typeof prayerCoreSchema>;

export const prayerItemDefault: PrayerItem = {
  title: "",
  content: "",
  date: "",
  category: "",
  urgent: false,
  requestedBy: "",
  verse: "",
  verseRef: "",
};

export const prayerDefaultContent: PrayerContent = {
  description: "",
  headerImage: "",
  prayers: [],
};

export function mergePrayerContent(data: PrayerContent, prev?: Partial<PrayerContent> | null): PrayerContent {
  const p = prev ?? undefined;
  const prayers =
    data.prayers !== undefined
      ? mergeArrayByIndex<PrayerItem>(
          p?.prayers as PrayerItem[] | undefined,
          data.prayers as PrayerItem[],
          prayerItemDefault
        )
      : (p?.prayers ?? prayerDefaultContent.prayers ?? []);

  return {
    ...prayerDefaultContent,
    ...p,
    ...data,
    description:
      data.description !== undefined ? data.description : (p?.description ?? prayerDefaultContent.description),
    headerImage:
      data.headerImage !== undefined ? data.headerImage : (p?.headerImage ?? prayerDefaultContent.headerImage),
    prayers,
  };
}
