import { Section } from "@/lib/supabase/sections";

export default function ContactSection({ section }: { section: Section }) {
  const {
    phone,
    fax,
    email,
    address,
    kakaoTalk,
    instagram,
    facebook,
    youtube,
  } = section.content;

  const contactItems = [
    { icon: "📞", label: "전화", value: phone, href: phone ? `tel:${String(phone)}` : undefined },
    { icon: "📠", label: "팩스", value: fax },
    { icon: "✉️", label: "이메일", value: email, href: email ? `mailto:${String(email)}` : undefined },
    { icon: "📍", label: "주소", value: address },
  ].filter(item => item.value);

  const socialItems = [
    { icon: "💬", label: "카카오톡", value: kakaoTalk, href: kakaoTalk ? String(kakaoTalk) : undefined },
    { icon: "📷", label: "인스타그램", value: instagram, href: instagram ? String(instagram) : undefined },
    { icon: "👥", label: "페이스북", value: facebook, href: facebook ? String(facebook) : undefined },
    { icon: "▶️", label: "유튜브", value: youtube, href: youtube ? String(youtube) : undefined },
  ].filter(item => item.value);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* 제목 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              궁금하신 사항은 언제든지 연락주세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 연락처 정보 */}
            {contactItems.length > 0 && (
              <div className="space-y-4 animate-fade-in-up animation-delay-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">연락처</h3>
                {contactItems.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-start gap-4 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            {item.label}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {String(item.value)}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            {item.label}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {String(item.value)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* SNS */}
            {socialItems.length > 0 && (
              <div className="space-y-4 animate-fade-in-up animation-delay-400">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">소셜 미디어</h3>
                {socialItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={String(item.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-purple-100 transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          {item.label}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                          {String(item.value)}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 하단 메시지 */}
          <div className="mt-16 text-center animate-fade-in-up animation-delay-600">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                함께하고 싶으신가요?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                언제든지 방문하셔서 함께 예배하실 수 있습니다
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {phone ? (
                  <a
                    href={`tel:${String(phone)}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    전화 문의
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${String(email)}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    이메일 문의
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

