"use client";

import { Section } from "@/lib/supabase/sections";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    images = [],
    autoPlayInterval = 5000,
  } = section.content;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSermonTab, setActiveSermonTab] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const sermonCard = cards[0];
  const infoCard = cards[1];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#E8E2DA]">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* 흰색 카드 컨테이너 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-12 lg:p-16 space-y-8 sm:space-y-12 md:space-y-16">
              {/* 상단: 말씀영상 + 이미지 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-stretch">
                {/* 왼쪽: 말씀 영상 */}
                {sermonCard && (
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {sermonCard.title}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                        하나님의 말씀을 온라인으로 만나보세요.
                      </p>
                    </div>

                    {/* 유튜브 임베드 */}
                    {sermonCard.sermons && sermonCard.sermons.length > 0 && (
                      <div className="space-y-3 sm:space-y-4">
                        {/* 탭 */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {sermonCard.sermons.map((sermon: { category: string; youtubeUrl: string; title?: string }, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSermonTab(idx)}
                              className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
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
                          <div className="relative w-full aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
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
                      <Link
                        href={sermonCard.link.href || "#"}
                        className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {sermonCard.link.text || "전체 설교 보기"}
                      </Link>
                    )}
                  </div>
                )}

                {/* 오른쪽: 이미지 */}
                {images && images.length > 0 ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <div className="relative w-full aspect-video bg-gray-100">
                      {images.map((image: { url: string; alt?: string }, index: number) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-700 ${
                            index === currentImageIndex ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {!imageErrors[index] ? (
                            <Image
                              src={image.url}
                              alt={image.alt || `슬라이드 ${index + 1}`}
                              fill
                              className="object-cover"
                              priority={index === 0}
                              onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                              <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm">이미지를 불러올 수 없습니다</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 화살표 */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 shadow-lg"
                          aria-label="이전"
                        >
                          <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 shadow-lg"
                          aria-label="다음"
                        >
                          <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* 인디케이터 */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_: { url: string; alt?: string }, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`transition-all duration-300 rounded-full ${
                              index === currentImageIndex
                                ? "w-8 h-2 bg-white"
                                : "w-2 h-2 bg-white/60 hover:bg-white/80"
                            }`}
                            aria-label={`슬라이드 ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-gray-50 shadow-lg">
                    <div className="relative w-full aspect-video flex flex-col items-center justify-center p-12 text-center">
                      <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">이미지를 추가해주세요</h3>
                      <p className="text-sm text-gray-500 mb-6">관리자 페이지에서 교회 사진을 추가할 수 있습니다</p>
                      <Link 
                        href="/admin/sections"
                        className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                      >
                        이미지 추가하기
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200"></div>

              {/* 하단: 예배 안내 */}
              {infoCard && (
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {infoCard.title}
                    </h3>
                  </div>

                  {infoCard.description && (
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
                      {infoCard.description}
                    </p>
                  )}

                  {/* 정보 그리드 */}
                  {infoCard.items && infoCard.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                      {infoCard.items.map((item: { icon?: string; label: string; value: string }, idx: number) => (
                        <div key={idx} className="space-y-1 sm:space-y-2 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                          <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            {item.label}
                          </div>
                          <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 버튼 */}
                  {infoCard.link && (
                    <Link
                      href={infoCard.link.href || "#"}
                      className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {infoCard.link.text || "오시는 길"}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
