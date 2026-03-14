"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * Text 섹션 컴포넌트
 * - 텍스트 콘텐츠와 선택적 배경 이미지
 */
export default function TextSection({ section }: { section: Section }) {
  const content = section.content;
  const text = (content.text || content.description) as string | undefined;
  const heading = (content.heading || section.title) as string | undefined;
  const subheading = content.subheading as string | undefined;
  const alignment = (content.alignment || "center") as string;
  const backgroundImage = content.backgroundImage as string | undefined;

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* 배경 이미지 (있을 경우) */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt={heading || "배경"}
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 z-0" />
        </>
      )}

      {/* 콘텐츠 */}
      <div
        className={`container mx-auto max-w-4xl relative z-10 ${
          alignment === "center" ? "text-center" : "text-left"
        }`}
      >
        {/* 제목 */}
        {heading && (
          <h2 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 ${
            backgroundImage ? "text-white drop-shadow-lg" : "text-gray-900"
          }`}>
            {heading}
          </h2>
        )}

        {/* 부제목 */}
        {subheading && (
          <p className={`text-xl md:text-2xl lg:text-3xl mb-8 ${
            backgroundImage ? "text-white/90 drop-shadow-lg" : "text-gray-600"
          }`}>
            {subheading}
          </p>
        )}

        {/* 본문 텍스트 */}
        {text && (
          <div
            className={`prose prose-xl md:prose-2xl max-w-none leading-relaxed whitespace-pre-line text-lg md:text-xl lg:text-2xl ${
              backgroundImage 
                ? "text-white/95 drop-shadow-lg prose-invert" 
                : "text-gray-700"
            }`}
          >
            {text}
          </div>
        )}

        {/* 텍스트가 없으면 경고 표시 */}
        {!text && !heading && !subheading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              ⚠️ 텍스트 내용이 없습니다. 관리자 페이지에서 내용을 추가해주세요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

