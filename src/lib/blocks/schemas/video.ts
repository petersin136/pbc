import { z } from "zod";

export const videoContentSchema = z
  .object({
    videoUrl: z.string().optional(),
    embedId: z.string().optional(),
  })
  .passthrough();

export type VideoContent = z.infer<typeof videoContentSchema>;

export const videoDefaultContent: VideoContent = {};
