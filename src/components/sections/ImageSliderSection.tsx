"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

/**
 * ImageSlider 섹션 컴포넌트
 * - 전체 너비 이미지 슬라이더
 * - 3초마다 자동 전환
 * - 좌우 화살표, 인디케이터
 * - 세련된 페이드 효과
 */
export default function ImageSliderSection({ section }: { section: Section }) {
  const {
    images = [],
    backgroundImage,
    autoPlayInterval = 3000,
    showArrows = true,
    showIndicators = true,
    height = "600px",
  } = section.content;

  // images 배열이 없으면 backgroundImage를 사용
  let imageList = images;
  if ((!images || images.length === 0) && backgroundImage) {
    imageList = [{ url: backgroundImage, alt: section.title || "이미지" }];
  }

  // URL이 있는 이미지만 필터링
  const validImages = imageList.filter((img: { url: string }) => img.url && img.url.trim() !== '');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  // 다음 슬라이드로
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  // 이전 슬라이드로
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // 특정 슬라이드로
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  // 자동 재생
  useEffect(() => {
    if (!isAutoPlaying || validImages.length <= 1) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, validImages.length, autoPlayInterval, goToNext]);

  // 이미지가 하나도 없으면 null 반환
  if (!imageList || imageList.length === 0) {
    return null;
  }

  // 유효한 이미지가 없으면 placeholder 표시
  if (validImages.length === 0) {
    return (
      <section 
        className="relative w-full overflow-hidden bg-gray-900 border-t-[24px] border-b-[24px] border-gray-900"
        style={{ borderColor: '#000000' }}
      >
        <div className="relative w-full aspect-video sm:aspect-video md:h-[500px] lg:h-[600px] xl:h-[750px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400">
            <svg className="w-24 h-24 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-300 mb-2">이미지 슬라이더</p>
            <p className="text-sm text-gray-500">이미지를 추가해주세요</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative w-full overflow-hidden bg-gray-900 border-t-[24px] border-b-[24px] border-gray-900"
      style={{ borderColor: '#000000' }}
    >
      {/* 이미지 컨테이너 - 모바일: aspect-video, 데스크톱: 고정 높이 */}
      <div className="relative w-full aspect-video sm:aspect-video md:h-[500px] lg:h-[600px] xl:h-[750px]">
        {validImages.map((image: { url: string; alt?: string; caption?: string }, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            {!imageErrors[index] ? (
              <>
                {/* 이미지 */}
                <Image
                  src={image.url}
                  alt={image.alt || `슬라이드 ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                />
                
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* 캡션 */}
                {image.caption && index === currentIndex && (
                  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 md:p-16">
                    <div className="container mx-auto max-w-7xl">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 animate-fade-in-up"
                          style={{ 
                            textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)',
                            animationDelay: '0.3s',
                            opacity: 0,
                            animationFillMode: 'forwards'
                          }}>
                        {image.caption}
                      </h3>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-400">
                <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">이미지를 불러올 수 없습니다</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 화살표 버튼 */}
      {showArrows && validImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 shadow-2xl hover:scale-110 group z-10"
            aria-label="이전 이미지"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 shadow-2xl hover:scale-110 group z-10"
            aria-label="다음 이미지"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {showIndicators && validImages.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
          {validImages.map((_: unknown, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentIndex
                  ? "w-12 sm:w-16 h-2 sm:h-2.5 bg-white shadow-lg"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

