"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";

/**
 * MenuItem 타입 정의
 * - label: 메뉴 표시 텍스트
 * - href: 직접 링크 (children이 없을 때)
 * - children: 드롭다운 서브메뉴
 */
export interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

/**
 * 메뉴 데이터 구조
 * 교회의 전체 네비게이션 메뉴를 정의
 */
export const menuItems: MenuItem[] = [
  {
    label: "교회소개",
    children: [
      { label: "교회안내", href: "/about" },
      { label: "담임목사", href: "/about/pastor" },
      { label: "오시는길", href: "/about/location" }
    ]
  },
  {
    label: "교육부서",
    children: [
      { label: "청년부", href: "/education/youth" },
      { label: "중고등부", href: "/education/highschool" },
      { label: "주일학교", href: "/education/sunday-school" },
      { label: "유치부", href: "/education/kindergarten" }
    ]
  },
  {
    label: "찬양",
    children: [
      { label: "야다 성가대", href: "/choir/yada" },
      { label: "기쁜소리 찬양단", href: "/choir/joyful" },
      { label: "테루아 찬양단", href: "/choir/terua" }
    ]
  },
  {
    label: "양육",
    children: [
      { label: "새신자 양육", href: "/nurture/newcomer" },
      { label: "목장(리더) 양육", href: "/nurture/leader" }
    ]
  },
  {
    label: "선교",
    children: [
      { label: "국내선교", href: "/mission/domestic" },
      { label: "해외선교", href: "/mission/overseas" }
    ]
  },
  {
    label: "교회소식",
    children: [
      { label: "공지사항", href: "/news/notices" },
      { label: "기도제목", href: "/news/prayer" }
    ]
  },
  {
    label: "목장",
    href: "/lifegroup"
  },
  {
    label: "갤러리",
    href: "/gallery"
  }
];

/**
 * Header 컴포넌트
 * - 투명 배경으로 Hero 섹션 위에 떠있는 헤더
 * - 데스크톱: 드롭다운 네비게이션
 * - 모바일: 햄버거 메뉴
 * - 스크롤 시 배경색 변경 (선택사항)
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 경로 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // 관리자 페이지에서는 헤더 숨기기
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/30 backdrop-blur-sm text-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-20">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 md:gap-4 hover:opacity-80 transition-opacity"
            aria-label="포천중앙침례교회 홈으로 이동"
          >
            {/* 교회 로고 이미지 */}
            <div className="relative w-9 h-9 md:w-14 md:h-14 flex-shrink-0">
              <Image
                src="https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/pbclo-Photoroom.png"
                alt="포천중앙침례교회 로고"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            
            {/* 교회 이름 */}
            <div className="flex items-baseline gap-1 md:gap-3">
              <span className="text-sm md:text-2xl lg:text-3xl xl:text-4xl font-bold whitespace-nowrap">
                포천중앙침례교회
              </span>
              <span className="hidden sm:inline text-[8px] md:text-xs lg:text-base font-normal whitespace-nowrap opacity-70">
                기독교한국침례회
              </span>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <Navigation menuItems={menuItems} scrolled={false} />

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current transform transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current transform transition-transform duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <MobileMenu
        menuItems={menuItems}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        scrolled={false}
      />
    </header>
  );
}

