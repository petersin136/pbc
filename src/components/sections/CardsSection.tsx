"use client";

import { Section } from "@/lib/supabase/sections";
import Link from "next/link";

/**
 * Cards 섹션 컴포넌트
 * - 그리드 레이아웃
 * - 링크 가능한 카드
 */
export default function CardsSection({ section }: { section: Section }) {
  const { cards } = section.content;

  if (!Array.isArray(cards) || cards.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          {section.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card: { icon?: string; title?: string; description?: string; link?: { text?: string; href?: string }; href?: string }, index: number) => (
            <Link
              key={index}
              href={(typeof card.link === 'object' ? card.link.href : card.link) || card.href || "#"}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* 아이콘 */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {card.icon ? (
                  <span className="text-3xl">{card.icon}</span>
                ) : (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                )}
              </div>

              {/* 제목 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>

              {/* 설명 */}
              <p className="text-gray-600 leading-relaxed">
                {card.description}
              </p>

              {/* 화살표 */}
              <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                <span className="text-sm">자세히 보기</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

