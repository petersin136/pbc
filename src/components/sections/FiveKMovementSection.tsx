"use client";

/**
 * 5K운동 섹션 컴포넌트
 * - 국내선교의 핵심인 5K운동을 소개
 */
export default function FiveKMovementSection() {
  const ministries = [
    {
      icon: "📖",
      title: "복음전파사역",
      description: "이 땅의 모든 사람이 예수 그리스도의 복음을 듣고 이해하며, 그들의 언어로 성경을 가질 권리가 있습니다. 교회는 사역지 반경 5Km 안에 남녀노소를 막론하고 복음을 듣게 해야할 책임이 있습니다. 따라서 네트워크 교회는 사역지 반경 5Km 안에 성경을 보급하고 복음을 제시합니다.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: "🤝",
      title: "구제사역",
      description: "이 땅의 모든 사람은 삶의 기본적인 필요(음식, 의류, 주거)가 충족 되어야 합니다. 따라서 네트워크 교회는 사역지 5Km 안에 있는 절대 필요자(교회안, 교회밖)를 돕는 것을 목표로 5km캠프 운동을 통하여 나눔사역을 펼치는 운동을 전개합니다.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: "🎓",
      title: "교육사역",
      description: "이 땅의 모든 어린이와 청소년들은 교육을 받을 권리가 슴니다. 따라서 네트워크 교회는 재정적 결핍으로 교육의 혜택을 받지 못하는 어린이 및 청소년들에게 교육이나 문화체험 기회를 제공 하고자 성도들의 재능 기부를 통한 학습지원이나 멘토링 역, 학비 지원 등을 전개합니다. (예) 한부모 가정이나 결손가정 등의 아이들과 한구역-셀, 목장-속, 연결프로그램입니다.",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      icon: "⚕️",
      title: "의료사역",
      description: "하나님은 이 땅의 모든 사람들이 육체적, 영적, 정서적, 사회적으로 건강한 삶을 살기를 원하심니다. 따라서 네트워크 교회는 의사 각지대 사람들에게 연계 후원을 통해 의료 혜택을 지원이나 상담을 통한 심리 · 정서적 서비스 등을 제공하는 일을 합니다. (예) 교회 내 의료선교회를 통한 지료혜택으로 섬김니다.",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    }
  ];

  const strategies = [
    {
      title: "섬김의 대상",
      content: "가난한 자를 섬길 때에 우선순위가 있습니다. 제일 먼저 교회 안의 절대 필요가 있는 자를 돌봐야 하고, 그 다음에 교회 반경 5km 안의 절대 필요자(교회안, 교회밖)를 돕는 것을 목표로 합니다.",
      detail: "갈라디아서 6장 10절에는 우리가 기회 있는 대로 모든 이에게 착한 일을 하되 더욱 믿음의 가정들에게 하라고 말씀하십니다. 교회 안의 어려운 성도들을 먼저 섬겨야 합니다. 그 이후에 교회 밖 이웃사회의 이웃을 섬기어 하나님 나라의 가치관, 즉 소녀소년 가장, 장애인, 독거노인, 다문화가정 등을 섬기는 것으로 확대해 나가야 합니다."
    },
    {
      title: "섬김의 컨텐츠",
      content: "복음적 인애서 예수님은 5K운동의 모델을 보여주셨습니다. 마태복음 4장 23절과 24절을 보면 예수님 사역의 4대 사역을 설명하고있습니다. 5K운동은 예수님의 사역을 본받아 교회 반경 5Km 안에 예수님이 하셨던 4가지의 사역을 실행하고자 하는 운동입니다.",
      detail: "교회들이 예수님의 4대 사역을 활발하게 펼칠 때에 지역사회의 선한 영향력을 끼치고, 그것을 통해 믿지 않는 자들의 열로구원을 이루어 하나님 나라를 확장하게 됩니다."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* 제목 섹션 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full text-sm font-semibold shadow-lg">
              국내선교의 핵심
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              5K운동으로 섬기는
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                예수님의 4대 사역
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              교회 반경 <span className="font-bold text-teal-600">5Km 안</span>에서 예수님께서 행하신 복음전파, 구제, 교육, 의료 사역을 실천합니다
            </p>
          </div>

          {/* 4대 사역 그리드 */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {ministries.map((ministry, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl border-2 ${ministry.borderColor} ${ministry.bgColor} p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 배경 그라데이션 효과 */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${ministry.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                
                <div className="relative z-10">
                  {/* 아이콘 */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-md mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                    {ministry.icon}
                  </div>
                  
                  {/* 제목 */}
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${ministry.color} bg-clip-text text-transparent`}>
                    {ministry.title}
                  </h3>
                  
                  {/* 설명 */}
                  <p className="text-gray-700 leading-relaxed">
                    {ministry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 5K운동 이미지 */}
          <div className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <img
                src="https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/5k.png"
                alt="5K운동 전략 다이어그램"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* 5K운동의 전략 섹션 */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              5K운동의 전략
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 text-white rounded-full font-bold text-lg shadow-md">
                      {index + 1}
                    </span>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {strategy.title}
                    </h4>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {strategy.content}
                  </p>
                  
                  <div className="pl-4 border-l-2 border-teal-300">
                    <p className="text-gray-600 text-sm leading-relaxed italic">
                      {strategy.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 CTA */}
          <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-2xl shadow-xl">
              <p className="text-lg md:text-xl font-semibold mb-2">
                "이 땅의 모든 사람에게 예수님의 사랑을 전합니다"
              </p>
              <p className="text-sm opacity-90">
                교회 반경 5Km 안에서 예수님의 4대 사역을 실천하는 포천중앙침례교회
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

