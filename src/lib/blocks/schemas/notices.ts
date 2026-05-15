import { z } from "zod";
import { mergeArrayByIndex } from "../merge-helpers";

const noticeItemCoreSchema = z.object({
  title: z.string().optional(),
  date: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  important: z.boolean().optional(),
  author: z.string().optional(),
});

export const noticeItemSchema = noticeItemCoreSchema.passthrough();

export type NoticeItem = z.infer<typeof noticeItemCoreSchema>;

const noticesCoreSchema = z.object({
  description: z.string().optional(),
  headerImage: z.string().optional(),
  notices: z.array(noticeItemSchema).optional(),
});

export const noticesContentSchema = noticesCoreSchema.passthrough();

export type NoticesContent = z.infer<typeof noticesCoreSchema>;

export const noticeItemDefault: NoticeItem = {
  title: "",
  date: "",
  content: "",
  category: "",
  important: false,
  author: "",
};

export const noticesDefaultContent: NoticesContent = {
  description: "",
  headerImage: "",
  notices: [],
};

export function mergeNoticesContent(
  data: NoticesContent,
  prev?: Partial<NoticesContent> | null
): NoticesContent {
  const p = prev ?? undefined;
  const notices =
    data.notices !== undefined
      ? mergeArrayByIndex<NoticeItem>(
          p?.notices as NoticeItem[] | undefined,
          data.notices as NoticeItem[],
          noticeItemDefault
        )
      : (p?.notices ?? noticesDefaultContent.notices ?? []);

  return {
    ...noticesDefaultContent,
    ...p,
    ...data,
    description:
      data.description !== undefined ? data.description : (p?.description ?? noticesDefaultContent.description),
    headerImage:
      data.headerImage !== undefined ? data.headerImage : (p?.headerImage ?? noticesDefaultContent.headerImage),
    notices,
  };
}
