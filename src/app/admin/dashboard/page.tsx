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

        {/* 안내 메시지 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📋 통합 콘텐츠 관리 시스템
              </h3>
              <p className="text-gray-700 mb-3">
                모든 페이지 콘텐츠는 <strong>섹션 관리</strong>에서 통합 관리됩니다.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>공지사항, 기도제목, 간증 등 모든 콘텐츠 추가/수정</li>
                <li>텍스트와 이미지를 간단하게 업로드</li>
                <li>개발 지식 없이도 쉽게 관리 가능</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 관리 메뉴 그리드 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 섹션 관리 - 메인 기능 */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
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
              <div>
                <h3 className="text-2xl font-bold text-white">섹션 관리</h3>
                <p className="text-indigo-100 text-sm">통합 콘텐츠 관리</p>
              </div>
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              모든 페이지의 콘텐츠를 한 곳에서 관리하세요.<br/>
              공지사항, 기도제목, 간증 등을 쉽게 추가하고 수정할 수 있습니다.
            </p>
            <Link
              href="/admin/sections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition-colors"
            >
              시작하기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* 갤러리 관리 */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
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
              <div>
                <h3 className="text-2xl font-bold text-white">갤러리</h3>
                <p className="text-pink-100 text-sm">사진 및 영상 관리</p>
              </div>
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              교회 활동 사진과 영상을 업로드하고 관리하세요.<br/>
              카테고리별로 정리하여 성도들과 공유할 수 있습니다.
            </p>
            <Link
              href="/admin/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-lg hover:bg-pink-50 font-semibold transition-colors"
            >
              관리하기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 빠른 가이드 */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            💡 빠른 시작 가이드
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-gray-900">페이지 선택</p>
                <p className="text-gray-600">섹션 관리에서 수정할 페이지를 선택하세요</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-gray-900">콘텐츠 작성</p>
                <p className="text-gray-600">텍스트와 이미지를 추가하거나 수정하세요</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-gray-900">즉시 반영</p>
                <p className="text-gray-600">저장하면 바로 웹사이트에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

