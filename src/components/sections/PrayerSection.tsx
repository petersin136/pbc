"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * 기도제목 섹션 컴포넌트
 */
export default function PrayerSection({ section }: { section: Section }) {
  const {
    description = "",
    prayers = [],
    headerImage
  } = section.content;

  const hasHeaderImage = headerImage && (headerImage as string).trim() !== "";

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 이미지 (있는 경우에만 표시) */}
          {hasHeaderImage ? (
            <div className="mb-12 animate-fade-in-up">
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={headerImage as string}
                  alt={section.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                    {section.title}
                  </h2>
                  <div className="w-20 h-1 bg-purple-400"></div>
                </div>
              </div>
            </div>
          ) : (
            /* 헤더 이미지가 없을 때는 일반 헤더 */
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="w-20 h-1 bg-purple-600 mx-auto mb-8"></div>
            </div>
          )}

          {/* 설명 */}
          {description && (
            <div className="text-center mb-16 animate-fade-in-up animation-delay-200">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* 기도제목 목록 */}
          {prayers && prayers.length > 0 ? (
            <div className="space-y-6 animate-fade-in-up animation-delay-200">
              {prayers.map((prayer: { title: string; content: string; date: string }, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-purple-500 hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {prayer.category && (
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                            {prayer.category}
                          </span>
                        )}
                        {prayer.urgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            긴급
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {prayer.title}
                      </h3>
                      {prayer.content && (
                        <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                          {prayer.content}
                        </p>
                      )}
                      {prayer.verse && (
                        <div className="bg-white/70 rounded-lg p-4 border-l-2 border-purple-300 mb-4">
                          <p className="text-sm text-gray-600 italic leading-relaxed">
                            &quot;{prayer.verse}&quot;
                          </p>
                          {prayer.verseRef && (
                            <p className="text-xs text-gray-500 mt-2 text-right">
                              - {prayer.verseRef}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {prayer.date && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {prayer.date}
                          </div>
                        )}
                        {prayer.requestedBy && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {prayer.requestedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg">등록된 기도제목이 없습니다.</p>
            </div>
          )}

          {/* 기도 요청 안내 */}
          <div className="mt-12 text-center animate-fade-in-up animation-delay-400">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold mb-3">기도 제목을 나누고 싶으신가요?</h3>
              <p className="text-purple-100 mb-6">
                교회 공동체와 함께 기도하고 싶은 제목이 있으시다면 언제든지 나눠주세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:031-1234-5678"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  전화하기
                </a>
                <a
                  href="mailto:prayer@pbc.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  이메일 보내기
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

