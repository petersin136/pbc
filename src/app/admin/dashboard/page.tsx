"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getUserRole, signOut, hasAdminAccess } from "@/lib/supabase/auth";

/**
 * 관리자 대시보드 페이지
 * - 로그인된 사용자만 접근 가능
 * - admin 또는 editor 역할 확인
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  /**
   * 인증 상태 확인
   */
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. 관리자 권한 확인
      const hasAccess = await hasAdminAccess();

      if (!hasAccess) {
        router.push("/admin/login");
        return;
      }

      // 2. 사용자 정보 가져오기
      const user = await getCurrentUser();
      const role = await getUserRole();

      if (user && role) {
        setUserEmail(user.email || "");
        setUserRole(role);
      }

      setLoading(false);
    } catch (error) {
      console.error("인증 확인 오류:", error);
      router.push("/admin/login");
    }
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-xl font-bold text-gray-900">
                포천중앙침례교회
              </Link>
              <p className="text-sm text-gray-600 mt-1">관리자 대시보드</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                <p className="text-xs text-gray-500">
                  역할:{" "}
                  <span className="font-semibold">
                    {userRole === "admin" ? "관리자" : "편집자"}
                  </span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          환영합니다! 👋
        </h1>

        {/* 관리 메뉴 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 공지사항 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">공지사항</h3>
            </div>
            <p className="text-gray-600 mb-4">
              교회 공지사항을 작성하고 관리합니다.
            </p>
            <Link
              href="/admin/notices"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              관리하기 →
            </Link>
          </div>

          {/* 설교 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">설교</h3>
            </div>
            <p className="text-gray-600 mb-4">
              주일 설교 영상과 음성을 업로드합니다.
            </p>
            <Link
              href="/admin/sermons"
              className="inline-block text-purple-600 hover:text-purple-700 font-medium"
            >
              관리하기 →
            </Link>
          </div>

          {/* 갤러리 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">갤러리</h3>
            </div>
            <p className="text-gray-600 mb-4">
              교회 활동 사진과 영상을 관리합니다.
            </p>
            <Link
              href="/admin/gallery"
              className="inline-block text-pink-600 hover:text-pink-700 font-medium"
            >
              관리하기 →
            </Link>
          </div>

          {/* 섹션 관리 (NEW) */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                섹션 관리 <span className="text-sm text-indigo-600">(NEW)</span>
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              페이지별 섹션 구조를 관리합니다.
            </p>
            <Link
              href="/admin/sections"
              className="inline-block text-indigo-600 hover:text-indigo-700 font-medium"
            >
              관리하기 →
            </Link>
          </div>

          {/* 기도제목 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">기도제목</h3>
            </div>
            <p className="text-gray-600 mb-4">
              주간 기도제목을 등록하고 관리합니다.
            </p>
            <Link
              href="/admin/prayer"
              className="inline-block text-green-600 hover:text-green-700 font-medium"
            >
              관리하기 →
            </Link>
          </div>

          {/* 간증 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">간증</h3>
            </div>
            <p className="text-gray-600 mb-4">
              성도들의 간증을 등록하고 관리합니다.
            </p>
            <Link
              href="/admin/testimony"
              className="inline-block text-yellow-600 hover:text-yellow-700 font-medium"
            >
              관리하기 →
            </Link>
          </div>

          {/* 설정 (admin만) */}
          {userRole === "admin" && (
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  설정 <span className="text-sm text-red-600">(Admin)</span>
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                사용자 관리 및 시스템 설정을 변경합니다.
              </p>
              <Link
                href="/admin/settings"
                className="inline-block text-red-600 hover:text-red-700 font-medium"
              >
                관리하기 →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

