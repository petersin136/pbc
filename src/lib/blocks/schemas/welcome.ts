import { z } from "zod";

export const welcomeContentSchema = z
  .object({
    title: z.string().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
    description: z.string().optional(),
    items: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export type WelcomeContent = z.infer<typeof welcomeContentSchema>;

export const welcomeDefaultContent: WelcomeContent = {};
