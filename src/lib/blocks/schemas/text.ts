import { z } from "zod";

const textCoreSchema = z.object({
  heading: z.string().optional(),
  subheading: z.string().optional(),
  text: z.string().optional(),
  description: z.string().optional(),
  alignment: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const textContentSchema = textCoreSchema.passthrough();

export type TextContent = z.infer<typeof textCoreSchema>;

export const textDefaultContent: TextContent = {
  heading: "",
  subheading: "",
  text: "",
  description: "",
  alignment: "center",
  backgroundImage: "",
};

export function mergeTextContent(data: TextContent): TextContent {
  const trimmed = data.alignment?.trim();
  const alignment = trimmed ? trimmed : textDefaultContent.alignment;
  return {
    ...textDefaultContent,
    ...data,
    alignment,
  };
}
