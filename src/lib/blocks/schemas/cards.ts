import { z } from "zod";

export const cardsContentSchema = z
  .object({
    cards: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export type CardsContent = z.infer<typeof cardsContentSchema>;

export const cardsDefaultContent: CardsContent = {};
