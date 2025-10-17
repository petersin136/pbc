"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * Image 섹션 컴포넌트
 */
export default function ImageSection({ section }: { section: Section }) {
  const { src = "", alt = "", caption = "" } = section.content;

  if (!src) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
          {section.title}
        </h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={src}
            alt={alt || section.title}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </div>
        {caption && (
          <p className="text-center text-gray-600 mt-4 italic">{caption}</p>
        )}
      </div>
    </section>
  );
}

