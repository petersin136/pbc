import { z } from "zod";

export const nurtureContentSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    curriculum: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export type NurtureContent = z.infer<typeof nurtureContentSchema>;

export const nurtureDefaultContent: NurtureContent = {};
