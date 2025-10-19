import Link from "next/link";

/**
 * 찬양 총괄 페이지
 * - 3개 찬양단 소개 및 링크 제공
 */
export default function ChoirPage() {
  const choirGroups = [
    {
      name: "야다 성가대",
      href: "/choir/yada",
      description: "포천중앙침례교회의 대표 성가대입니다.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      name: "기쁜소리 찬양단",
      href: "/choir/joyful",
      description: "청년들의 역동적인 찬양을 드리는 찬양팀입니다.",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "테루아 찬양단",
      href: "/choir/terua",
      description: "특송과 예배 찬양을 섬기는 찬양팀입니다.",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              찬양 사역
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              찬양으로 하나님을 예배하고 영광을 돌립니다
            </p>
          </div>

          {/* 찬양단 카드들 */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {choirGroups.map((group) => (
              <Link
                key={group.name}
                href={group.href}
                className="group"
              >
                <div className={`bg-gradient-to-br ${group.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${group.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {group.icon}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {group.name}
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {group.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    자세히 보기
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 하단 안내 */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                찬양 사역에 참여하세요
              </h2>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
                찬양으로 하나님을 섬기기 원하시는 모든 성도님들을 환영합니다.
                각 찬양단의 자세한 정보는 위 카드를 클릭하여 확인하실 수 있습니다.
              </p>
              <div className="inline-flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>문의: 교회 사무실</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

