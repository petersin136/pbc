"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

/**
 * 5K 운동 섹션 컴포넌트
 * NCMN 5대 운동 중 하나인 5K 운동에 대한 상세 설명
 */
export default function FiveKMovementSection({ section }: { section: Section }) {
  const {
    description = "",
    subtitle = "NCMN 5대 운동 중 하나로써 내가 속한 반경 5km 안의 절대필요가 있는 이웃들에게 예수님의 4대 사역을 펼치는 운동",
    fourMinistries = [],
    ncmnMovements = [],
    strategy = {},
    heroImage,
  } = section.content;

  // 기본 4대 사역 데이터
  const defaultFourMinistries = [
    {
      title: "복음전파사역",
      icon: "📖",
      description: "지구상의 모든 사람은 자신의 언어로 예수 그리스도의 복음을 듣고 이해할 권리가 있습니다. 따라서 네트워크 교회는 사역 반경 5km 내의 모든 사람(성별, 연령 무관)이 복음을 듣도록 성경을 배포하고 복음을 전합니다.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "구제사역",
      icon: "🤝",
      description: "지구상의 모든 사람은 기본적인 필요(식량, 의복, 주거)가 충족되어야 합니다. 따라서 네트워크 교회는 사역 반경 5km 내의 절대필요가 있는 분들(교회 내외)을 도와 5K 마켓 등을 통한 나눔 사역을 펼칩니다.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "교육사역",
      icon: "🎓",
      description: "지구상의 모든 어린이와 청소년은 교육을 받을 권리가 있습니다. 따라서 네트워크 교회는 경제적 어려움으로 교육 혜택을 받지 못하는 어린이와 청소년에게 성도들의 재능 기부, 학습 지원, 멘토링, 학비 지원을 통해 교육 및 문화 체험 기회를 제공합니다.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "의료사역",
      icon: "🏥",
      description: "하나님은 지구상의 모든 사람이 신체적, 영적, 정서적, 사회적으로 건강한 삶을 살기를 원하십니다. 따라서 네트워크 교회는 다양한 의료 영역의 연계 지원을 통해 의료 혜택을 제공하고, 상담과 지원을 통해 심리·정서적 서비스를 제공합니다.",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  // 기본 NCMN 5대 운동
  const defaultNcmnMovements = [
    { name: "말씀배가운동", color: "bg-green-500" },
    { name: "체리배가운동", color: "bg-blue-500" },
    { name: "연합중보운동", color: "bg-orange-500" },
    { name: "5K운동", color: "bg-red-500", active: true },
    { name: "주인바꾸기운동", color: "bg-yellow-500" },
  ];

  const ministries = (fourMinistries as Array<Record<string, unknown>>) || defaultFourMinistries;
  const movements = (ncmnMovements as Array<Record<string, unknown>>) || defaultNcmnMovements;

  const hasHeroImage = heroImage && (heroImage as string).trim() !== "";

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* 히어로 이미지 (있는 경우) */}
        {hasHeroImage ? (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
              <Image
                src={heroImage as string}
                alt={section.title || "5K운동"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {section.title || "5K운동이란?"}
                </h1>
                <div className="w-16 h-0.5 bg-white/80"></div>
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {subtitle as string}
              </p>
            </div>
          </div>
        ) : (
          /* 히어로 이미지가 없을 때는 일반 헤더 */
          <div className="max-w-5xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {section.title || "5K운동이란?"}
              </h1>
              <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {subtitle as string}
              </p>
            </div>
          </div>
        )}

        {/* NCMN 5대 운동 */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-gray-50 rounded-lg shadow-sm p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 text-center">
              NCMN 5대 운동
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {movements.map((movement: Record<string, unknown>, index: number) => (
                <div
                  key={index}
                  className={`relative px-4 py-2 rounded-lg ${movement.color as string} text-white text-sm font-medium shadow-sm transition-all ${
                    movement.active ? "ring-2 ring-red-300" : "opacity-70"
                  }`}
                >
                  {movement.name as string}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 예수님의 4대 사역 */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
              5K운동으로 섬기는 예수님의 4대 사역
            </h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministries.map((ministry: Record<string, unknown>, index: number) => {
              const defaultMinistry = defaultFourMinistries[index] || defaultFourMinistries[0];
              const title = (ministry.title as string) || defaultMinistry.title;
              const desc = (ministry.description as string) || defaultMinistry.description;
              const icon = (ministry.icon as string) || defaultMinistry.icon;
              const color = (ministry.color as string) || defaultMinistry.color;
              const bgColor = (ministry.bgColor as string) || defaultMinistry.bgColor;
              const borderColor = (ministry.borderColor as string) || defaultMinistry.borderColor;

              return (
                <div
                  key={index}
                  className={`${bgColor} ${borderColor} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                        {title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5K 운동의 전략 */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
              5K운동의 전략
            </h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 섬김의 대상 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  1
                </span>
                섬김의 대상
              </h3>
              <div className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                <p className="mb-3">
                  절대필요가 있는 분들을 우선순위로 섬깁니다:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 mt-1">•</span>
                    <span>교회 내 절대필요가 있는 분들</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 mt-1">•</span>
                    <span>교회 반경 5km 내의 절대필요가 있는 분들</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 mt-1">•</span>
                    <span>미자립 개척교회</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 mt-1">•</span>
                    <span>이웃 지역사회 (소년소녀 가장, 장애인, 독거노인, 다문화가정 등)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 섬김의 컨텐츠 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  2
                </span>
                섬김의 컨텐츠
              </h3>
              <div className="space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
                <p>
                  예수님께서 보여주신 5K 운동의 모델을 따라 (마태복음 4:23-24, 14:18, 20-21):
                </p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-xl mb-1">🤝</div>
                    <div className="font-medium text-red-700 text-xs">구제</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl mb-1">🎓</div>
                    <div className="font-medium text-blue-700 text-xs">교육</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <div className="text-xl mb-1">🏥</div>
                    <div className="font-medium text-yellow-700 text-xs">보건의료</div>
                  </div>
                </div>
                <p className="mt-4 font-medium text-center text-base text-gray-800">
                  이 세 가지가 만나는 중심에 "복음 전파"가 있습니다
                </p>
                <p className="text-sm text-gray-600 italic">
                  교회 반경 5km 내에서 예수님의 4대 사역을 펼쳐 지역사회에 긍정적 영향을 미치고, 
                  미신자들을 구원으로 인도하며 하나님 나라를 확장합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 교회 부흥 운동 */}
        {description && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-blue-600 rounded-lg p-6 md:p-8 text-white shadow-sm">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">
                교회 부흥 운동
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-center text-blue-50">
                {description as string}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
