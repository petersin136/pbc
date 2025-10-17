"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * 교육부서 섹션 컴포넌트
 * - 부서 소개
 * - 프로그램 테이블
 * - 이미지
 */
export default function DepartmentSection({ section }: { section: Section }) {
  const {
    departmentName = "부서명",
    description = "",
    color = "blue",
    programs = [],
    image,
    contact = {}
  } = section.content;

  // 색상 매핑
  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      accent: "bg-blue-600",
      hover: "hover:bg-blue-700"
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      accent: "bg-purple-600",
      hover: "hover:bg-purple-700"
    },
    green: {
      gradient: "from-green-500 to-green-600",
      accent: "bg-green-600",
      hover: "hover:bg-green-700"
    },
    pink: {
      gradient: "from-pink-500 to-pink-600",
      accent: "bg-pink-600",
      hover: "hover:bg-pink-700"
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      accent: "bg-orange-600",
      hover: "hover:bg-orange-700"
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

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

          {/* 이미지 */}
          {image && (
            <div className="mb-16 animate-fade-in-up animation-delay-200">
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={image}
                  alt={departmentName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* 프로그램 테이블 */}
          {programs && programs.length > 0 && (
            <div className="mb-16 animate-fade-in-up animation-delay-400">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                프로그램 안내
              </h3>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`bg-gradient-to-r ${colors.gradient} text-white`}>
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">프로그램명</th>
                        <th className="px-6 py-4 text-left font-semibold">시간</th>
                        <th className="px-6 py-4 text-left font-semibold">장소</th>
                        <th className="px-6 py-4 text-left font-semibold">담당</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program: any, index: number) => (
                        <tr 
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {program.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {program.time}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {program.place}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {program.leader || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 연락처 */}
          {contact && Object.keys(contact).length > 0 && (
            <div className="text-center animate-fade-in-up animation-delay-600">
              <div className="inline-block bg-gray-100 rounded-xl px-8 py-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">문의하기</h4>
                {contact.name && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">담당:</span> {contact.name}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">전화:</span> {contact.phone}
                  </p>
                )}
                {contact.email && (
                  <p className="text-gray-700">
                    <span className="font-medium">이메일:</span> {contact.email}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

