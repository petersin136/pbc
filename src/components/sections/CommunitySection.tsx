"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CommunityItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  verse: string;
  verseRef: string;
  bgImage?: string;
  color: string;
}

const communityData: CommunityItem[] = [
  {
    id: "worship",
    category: "WORSHIP",
    title: "예배공동체",
    subtitle: "포천 중앙침례교회는 전심으로 예배합니다.",
    description: "예배는 우리의 삶을 변화시키는 중요한 순간입니다.\n삶에서 방황을 잃었을 때, 마음이 지칠 때, 우리는 예배를 통해 말씀의 풍성한 은혜와 성령의 충만함으로 힘딤을 얻고\n다시 나아갈 힘을 얻을 수 있습니다.",
    verse: "아버지께 참되게 예배하는 자들은 영과 진리로 예배할 때가 오나니 곧 이때라\n아버지께서는 자기에게 이렇게 예배하는 자들을 찾으시느니라",
    verseRef: "요한복음 4:23",
    color: "from-amber-600 to-orange-700",
    bgImage: "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/wors.jpg"
  },
  {
    id: "education", 
    category: "EDUCATION",
    title: "교육공동체",
    subtitle: "포천 중앙침례교회는 다음세대를 키워갑니다.",
    description: "우리아이들에게 무엇을 물려주고싶으신가요?\n오늘날 자녀교육은 그 어느 때보다 중요합니다.\n아이들이 올바른 가치관을 가지고 성장할 수 있도록 따뜻한 관심과 바른 가르침을 전하며\n하나님의 말씀으로 미래를 책임질 다음세대를 준비합니다.",
    verse: "마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
    verseRef: "잠언 22:6",
    color: "from-blue-600 to-indigo-700",
    bgImage: "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/edu.jpg"
  },
  {
    id: "service",
    category: "SERVICE", 
    title: "섬김과 나눔공동체",
    subtitle: "포천 중앙침례교회는 섬김과 나눔을 추구합니다.",
    description: "예수님은 항상 사람들을 향해 나아가셨습니다. 포천 중앙침례교회도 이웃과 사회를 섬기며 사랑을 실천합니다.\n주변을 돌리보며 작은 관심과 따뜻한 손길이 필요한 이들이 많습니다.\n배푸는 기쁨은 받는 기쁨보다 더욱 크며, 함께 나눌 때 세상은 더 따뜻해집니다.",
    verse: "인자가 온 것은 섬김을 받으려 함이 아니라 도리어 섬기려 하고 자기 목숨을 많은 사람의 대속물로 주려 함이니라",
    verseRef: "마가복음 10:45",
    color: "from-green-600 to-emerald-700",
    bgImage: "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/ser.jpg"
  },
  {
    id: "mission",
    category: "MISSION",
    title: "선교공동체", 
    subtitle: "포천 중앙침례교회는 땅끝까지 선교합니다.",
    description: "교회의 본질은 복음을 전하는 것입니다.\n포천 중앙침례교회는, 국내와 해외선교를 통해 사랑과 희망을 나누며, 세계 곳곳에 복음의 씨앗을 심고 있습니다.\n또한 미션팀 라이프를 꿈꾸며, 삶의 모든 영역에서, 선교사로서의 삶을 살아가도록 훈련하고 있습니다.",
    verse: "그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고\n내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지\n너희와 항상 함께 있으리라 하시니라",
    verseRef: "마태복음 28:19-20",
    color: "from-purple-600 to-violet-700",
    bgImage: "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/mis.jpg"
  },
  {
    id: "friendship",
    category: "FRIENDSHIP",
    title: "친교공동체",
    subtitle: "포천 중앙침례교회는 천국을 미리 맛봅니다",
    description: "천국을 상상해 본 적이 있으신가요?\n포천 중앙침례교회는 따뜻한 가정 같은 공동 체를 만들어 갑니다.\n우정, 사랑, 신뢰가 점점 회미해지는 시대 속에서, 다양한 활동을 통해 서로를 격려하고\n진정한 교제를 나누며 작은 천국을 경험할 수 있습니다.",
    verse: "믿는 사람이 다 함께 있어 모든 물건을 서로 통용하고 또 재산과 소유물을 팔아 각 사람의 필요를 따라\n나눠 주며 날마다 마음을 같이하여 성전에 모이기를 힘쓰고 집에서 떡을 떼며\n기쁨과 순전한 마음으로 음식을 먹고",
    verseRef: "사도행전 2:44-46",
    color: "from-rose-500 to-pink-600",
    bgImage: "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/fr.jpg"
  }
];

export default function CommunitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-4 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-2 md:px-4">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            교회 공동체
          </h2>
          <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            포천중앙침례교회는 다섯 가지 핵심 공동체를 통해<br />
            하나님의 사랑을 실천하고 나누어갑니다
          </p>
        </motion.div>

        {/* 공동체 섹션들 */}
        <div className="space-y-8 md:space-y-24">
          {communityData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative overflow-hidden"
            >
              {/* 배경 그라디언트 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 rounded-3xl`} />
              
              {/* 메인 컨텐츠 */}
              <div className="relative z-10 p-3 md:p-12">
                {/* 카테고리와 제목 */}
                <div className="mb-3 md:mb-8">
                  <div className={`inline-block bg-gradient-to-r ${item.color} text-white px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-wider mb-2 md:mb-4`}>
                    {item.category}
                  </div>
                  <h3 className="text-lg md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                    {item.title}
                  </h3>
                  <p className={`text-sm md:text-2xl font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3 md:mb-8`}>
                    {item.subtitle}
                  </p>
                </div>

                {/* 설명 */}
                <div className="mb-4 md:mb-10">
                  <p className="text-sm md:text-2xl lg:text-3xl leading-relaxed text-gray-700 font-medium whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* 성경구절 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-8 border border-gray-100 shadow-lg">
                  <blockquote className="text-center">
                    <p className="text-sm md:text-2xl lg:text-3xl italic leading-relaxed text-gray-800 mb-2 md:mb-4 font-medium whitespace-pre-line">
                      "{item.verse}"
                    </p>
                    <cite className={`text-xs md:text-xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.verseRef}
                    </cite>
                  </blockquote>
                </div>
              </div>

              {/* 하단 이미지 영역 - 매우 크게 확장 */}
              <div className="relative h-40 md:h-[500px] lg:h-[600px] xl:h-[700px] mt-3 md:mt-8 overflow-hidden rounded-b-xl md:rounded-b-3xl">
                {/* 배경 이미지 */}
                {item.bgImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.bgImage})`,
                      filter: 'brightness(0.4) saturate(1.1)'
                    }}
                  />
                )}
                
                {/* 임시 그라디언트 배경 (이미지 없을 때) */}
                {!item.bgImage && (
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-15`} />
                )}
                
                {/* 부드러운 오버레이 그라디언트 */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
                
                {/* 이미지 플레이스홀더 텍스트 (이미지 없을 때만) */}
                {!item.bgImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 text-lg font-medium">
                      {item.category} 관련 이미지 영역
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
