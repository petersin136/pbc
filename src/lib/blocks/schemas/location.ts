import { z } from "zod";

export const locationContentSchema = z
  .object({
    address: z.string().optional(),
    addressDetail: z.string().optional(),
    phone: z.string().optional(),
    mapUrl: z.string().optional(),
    parking: z.string().optional(),
    transport: z.string().optional(),
  })
  .passthrough();

export type LocationContent = z.infer<typeof locationContentSchema>;

export const locationDefaultContent: LocationContent = {};
