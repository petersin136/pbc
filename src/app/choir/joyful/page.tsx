export default function JoyfulChoirPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            기쁜소리 찬양단
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                기쁜소리 찬양단은 청년들의 역동적인 찬양을 드리는 찬양팀입니다.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">활동 시간</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>연습: 매주 금요일 저녁 8시</li>
                <li>예배 찬양: 월 1회 주일 저녁 예배</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">찬양 스타일</h2>
              <p className="text-gray-700 leading-relaxed">
                현대적인 CCM 스타일의 찬양을 중심으로 활동하며,
                밴드 악기와 함께 역동적인 찬양을 드립니다.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">모집 안내</h2>
              <p className="text-gray-700 leading-relaxed">
                보컬, 기타, 베이스, 드럼, 건반 등 각 파트별로 멤버를 모집합니다.
                청년부 소속 성도님들의 많은 참여 바랍니다.
              </p>

              <div className="mt-8 p-6 bg-green-50 rounded-xl">
                <h3 className="text-xl font-bold text-green-900 mb-3">문의</h3>
                <p className="text-gray-700">
                  자세한 사항은 청년부 담당 전도사님께 연락주시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

