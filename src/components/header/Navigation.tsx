"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "./Header";

interface NavigationProps {
  menuItems: MenuItem[];
  scrolled: boolean;
}

export default function Navigation({ menuItems, scrolled }: NavigationProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => child.href === pathname);
    }
    return false;
  };

  return (
    <nav
      className="hidden lg:flex items-center space-x-8"
      aria-label="주 네비게이션"
    >
      {menuItems.map((item) => {
        const active = isActive(item);
        const hasDropdown = item.children && item.children.length > 0;
        const isOpen = activeDropdown === item.label;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
            onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
          >
            {/* 메인 메뉴 */}
            {item.href ? (
              <Link
                href={item.href}
                className="block py-2 px-1 font-medium transition-all duration-200 hover:opacity-80"
              >
                {item.label}
              </Link>
            ) : (
              <button
                className="py-2 px-1 font-medium transition-all duration-200 hover:opacity-80 flex items-center gap-1"
              >
                {item.label}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}

            {/* 드롭다운 */}
            {hasDropdown && isOpen && (
              <div className="absolute left-0 top-full pt-2 z-[100]">
                <div
                  className={`w-48 rounded-lg shadow-lg overflow-hidden ${
                    scrolled
                      ? "bg-white text-gray-900"
                      : "bg-gray-900/95 backdrop-blur-sm text-white"
                  }`}
                >
                  {item.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href || "#"}
                      className={`block px-4 py-3 transition-colors ${
                        scrolled
                          ? "hover:bg-gray-100"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
