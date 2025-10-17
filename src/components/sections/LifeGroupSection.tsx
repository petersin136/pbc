"use client";

import { Section } from "@/lib/supabase/sections";
import { useState } from "react";

/**
 * 목장 섹션 컴포넌트
 * - 1-9목장 카드 형식
 * - 목장 리더, 모임 정보
 * - 목원 명단
 */
export default function LifeGroupSection({ section }: { section: Section }) {
  const {
    description = "",
    lifegroups = []
  } = section.content;

  const [selectedGroup, setSelectedGroup] = useState<{ number: number; leader: string; members: string[]; meetingDay?: string; location?: string } | null>(null);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            {description && (
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
                {description}
              </p>
            )}
          </div>

          {/* 목장 그리드 */}
          {lifegroups && lifegroups.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up animation-delay-200">
              {lifegroups.map((group: { number: number; leader: string; members: string[]; meetingDay?: string; location?: string }, index: number) => {
                // 목장별 색상 그라디언트
                const colors = [
                  "from-red-500 to-orange-500",
                  "from-orange-500 to-yellow-500",
                  "from-yellow-500 to-green-500",
                  "from-green-500 to-teal-500",
                  "from-teal-500 to-blue-500",
                  "from-blue-500 to-indigo-500",
                  "from-indigo-500 to-purple-500",
                  "from-purple-500 to-pink-500",
                  "from-pink-500 to-rose-500"
                ];
                const gradient = colors[index % colors.length];

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group"
                    onClick={() => setSelectedGroup(group)}
                  >
                    {/* 헤더 (목장 번호) */}
                    <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-3xl font-bold">
                            {group.number}목장
                          </h3>
                          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        {group.name && (
                          <p className="text-white/90 text-sm font-medium">
                            &quot;{group.name}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 목장 정보 */}
                    <div className="p-6">
                      {/* 리더 정보 */}
                      {group.leader && (
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">목장 리더</p>
                            <p className="text-gray-900 font-semibold">{group.leader}</p>
                          </div>
                        </div>
                      )}

                      {/* 모임 정보 */}
                      <div className="space-y-3 mb-4">
                        {group.schedule && (
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">모임 시간</p>
                              <p className="text-gray-700 text-sm">{group.schedule}</p>
                            </div>
                          </div>
                        )}
                        {group.location && (
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">모임 장소</p>
                              <p className="text-gray-700 text-sm">{group.location}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 목원 수 */}
                      {group.members && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-600">목원 수</span>
                          <span className="text-lg font-bold text-gray-900">
                            {Array.isArray(group.members) ? group.members.length : group.members}명
                          </span>
                        </div>
                      )}

                      {/* 더보기 버튼 */}
                      <button className="mt-4 w-full py-2 text-center text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        자세히 보기
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 text-lg">등록된 목장이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 목장 상세 모달 */}
      {selectedGroup && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedGroup(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 md:p-8 rounded-t-3xl">
              <button
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setSelectedGroup(null)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-3xl font-bold mb-2">
                {selectedGroup.number}목장
              </h3>
              {selectedGroup.name && (
                <p className="text-white/90 text-lg">&quot;{selectedGroup.name}&quot;</p>
              )}
            </div>

            {/* 모달 콘텐츠 */}
            <div className="p-6 md:p-8">
              {/* 목장 소개 */}
              {selectedGroup.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedGroup.description}
                  </p>
                </div>
              )}

              {/* 리더 정보 */}
              {selectedGroup.leader && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    목장 리더
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900 mb-2">{selectedGroup.leader}</p>
                    {selectedGroup.leaderPhone && (
                      <a href={`tel:${selectedGroup.leaderPhone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedGroup.leaderPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 모임 정보 */}
              <div className="mb-6 grid md:grid-cols-2 gap-4">
                {selectedGroup.schedule && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <p className="text-xs text-blue-600 font-semibold mb-1">모임 시간</p>
                    <p className="text-gray-900 font-medium">{selectedGroup.schedule}</p>
                  </div>
                )}
                {selectedGroup.location && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <p className="text-xs text-purple-600 font-semibold mb-1">모임 장소</p>
                    <p className="text-gray-900 font-medium">{selectedGroup.location}</p>
                  </div>
                )}
              </div>

              {/* 목원 명단 */}
              {selectedGroup.members && Array.isArray(selectedGroup.members) && selectedGroup.members.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    목원 명단 ({selectedGroup.members.length}명)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedGroup.members.map((member: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-600">
                            {member.substring(0, 1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 font-medium truncate">
                          {member}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

