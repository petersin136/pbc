export default function TeruaChoirPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            테루아 찬양단
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                테루아 찬양단은 특송과 예배 찬양을 섬기는 찬양팀입니다.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">테루아의 의미</h2>
              <p className="text-gray-700 leading-relaxed">
                '테루아(Teruah)'는 히브리어로 '기쁨의 함성', '환호'를 뜻하며,
                하나님께 드리는 승리와 찬양의 외침을 의미합니다.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">활동 시간</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>연습: 매주 토요일 오후 2시</li>
                <li>예배 찬양: 특별 예배 및 행사</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">찬양 사역</h2>
              <p className="text-gray-700 leading-relaxed">
                특별 찬양, 절기 예배, 각종 행사에서 찬양을 통해
                하나님의 영광을 드러내는 사역을 하고 있습니다.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">모집 안내</h2>
              <p className="text-gray-700 leading-relaxed">
                찬양에 은사가 있으신 분, 찬양 사역에 헌신하고자 하시는 분들을
                모집합니다.
              </p>

              <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-3">문의</h3>
                <p className="text-gray-700">
                  자세한 사항은 교회 사무실로 연락주시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

