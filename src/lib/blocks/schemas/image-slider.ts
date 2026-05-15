import { z } from "zod";

export const imageSliderContentSchema = z
  .object({
    images: z.array(z.record(z.string(), z.unknown())).optional(),
    backgroundImage: z.string().optional(),
    autoPlayInterval: z.coerce.number().optional(),
    showArrows: z.coerce.boolean().optional(),
    showIndicators: z.coerce.boolean().optional(),
    height: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

export type ImageSliderContent = z.infer<typeof imageSliderContentSchema>;

export const imageSliderDefaultContent: ImageSliderContent = {};
