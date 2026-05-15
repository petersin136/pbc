import type { z } from "zod";

export type BlockCategory = "hero" | "content" | "department" | "media" | "community";

/**
 * 블록 카탈로그 메타데이터 + Zod 스키마 (SSOT)
 */
export type BlockDefinition<TContent = unknown> = {
  kind: string;
  label: string;
  description: string;
  /** lucide-react 아이콘 이름 (문자열). UI에서 매핑 가능 */
  icon?: string;
  schema: z.ZodType<TContent>;
  defaultContent: TContent;
  category: BlockCategory;
  /** true면 신규 생성 UI에서 숨기거나 차단 (기존 DB 행은 유지) */
  deprecated?: boolean;
};

export type AnyBlockDefinition = BlockDefinition<unknown>;
