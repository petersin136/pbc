"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * Image 섹션 컴포넌트
 * 단일 이미지를 전체 너비로 표시
 */
export default function ImageSection({ section }: { section: Section }) {
  // 여러 가지 필드 이름을 지원 (호환성)
  const content = section.content;
  const imageUrl = (content.backgroundImage || content.src || content.image || content.url) as string;
  const alt = (content.alt || section.title) as string;
  const caption = content.caption as string | undefined;
  const heading = content.heading as string | undefined;
  const subheading = content.subheading as string | undefined;
  const description = content.description as string | undefined;

  if (!imageUrl) {
    return (
      <section className="py-12 px-4 bg-yellow-50">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-yellow-800">⚠️ 이미지 URL이 없습니다. 관리자 페이지에서 이미지를 업로드해주세요.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* 제목 영역 */}
        {(section.title || heading) && (
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gray-900">
              {section.title || heading}
            </h2>
            {subheading && (
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-4">
                {subheading}
              </p>
            )}
            {description && (
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 이미지 */}
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </div>

        {/* 캡션 */}
        {caption && (
          <p className="text-center text-gray-600 mt-6 text-lg md:text-xl lg:text-2xl italic">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}

