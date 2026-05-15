import { z } from "zod";
import { mergeArrayByIndex } from "../merge-helpers";

const lifegroupItemCoreSchema = z.object({
  number: z.coerce.number().optional(),
  leader: z.string().optional(),
  members: z.array(z.string()).optional(),
  meetingDay: z.string().optional(),
  location: z.string().optional(),
  name: z.string().optional(),
  schedule: z.string().optional(),
  description: z.string().optional(),
  leaderPhone: z.string().optional(),
});

export const lifegroupItemSchema = lifegroupItemCoreSchema.passthrough();

export type LifegroupItem = z.infer<typeof lifegroupItemCoreSchema>;

const lifegroupCoreSchema = z.object({
  description: z.string().optional(),
  lifegroups: z.array(lifegroupItemSchema).optional(),
});

export const lifegroupContentSchema = lifegroupCoreSchema.passthrough();

export type LifegroupContent = z.infer<typeof lifegroupCoreSchema>;

export const lifegroupItemDefault: LifegroupItem = {};

export const lifegroupDefaultContent: LifegroupContent = {
  description: "",
  lifegroups: [],
};

export function mergeLifegroupContent(
  data: LifegroupContent,
  prev?: Partial<LifegroupContent> | null
): LifegroupContent {
  const p = prev ?? undefined;
  const lifegroups =
    data.lifegroups !== undefined
      ? mergeArrayByIndex<LifegroupItem>(
          p?.lifegroups as LifegroupItem[] | undefined,
          data.lifegroups as LifegroupItem[],
          lifegroupItemDefault
        )
      : (p?.lifegroups ?? lifegroupDefaultContent.lifegroups ?? []);

  return {
    ...lifegroupDefaultContent,
    ...p,
    ...data,
    description:
      data.description !== undefined ? data.description : (p?.description ?? lifegroupDefaultContent.description),
    lifegroups,
  };
}
