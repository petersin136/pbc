"use client";

import { Section } from "@/lib/supabase/sections";

/**
 * Welcome 섹션 컴포넌트
 * - 환영 메시지
 * - 교회 소개
 */
export default function WelcomeSection({ section }: { section: Section }) {
  const {
    title = "환영합니다",
    description = "",
    items = [],
  } = section.content;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
        
        {description && (
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
            {description}
          </p>
        )}

        {items && items.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {items.map((item: { icon?: string; title: string; description: string }, index: number) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {item.icon && (
                  <div className="text-4xl mb-4">{item.icon}</div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-lg md:text-xl text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

