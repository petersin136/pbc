/**
 * 섹션이 없을 때 표시되는 기본 플레이스홀더
 */
export default function EmptyPagePlaceholder({ 
  title, 
  description 
}: { 
  title: string; 
  description?: string;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            {description && (
              <p className="text-lg text-gray-600">
                {description}
              </p>
            )}
          </div>

          {/* 콘텐츠 카드 */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-20 h-20 mx-auto mb-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              페이지 준비 중입니다
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              이 페이지의 콘텐츠는 곧 업데이트될 예정입니다.<br/>
              자세한 내용은 교회로 문의해주세요.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                관리자 안내
              </h3>
              <p className="text-sm text-gray-700">
                관리자 페이지의 <strong>섹션 관리</strong>에서 이 페이지의 콘텐츠를 추가하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

