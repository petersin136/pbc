import { z } from "zod";

export const departmentContentSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    age: z.string().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    teacher: z.string().optional(),
    activities: z.array(z.string()).optional(),
    programs: z.array(z.record(z.string(), z.unknown())).optional(),
    photo: z.string().optional(),
  })
  .passthrough();

export type DepartmentContent = z.infer<typeof departmentContentSchema>;

export const departmentDefaultContent: DepartmentContent = {};
