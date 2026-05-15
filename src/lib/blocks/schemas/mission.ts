import { z } from "zod";

export const missionContentSchema = z
  .object({
    missionFields: z.array(z.record(z.string(), z.unknown())).optional(),
    missionaries: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export type MissionContent = z.infer<typeof missionContentSchema>;

export const missionDefaultContent: MissionContent = {};
