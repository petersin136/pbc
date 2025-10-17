"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "./Header";

interface MobileMenuProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  scrolled: boolean;
}

/**
 * MobileMenu 컴포넌트 (모바일용 햄버거 메뉴)
 * - 전체 화면 오버레이 메뉴
 * - 아코디언 방식의 드롭다운
 * - 부드러운 애니메이션
 * - 접근성 지원
 */
export default function MobileMenu({
  menuItems,
  isOpen,
  onClose,
  scrolled,
}: MobileMenuProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  /**
   * 현재 경로가 메뉴 아이템과 일치하는지 확인
   */
  const isActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => child.href === pathname);
    }
    return false;
  };

  /**
   * 아코디언 토글
   */
  const toggleAccordion = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  /**
   * 링크 클릭 시 메뉴 닫기
   */
  const handleLinkClick = () => {
    onClose();
    setExpandedMenu(null);
  };

  return (
    <>
      {/* 오버레이 배경 */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
        style={{ top: "80px" }} // 헤더 높이만큼 아래에서 시작
      />

      {/* 모바일 메뉴 패널 */}
      <div
        className={`fixed top-20 left-0 right-0 bottom-0 lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${scrolled ? "bg-white text-gray-900" : "bg-gray-900 text-white"}`}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
      >
        <nav className="h-full overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenu === item.label;

              return (
                <li key={item.label} className="border-b border-gray-200/10">
                  {/* 메인 메뉴 아이템 */}
                  {item.href ? (
                    // 드롭다운 없는 직접 링크
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block py-3 px-4 font-medium rounded-lg transition-colors ${
                        active
                          ? scrolled
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white/10 text-white"
                          : scrolled
                          ? "hover:bg-gray-50"
                          : "hover:bg-white/5"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    // 드롭다운이 있는 메뉴
                    <>
                      <button
                        onClick={() => toggleAccordion(item.label)}
                        className={`w-full flex items-center justify-between py-3 px-4 font-medium rounded-lg transition-colors ${
                          active
                            ? scrolled
                              ? "bg-gray-100 text-gray-900"
                              : "bg-white/10 text-white"
                            : scrolled
                            ? "hover:bg-gray-50"
                            : "hover:bg-white/5"
                        }`}
                        aria-expanded={isExpanded}
                        aria-controls={`submenu-${item.label}`}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* 서브메뉴 (아코디언) */}
                      <ul
                        id={`submenu-${item.label}`}
                        className={`mt-2 ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                          isExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                        role="menu"
                        aria-label={`${item.label} 서브메뉴`}
                      >
                        {hasChildren &&
                          item.children?.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <li key={child.label}>
                                <Link
                                  href={child.href || "#"}
                                  onClick={handleLinkClick}
                                  className={`block py-2 px-4 rounded-lg transition-colors ${
                                    childActive
                                      ? scrolled
                                        ? "bg-gray-200 text-gray-900 font-semibold"
                                        : "bg-white/20 text-white font-semibold"
                                      : scrolled
                                      ? "hover:bg-gray-100 text-gray-700"
                                      : "hover:bg-white/10 text-gray-300"
                                  }`}
                                  role="menuitem"
                                  aria-current={childActive ? "page" : undefined}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

