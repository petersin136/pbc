import { z } from "zod";

export const contactContentSchema = z.object({}).passthrough();

export type ContactContent = z.infer<typeof contactContentSchema>;

export const contactDefaultContent: ContactContent = {};
