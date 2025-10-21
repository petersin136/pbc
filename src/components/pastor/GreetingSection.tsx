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
      <div className="bg-white py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            담임목사
          </h1>
        </div>
      </div>

      {/* 히어로 섹션 - 배경 이미지 + 목사님 사진 + 인사말 */}
      <div className="relative h-[380px] md:h-[450px] overflow-visible">
        {/* 배경 이미지 - 고정 효과 (Parallax) */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
        </div>

        {/* 컨텐츠 - 하단 정렬, 둘 다 박스 밖으로 튀어나오게 */}
        <div className="relative container mx-auto px-4 h-full flex items-end z-10">
          <div className="relative w-full flex flex-col md:flex-row items-end gap-6 md:gap-8 pb-0 translate-y-[25%]">
            {/* 좌측: 목사님 사진 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0 z-20"
            >
              <div className="relative group">
                <div className="relative w-52 h-[320px] md:w-72 md:h-[450px] transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* 우측: 인사말 카드 - 같은 높이로 맞춤 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 z-10"
            >
              <div className="bg-blue-400/70 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-xl min-h-[320px] md:min-h-[450px] flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-snug">
                  {mainText}
                </h2>
                <div className="space-y-2 md:space-y-3 text-white text-base md:text-lg lg:text-xl leading-relaxed">
                  {detailText.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 하단 인용구 섹션 - 옅은 배경 이미지 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative bg-gray-50 pt-56 md:pt-64 pb-20 overflow-hidden"
      >
        {/* 옅은 배경 이미지 */}
        <div 
          className="absolute top-32 left-0 right-0 bottom-0 opacity-10"
          style={{
            backgroundImage: 'url(https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/air1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center leading-relaxed whitespace-pre-line">
              {quote}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* 하단 상세 본문 섹션 - 옅은 배경 이미지 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative bg-white py-20 overflow-hidden"
      >
        {/* 옅은 배경 이미지 */}
        <div 
          className="absolute top-8 left-0 right-0 bottom-0 opacity-5"
          style={{
            backgroundImage: 'url(https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/air1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {bodyText.split("\n\n").map((paragraph, index) => {
                // 마지막 문단(서명)인 경우
                if (paragraph.includes("담임목사 박상구 드림")) {
                  return (
                    <p key={index} className="text-gray-900 text-2xl md:text-3xl font-bold mb-8 mt-12 text-right whitespace-pre-line" style={{ lineHeight: '2.5' }}>
                      {paragraph}
                    </p>
                  );
                }
                // 일반 문단
                return (
                  <p key={index} className="text-gray-700 text-xl mb-8 whitespace-pre-line" style={{ lineHeight: '2.5' }}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

