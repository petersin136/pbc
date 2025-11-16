"use client";

import Link from "next/link";

const cards = [
  {
    id: 1,
    title: "포천중앙침례교회에",
    subtitle: "처음 오셨나요?",
    bg: "from-[#E57373] to-[#EF9A9A]",
    bgImage: "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/20250607_164129.jpg",
    href: "/about",
  },
  {
    id: 2,
    title: "목자의 마음",
    subtitle: '"아름다운 발자국"',
    bg: "from-[#4DB6AC] to-[#80CBC4]",
    bgImage: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&auto=format&fit=crop&q=80",
    href: "/about/pastor",
  },
  {
    id: 3,
    title: "교회속으로",
    subtitle: "교회 소식",
    bg: "from-[#7986CB] to-[#9FA8DA]",
    bgImage: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&auto=format&fit=crop&q=80",
    href: "/news/notices",
  },
  {
    id: 4,
    title: "금주의 주보",
    subtitle: "",
    bg: "from-[#64B5F6] to-[#90CAF9]",
    bgImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80",
    href: "/news/bulletin",
  },
];

export default function QuickLinksSection() {
  return (
    <section className="bg-gray-50 py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className={`group relative overflow-hidden rounded-lg 
                px-3.5 py-3.5 md:px-8 md:py-8 lg:px-10 lg:py-10 text-white 
                transition-all duration-500 
                bg-gradient-to-br ${card.bg} 
                hover:-translate-y-2 hover:scale-[1.02]
                shadow-lg hover:shadow-2xl
                min-h-[105px] md:min-h-[220px] flex flex-col justify-center`}
            >
              {/* 배경 이미지 - 흐리게 */}
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-50"
                style={{ backgroundImage: `url(${card.bgImage})` }}
              />
              
              {/* 그라데이션 오버레이 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-70`} />
              
              {/* 컨텐츠 */}
              <div className="relative z-10">
                <h3 className="text-base md:text-2xl lg:text-3xl font-extrabold relative inline-block transition-all duration-500 group-hover:scale-[1.02] mb-1.5 md:mb-3">
                  {card.title}
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-white rounded-full transition-all duration-500 group-hover:w-full"></span>
                </h3>
                <p className="text-white/90 text-xs md:text-base lg:text-lg leading-snug md:leading-relaxed">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

