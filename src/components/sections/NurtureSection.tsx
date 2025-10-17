"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";
import Link from "next/link";

/**
 * 양육 섹션 컴포넌트
 * - 양육 프로그램 소개
 * - 커리큘럼
 * - 신청 안내
 */
export default function NurtureSection({ section }: { section: Section }) {
  const {
    programName = "양육 프로그램",
    description = "",
    color = "orange",
    curriculum = [],
    image,
    applicationInfo = {},
    benefits = []
  } = section.content;

  // 색상 매핑
  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      accent: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      accent: "bg-purple-600",
      text: "text-purple-600",
      border: "border-purple-200"
    },
    green: {
      gradient: "from-green-500 to-green-600",
      accent: "bg-green-600",
      text: "text-green-600",
      border: "border-green-200"
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      accent: "bg-orange-600",
      text: "text-orange-600",
      border: "border-orange-200"
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.orange;

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

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* 이미지 */}
            {image && (
              <div className="animate-fade-in-up animation-delay-200">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={image}
                    alt={programName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* 혜택/특징 */}
            {benefits && benefits.length > 0 && (
              <div className="animate-fade-in-up animation-delay-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  프로그램 특징
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit: string, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border-l-4 ${colors.border}`}
                    >
                      <svg
                        className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-gray-700 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 커리큘럼 */}
          {curriculum && curriculum.length > 0 && (
            <div className="mb-16 animate-fade-in-up animation-delay-400">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                커리큘럼
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {curriculum.map((item: { week?: number; title: string; description: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-lg">
                          {item.week || `${index + 1}주차`}
                        </h4>
                      </div>
                    </div>
                    <div className="p-6">
                      <h5 className="font-bold text-gray-900 mb-2">
                        {item.title}
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 신청 안내 */}
          {applicationInfo && Object.keys(applicationInfo).length > 0 && (
            <div className="animate-fade-in-up animation-delay-600">
              <div className={`bg-gradient-to-r ${colors.gradient} text-white rounded-2xl shadow-2xl p-8 md:p-12`}>
                <h3 className="text-3xl font-bold mb-6 text-center">
                  신청 안내
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {applicationInfo.period && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        진행 기간
                      </h4>
                      <p className="text-white/90">{applicationInfo.period}</p>
                    </div>
                  )}
                  {applicationInfo.schedule && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        일시
                      </h4>
                      <p className="text-white/90">{applicationInfo.schedule}</p>
                    </div>
                  )}
                  {applicationInfo.location && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        장소
                      </h4>
                      <p className="text-white/90">{applicationInfo.location}</p>
                    </div>
                  )}
                  {applicationInfo.contact && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        문의
                      </h4>
                      <p className="text-white/90">{applicationInfo.contact}</p>
                    </div>
                  )}
                </div>
                {applicationInfo.registrationUrl && (
                  <div className="text-center">
                    <Link
                      href={applicationInfo.registrationUrl}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      신청하기
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

