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
                <div className="relative w-52 h-[320px] md:w-72 md:h-[450px] transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                <div className="text-center mt-1">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900" style={{ letterSpacing: '0.5em', textShadow: '0 0 1px rgba(0,0,0,0.3), 0 0 2px rgba(0,0,0,0.2)', WebkitTextStroke: '0.5px rgba(0,0,0,0.2)' }}>
                    박상구
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 우측: 인사말 카드 - 같은 높이로 맞춤 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 z-10 -translate-y-10"
            >
              <div className="bg-blue-500/30 backdrop-blur-lg rounded-2xl px-6 py-4 md:px-7 md:py-5 shadow-xl h-[260px] md:h-[380px] flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-snug" 
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.5)' }}>
                  {mainText}
                </h2>
                <div className="space-y-2 md:space-y-3 text-white text-lg md:text-xl lg:text-xl leading-relaxed" 
                     style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)' }}>
                  {detailText.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 하단 인용구 섹션 - 어두운 배경 이미지 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative bg-gray-200 pt-48 md:pt-56 pb-20 overflow-hidden"
      >
        {/* 배경 이미지 */}
        <div 
          className="absolute top-32 left-0 right-0 bottom-0 opacity-20"
          style={{
            backgroundImage: 'url(https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/air1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center leading-relaxed whitespace-pre-line">
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
          className="absolute top-8 left-0 right-0 bottom-0 opacity-15"
          style={{
            backgroundImage: 'url(https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <p className="text-gray-700 text-xl leading-loose font-semibold">
              포천중앙침례교회는 이 시대의 어둠 속에서도 빛과 소금으로서의 사명을 감당하며, 믿음의 다음 세대를 세우고,
            </p>
            <p className="text-gray-700 text-xl leading-loose font-semibold">
              지역 사회를 품는 복음적 교회로 서 가고자 합니다.
            </p>
            <p className="text-gray-700 text-xl leading-loose font-semibold">
              여러분 한 분 한 분이 이 공동체의 귀한 지체로서 예배와 말씀, 사랑과 섬김 안에서 하나님 나라의 기쁨을 함께 누리시길 바랍니다.
            </p>
            <p className="text-gray-700 text-xl leading-loose font-semibold">
              주님 안에서 여러분의 삶이 날마다 새로워지고, 하나님의 은혜가 가정과 일터 위에 충만히 임하기를 기도합니다.
            </p>
            <p className="text-gray-700 text-xl leading-loose font-semibold">
              감사합니다.
            </p>
            <p className="text-gray-900 text-2xl md:text-3xl font-bold mt-12 text-right leading-loose">
              포천중앙침례교회
            </p>
            <p className="text-gray-900 text-2xl md:text-3xl font-bold text-right leading-loose">
              담임목사 박상구 드림
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

