"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * 선교 섹션 컴포넌트
 * - 선교지 소개
 * - 선교사 정보
 * - 기도 제목
 */
export default function MissionSection({ section }: { section: Section }) {
  const {
    description = "",
    missionFields = [],
    missionaries = [],
    prayerRequests = [],
    color = "purple"
  } = section.content;

  // 색상 매핑
  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      accent: "bg-blue-600",
      text: "text-blue-600"
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      accent: "bg-purple-600",
      text: "text-purple-600"
    },
    teal: {
      gradient: "from-teal-500 to-teal-600",
      accent: "bg-teal-600",
      text: "text-teal-600"
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className={`w-20 h-1 ${colors.accent} mx-auto mb-8`}></div>
            {description && (
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
                {description}
              </p>
            )}
          </div>

          {/* 선교지 */}
          {missionFields && missionFields.length > 0 && (
            <div className="mb-20 animate-fade-in-up animation-delay-200">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                선교 지역
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {missionFields.map((field: { country: string; description: string; missionaries?: number }, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
                  >
                    {field.image && (
                      <div className="relative w-full h-48">
                        <Image
                          src={field.image}
                          alt={field.location}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {field.location}
                      </h4>
                      {field.ministry && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-semibold">사역:</span> {field.ministry}
                        </p>
                      )}
                      {field.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {field.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 선교사 */}
          {missionaries && missionaries.length > 0 && (
            <div className="mb-20 animate-fade-in-up animation-delay-400">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                선교사 소개
              </h3>
              <div className="space-y-6">
                {missionaries.map((missionary: { name: string; country: string; photo?: string; ministry: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    <div className="md:flex">
                      {missionary.photo && (
                        <div className="md:w-48 md:flex-shrink-0">
                          <div className="relative w-full h-64 md:h-full">
                            <Image
                              src={missionary.photo}
                              alt={missionary.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div className="p-6 md:p-8 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-1">
                              {missionary.name}
                            </h4>
                            {missionary.location && (
                              <p className={`${colors.text} font-medium flex items-center gap-1`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {missionary.location}
                              </p>
                            )}
                          </div>
                        </div>
                        {missionary.ministry && (
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                              {missionary.ministry}
                            </span>
                          </div>
                        )}
                        {missionary.description && (
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {missionary.description}
                          </p>
                        )}
                        {missionary.prayer && (
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              기도 제목
                            </h5>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {missionary.prayer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 기도 제목 */}
          {prayerRequests && prayerRequests.length > 0 && (
            <div className="animate-fade-in-up animation-delay-600">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                선교를 위한 기도 제목
              </h3>
              <div className={`bg-gradient-to-r ${colors.gradient} text-white rounded-2xl shadow-2xl p-8 md:p-12`}>
                <div className="grid md:grid-cols-2 gap-6">
                  {prayerRequests.map((request: string, index: number) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-white/95 leading-relaxed">
                        {request}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

