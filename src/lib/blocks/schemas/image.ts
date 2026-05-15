import { z } from "zod";

const imageCoreSchema = z.object({
  heading: z.string().optional(),
  subheading: z.string().optional(),
  description: z.string().optional(),
  backgroundImage: z.string().optional(),
  src: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const imageContentSchema = imageCoreSchema.passthrough();

export type ImageContent = z.infer<typeof imageCoreSchema>;

export const imageDefaultContent: ImageContent = {
  heading: "",
  subheading: "",
  description: "",
  backgroundImage: "",
  src: "",
  image: "",
  url: "",
  alt: "",
  caption: "",
};

export function mergeImageContent(data: ImageContent): ImageContent {
  return { ...imageDefaultContent, ...data };
}

/** 표시용 URL (여러 필드명 호환) */
export function resolveImageSectionUrl(c: ImageContent): string {
  const merged = mergeImageContent(c);
  const raw =
    merged.backgroundImage ||
    merged.src ||
    merged.image ||
    merged.url ||
    "";
  return typeof raw === "string" ? raw.trim() : "";
}
