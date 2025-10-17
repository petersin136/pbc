import { Section } from "@/lib/supabase/sections";
import Image from "next/image";

export default function PastorSection({ section }: { section: Section }) {
  const {
    name = "담임목사",
    title = "목사",
    photo,
    description = "",
    education = [],
    ministry = [],
  } = section.content;

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* 제목 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* 왼쪽: 사진 */}
            {photo && (
              <div className="lg:col-span-2 flex justify-center animate-fade-in-up animation-delay-200">
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ring-8 ring-white">
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* 오른쪽: 정보 */}
            <div className={`${photo ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-8 animate-fade-in-up animation-delay-400`}>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {name} {title}
                </h3>
                <div className="w-16 h-1 bg-blue-600 mb-6"></div>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {/* 학력 */}
              {education && education.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">🎓</span>
                    학력
                  </h4>
                  <ul className="space-y-2">
                    {education.map((item: string, idx: number) => (
                      <li key={idx} className="text-gray-700 pl-6 relative">
                        <span className="absolute left-0 top-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 사역 경력 */}
              {ministry && ministry.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">✝️</span>
                    사역 경력
                  </h4>
                  <ul className="space-y-2">
                    {ministry.map((item: string, idx: number) => (
                      <li key={idx} className="text-gray-700 pl-6 relative">
                        <span className="absolute left-0 top-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

