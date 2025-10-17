"use client";

import { Section } from "@/lib/supabase/sections";
import Link from "next/link";

/**
 * Hero 섹션 컴포넌트
 * - 전체 화면 배경
 * - 중앙 텍스트 오버레이
 * - CTA 버튼
 */
export default function HeroSection({ section }: { section: Section }) {
  const {
    heading = "포천중앙침례교회",
    subheading = "하나님의 사랑과 은혜가 가득한 곳",
    backgroundImage,
    backgroundVideo,
    buttons = [],
    verse,
    verseReference,
    verseEn,
  } = section.content;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      )}

      {/* 오버레이 (더 어둡게) */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in-up leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7)' }}>
          {heading}
        </h1>
        {subheading && (
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl mb-8 md:mb-12 text-gray-50 font-light animate-fade-in-up animation-delay-200" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9), 0 1px 5px rgba(0,0,0,0.7)' }}>
            {subheading}
          </p>
        )}

        {/* CTA 버튼 */}
        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-up animation-delay-400">
            {buttons.map((button: { text?: string; label?: string; href?: string }, index: number) => (
              <Link
                key={index}
                href={button.href || "#"}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  index === 0
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-white/20 border-2 border-white text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                {button.text || button.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 성경 구절 (오른쪽 하단) */}
      {(verse || verseEn) && (
        <div className="absolute bottom-20 sm:bottom-16 md:bottom-12 left-4 right-4 md:left-auto md:right-12 text-center md:text-right text-white animate-fade-in-up animation-delay-400">
          {/* 한글 구절 */}
          {verse && (
            <p 
              className="text-[11px] sm:text-xs md:text-base lg:text-lg leading-relaxed mb-1.5 md:mb-2 md:whitespace-nowrap px-2 md:px-0"
              style={{ 
                textShadow: '0 3px 15px rgba(0,0,0,0.95), 0 1px 5px rgba(0,0,0,0.8)',
                fontFamily: "'Gowun Batang', 'Nanum Myeongjo', 'Georgia', serif",
                fontWeight: 400,
                letterSpacing: '0.05em'
              }}
            >
              {verse}
            </p>
          )}
          
          {/* 영어 구절 */}
          {verseEn && (
            <p 
              className="text-[9px] sm:text-[10px] md:text-sm lg:text-base leading-relaxed mb-1.5 md:mb-3 opacity-90 px-2 md:px-0"
              style={{ 
                textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontWeight: 300,
                fontStyle: 'italic',
                letterSpacing: '0.01em'
              }}
            >
              {verseEn}
            </p>
          )}
          
          {/* 출처 (한글만) */}
          {verseReference && (
            <p 
              className="text-[8px] sm:text-[9px] md:text-xs opacity-75"
              style={{ 
                textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              {verseReference}
            </p>
          )}
        </div>
      )}

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

