import { z } from "zod";

export const pastorContentSchema = z
  .object({
    name: z.string().optional(),
    title: z.string().optional(),
    photo: z.string().optional(),
    bio: z.array(z.string()).optional(),
  })
  .passthrough();

export type PastorContent = z.infer<typeof pastorContentSchema>;

export const pastorDefaultContent: PastorContent = {};
