"use client";

import { Section } from "@/lib/supabase/sections";

/**
 * Text 섹션 컴포넌트
 * - 리치 텍스트 콘텐츠
 */
export default function TextSection({ section }: { section: Section }) {
  const { text = "", alignment = "center" } = section.content;

  return (
    <section className="py-20 px-4 bg-white">
      <div
        className={`container mx-auto max-w-4xl ${
          alignment === "center" ? "text-center" : "text-left"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </section>
  );
}

