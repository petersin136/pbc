import { z } from "zod";

export const fiveKMovementContentSchema = z
  .object({
    description: z.string().optional(),
    subtitle: z.string().optional(),
    heroImage: z.string().optional(),
    fourMinistries: z.array(z.record(z.string(), z.unknown())).optional(),
    ncmnMovements: z.array(z.record(z.string(), z.unknown())).optional(),
    strategy: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export type FiveKMovementContent = z.infer<typeof fiveKMovementContentSchema>;

export const fiveKMovementDefaultContent: FiveKMovementContent = {};
