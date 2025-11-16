"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface GreetingSectionProps {
  name: string;
  photo: string;
  backgroundImage: string;
  quote: string;
  mainText: string;
  detailText: string;
  bodyText: string;
}

export default function GreetingSection({
  name,
  photo,
  backgroundImage,
  quote,
  mainText,
  detailText,
  bodyText,
}: GreetingSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-screen">
      {/* 헤더 타이틀 */}
      <div className="bg-white py-4 pt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            담임목사
          </h1>
        </div>
      </div>

      {/* 히어로 섹션 - 모바일 극단적 최적화 */}
      <div className="relative min-h-[600px] sm:min-h-[700px] md:h-[450px] overflow-visible">
        {/* 배경 이미지 - 모바일 최적화 */}
        <div 
          className="absolute inset-0 bg-fixed"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
        </div>

        {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
        <div className="relative container mx-auto px-4 h-full flex items-end justify-end z-10">
          <div className="relative w-full flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 md:gap-8 pb-8 sm:pb-12 md:pb-0 md:translate-y-[25%]">
            
            {/* 목사님 사진 - 모바일에서 크기 대폭 축소 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0 z-20 order-1 md:order-none"
            >
              <div className="relative group">
                {/* 모바일: 크기 증가, 태블릿: 중간, 데스크톱: 크게 */}
                <div className="relative w-40 h-52 sm:w-48 sm:h-64 md:w-72 md:h-[450px] transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                <div className="text-center mt-1">
                  <p
                    className="text-xl sm:text-2xl md:text-4xl font-bold text-white md:text-gray-900"
                    style={{
                      letterSpacing: "0.2em",
                    }}
                  >
                    박상구 목사
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 인사말 카드 - 모바일 최적화 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 z-10 w-full md:-translate-y-10 order-2 md:order-none"
            >
              {/* 모바일: 카드 크기 증가 */}
              <div className="bg-blue-500/30 backdrop-blur-lg rounded-xl sm:rounded-2xl px-6 py-6 sm:px-7 sm:py-7 md:px-5 md:py-5 lg:px-6 shadow-xl min-h-[280px] sm:min-h-[320px] md:h-[380px] flex flex-col justify-center">
                
                {/* 제목 - 모바일 폰트 크게 */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 sm:mb-5 md:mb-5 leading-snug" 
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.5)' }}>
                  {mainText}
                </h2>
                
                {/* 본문 - 모바일 폰트 크게 */}
                <div className="space-y-2 sm:space-y-3 md:space-y-3 text-white text-lg sm:text-xl md:text-2xl lg:text-2xl leading-relaxed overflow-hidden md:max-w-4xl lg:max-w-5xl xl:max-w-6xl md:mx-auto" 
                     style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)' }}>
                  {detailText.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="sm:line-clamp-none">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 하단 인용구 섹션 - 모바일 최적화 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative bg-gray-200 pt-16 sm:pt-32 md:pt-56 pb-8 sm:pb-12 md:pb-20 overflow-hidden"
      >
        {/* 배경 이미지 */}
        <div 
          className="absolute top-8 sm:top-16 md:top-32 left-0 right-0 bottom-0 opacity-20"
          style={{
            backgroundImage: 'url(https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/air1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-[1400px] mx-auto">
            {/* 모바일 폰트 크게 */}
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-relaxed whitespace-pre-line mx-auto">
              {quote}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* 하단 상세 본문 섹션 - 모바일 최적화 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative bg-white py-8 sm:py-12 md:py-20 overflow-hidden"
      >
        {/* 옅은 배경 이미지 */}
        <div 
          className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 bottom-0 opacity-10"
          style={{
            backgroundImage: 'url(https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 md:space-y-8">
            
            {/* 본문 - 모바일 폰트 크게 */}
            <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed">
              포천중앙침례교회는 이 시대의 어둠 속에서도 빛과 소금으로서의 사명을 감당하며, 믿음의 다음 세대를 세우고,
            </p>
            <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed">
              지역 사회를 품는 복음적 교회로 서 가고자 합니다.
            </p>
            <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed">
              여러분 한 분 한 분이 이 공동체의 귀한 지체로서 예배와 말씀, 사랑과 섬김 안에서 하나님 나라의 기쁨을 함께 누리시길 바랍니다.
            </p>
            <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed">
              주님 안에서 여러분의 삶이 날마다 새로워지고, 하나님의 은혜가 가정과 일터 위에 충만히 임하기를 기도합니다.
            </p>
            <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed">
              감사합니다.
            </p>
            
            {/* 서명 - 모바일 폰트 크게 */}
            <div className="mt-8 sm:mt-10 md:mt-12 text-right space-y-2 sm:space-y-3">
              <p className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed">
                포천중앙침례교회
              </p>
              <p className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed">
                담임목사 박상구 드림
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

