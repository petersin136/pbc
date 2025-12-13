"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * 공지사항 섹션 컴포넌트
 */
export default function NoticesSection({ section }: { section: Section }) {
  const {
    description = "",
    notices = [],
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
                  <div className="w-20 h-1 bg-blue-400"></div>
                </div>
              </div>
            </div>
          ) : (
            /* 헤더 이미지가 없을 때는 일반 헤더 */
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
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

          {/* 공지사항 목록 */}
          {notices && notices.length > 0 ? (
            <div className="space-y-6 animate-fade-in-up animation-delay-200">
              {[...notices]
                .sort((a: { date: string }, b: { date: string }) => {
                  // 날짜 기준 내림차순 정렬 (최신이 위로)
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                })
                .map((notice: { title: string; date: string; content: string }, index: number) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 ${
                    notice.important ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {notice.important && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              중요
                            </span>
                          )}
                          {notice.category && (
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                              {notice.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {notice.title}
                        </h3>
                      </div>
                    </div>
                    {notice.content && (
                      <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                        {notice.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {notice.date && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {notice.date}
                        </div>
                      )}
                      {notice.author && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {notice.author}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">등록된 공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

