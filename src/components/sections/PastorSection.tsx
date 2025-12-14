"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

export default function PastorSection({ section }: { section: Section }) {
  const {
    name = "담임목사",
    position = "담임목사",
    image,
    greeting = "",
  } = section.content;

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title || "목사 인사말"}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* 프로필 이미지 */}
            {image && (
              <div className="md:col-span-1 animate-fade-in-up">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={image as string}
                    alt={name as string}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{name as string}</h3>
                  <p className="text-lg text-gray-600 mt-2">{position as string}</p>
                </div>
              </div>
            )}

            {/* 인사말 내용 (HTML 렌더링) */}
            <div className={`${image ? "md:col-span-2" : "md:col-span-3"} animate-fade-in-up animation-delay-200`}>
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: greeting as string }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

