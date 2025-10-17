"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";

/**
 * 홈페이지
 * - Supabase에서 'home' 페이지 섹션 가져오기
 * - 섹션 타입별로 동적 렌더링
 * - 로딩/에러 처리
 */
export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setError("");
      const data = await getSectionsByPage("home");
      setSections(data);
    } catch (err: unknown) {
      console.error("섹션 로드 오류:", err);
      setError(err instanceof Error ? err.message : "섹션을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadSections}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 섹션이 없는 경우
  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            섹션이 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            관리자 페이지에서 섹션을 추가해주세요.
          </p>
          <a
            href="/admin/sections"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            섹션 관리하기
          </a>
        </div>
      </div>
    );
  }

  // 섹션 렌더링
  return (
    <div className="min-h-screen">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">포천중앙침례교회</h3>
            <p className="text-gray-400 mb-6">
              주소: 경기도 포천시 [주소 입력] | 전화: [전화번호]
            </p>
          </div>

          {/* 하단 정보 및 관리자 링크 */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              © {new Date().getFullYear()} 포천중앙침례교회. All rights
              reserved.
            </p>

            {/* 관리자 로그인 링크 */}
            <a
              href="/admin/login"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              관리자
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
