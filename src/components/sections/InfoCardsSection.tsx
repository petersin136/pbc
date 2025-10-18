"use client";

import { Section } from "@/lib/supabase/sections";
import Link from "next/link";
import { useState } from "react";

// 유튜브 ID 추출 함수
function getYouTubeID(url: string): string | null {
  if (!url) return null;
  
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export default function InfoCardsSection({ section }: { section: Section }) {
  const {
    cards = [],
  } = section.content;

  const [activeSermonTab, setActiveSermonTab] = useState(0);

  const sermonCard = cards[0];
  const infoCard = cards[1];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#E8E2DA] min-h-screen flex items-center">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="max-w-[1600px] mx-auto">
          {/* 두 개의 카드를 나란히 배치 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
            {/* 왼쪽 카드: 말씀 영상 */}
            {sermonCard && (
              <div className="bg-white rounded-2xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden h-full">
                <div className="p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col h-full">
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {sermonCard.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      하나님의 말씀을 온라인으로 만나보세요.
                    </p>
                  </div>

                  {/* 유튜브 임베드 */}
                  {sermonCard.sermons && sermonCard.sermons.length > 0 && (
                    <div className="space-y-4 flex-grow">
                      {/* 탭 */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {sermonCard.sermons.map((sermon: { category: string; youtubeUrl: string; title?: string }, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSermonTab(idx)}
                            className={`px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-full transition-all duration-300 ${
                              activeSermonTab === idx
                                ? "bg-gray-900 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {sermon.category}
                          </button>
                        ))}
                      </div>
                      
                      {/* 유튜브 */}
                      {sermonCard.sermons[activeSermonTab] && sermonCard.sermons[activeSermonTab].youtubeUrl && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeID(sermonCard.sermons[activeSermonTab].youtubeUrl)}`}
                            title={sermonCard.sermons[activeSermonTab].category}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 버튼 */}
                  {sermonCard.link && (
                    <div className="mt-6">
                      <Link
                        href={sermonCard.link.href || "#"}
                        className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {sermonCard.link.text || "전체 설교 보기"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 오른쪽 카드: 예배 안내 */}
            {infoCard && (
              <div className="bg-white rounded-2xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden h-full">
                <div className="p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col h-full">
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {infoCard.title}
                    </h3>
                  </div>

                  {infoCard.description && (
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                      {infoCard.description}
                    </p>
                  )}

                  {/* 정보 그리드 */}
                  {infoCard.items && infoCard.items.length > 0 && (
                    <div className="grid grid-cols-2 gap-5 sm:gap-6 md:gap-8 flex-grow">
                      {infoCard.items.map((item: { icon?: string; label: string; value: string }, idx: number) => (
                        <div key={idx} className="space-y-3 p-5 sm:p-6 bg-gray-50 rounded-xl">
                          <div className="text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                            {item.label}
                          </div>
                          <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 버튼 */}
                  {infoCard.link && (
                    <div className="mt-8">
                      <Link
                        href={infoCard.link.href || "#"}
                        className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {infoCard.link.text || "오시는 길"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
