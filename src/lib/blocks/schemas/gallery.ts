import { z } from "zod";

export const galleryContentSchema = z
  .object({
    albums: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export type GalleryContent = z.infer<typeof galleryContentSchema>;

export const galleryDefaultContent: GalleryContent = {};
