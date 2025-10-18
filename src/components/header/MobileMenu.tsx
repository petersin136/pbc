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

export default function MobileMenu({
  menuItems,
  isOpen,
  onClose,
}: MobileMenuProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => child.href === pathname);
    }
    return false;
  };

  const toggleAccordion = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const handleLinkClick = () => {
    onClose();
    setExpandedMenu(null);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          style={{ top: "80px", zIndex: 40 }}
          onClick={onClose}
        />
      )}

      {/* 메뉴 패널 */}
      <div
        className={`fixed top-20 right-0 w-4/5 max-w-sm h-screen bg-black/80 backdrop-blur-lg lg:hidden overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 50 }}
      >
        <nav className="p-6">
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const active = isActive(item);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenu === item.label;

              return (
                <li key={item.label} className="border-b border-white/20 pb-4">
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block text-lg font-medium ${
                        active ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleAccordion(item.label)}
                        className={`w-full flex items-center justify-between text-lg font-medium ${
                          active ? "text-blue-400" : "text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? "rotate-180" : ""
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

                      {isExpanded && hasChildren && (
                        <ul className="mt-3 ml-4 space-y-2">
                          {item.children?.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <li key={child.label}>
                                <Link
                                  href={child.href || "#"}
                                  onClick={handleLinkClick}
                                  className={`block py-2 text-base ${
                                    childActive
                                      ? "text-blue-400 font-semibold"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
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
