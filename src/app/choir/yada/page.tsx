export default function YadaChoirPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            야다 성가대
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                야다 성가대는 포천중앙침례교회의 대표 성가대입니다.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">활동 시간</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>연습: 매주 목요일 저녁 7시 30분</li>
                <li>예배 찬양: 매주 주일 오전 예배</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">모집 안내</h2>
              <p className="text-gray-700 leading-relaxed">
                찬양으로 하나님을 섬기기 원하시는 모든 성도님들을 환영합니다.
                별도의 오디션 없이 참여 가능합니다.
              </p>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-3">문의</h3>
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

