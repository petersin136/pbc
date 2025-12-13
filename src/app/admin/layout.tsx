"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { hasAdminAccess, signOut } from "@/lib/supabase/auth";

/**
 * 관리자 페이지 공통 레이아웃
 * - 사이드바 네비게이션
 * - 인증 체크
 * - 공통 헤더
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // 로그인 페이지는 인증 체크 스킵
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    try {
      const hasAccess = await hasAdminAccess();
      if (!hasAccess) {
        router.push("/admin/login");
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error("인증 확인 오류:", error);
      router.push("/admin/login");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 로그인 페이지는 레이아웃 적용 안함
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: "🏠", label: "대시보드", href: "/admin/dashboard" },
    { icon: "🎬", label: "Hero 배너", href: "/admin/hero" },
    { icon: "📋", label: "정보 카드", href: "/admin/content-cards" },
    { icon: "📝", label: "텍스트 섹션", href: "/admin/text-sections" },
    { icon: "🖼️", label: "이미지 섹션", href: "/admin/image-sections" },
    { icon: "👤", label: "팀 소개", href: "/admin/team" },
    { icon: "📍", label: "교회 위치", href: "/admin/location" },
    { icon: "📞", label: "연락처", href: "/admin/contact" },
    { icon: "🎓", label: "부서 안내", href: "/admin/departments" },
    { icon: "📢", label: "공지사항", href: "/admin/announcements" },
    { icon: "🙏", label: "기도제목", href: "/admin/prayer" },
    { icon: "📸", label: "갤러리", href: "/admin/gallery" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* 로고 */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/admin/dashboard" className="block">
              <h1 className="text-xl font-bold text-gray-900">관리자</h1>
              <p className="text-xs text-gray-500 mt-1">포천중앙침례교회</p>
            </Link>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 하단 버튼 */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              🌐 사이트 보기
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-1 lg:flex-none">
              <h2 className="text-lg font-semibold text-gray-900">
                {menuItems.find((item) => item.href === pathname)?.label || "관리자"}
              </h2>
            </div>
          </div>
        </header>

        {/* 메인 영역 */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

