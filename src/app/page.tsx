"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={loadSections} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">섹션이 없습니다</h2>
          <p className="text-gray-600 mb-6">관리자 페이지에서 섹션을 추가해주세요.</p>
          <a href="/admin/sections" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            섹션 관리하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* location 섹션(오시는 길)을 제외한 모든 섹션 표시 */}
      {sections
        .filter((section) => section.kind !== 'location')
        .map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* 상단 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* 교회 정보 */}
            <div>
              <div className="mb-6">
                <h3 className="text-3xl font-bold">포천중앙침례교회</h3>
                <p className="text-sm text-gray-500 mt-1">기독교한국침례회</p>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-base leading-relaxed">
                    경기도 포천시 중앙로 105번길 23-2<br />
                    <span className="text-gray-500">(신읍동 135-10)</span>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-base">
                    <a href="tel:031-534-5078" className="hover:text-white transition-colors">031-534-5078</a>
                    <span className="mx-2">·</span>
                    <a href="tel:031-535-0571" className="hover:text-white transition-colors">031-535-0571</a>
                  </span>
                </p>
              </div>
            </div>

            {/* 헌금 계좌 */}
            <div className="md:col-span-2">
              <h4 className="text-2xl font-semibold mb-6">헌금 계좌</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                  <p className="text-sm text-gray-500 mb-2">교회헌금</p>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-mono text-base text-white">신협 131-016-216985</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('131-016-216985');
                        alert('계좌번호가 복사되었습니다');
                      }}
                      className="p-2 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                      aria-label="계좌번호 복사"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">포천중앙침례교회</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                  <p className="text-sm text-gray-500 mb-2">선교헌금</p>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-mono text-base text-white">신협 131-019-861153</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('131-019-861153');
                        alert('계좌번호가 복사되었습니다');
                      }}
                      className="p-2 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                      aria-label="계좌번호 복사"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">포천중앙침례교회</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                  <p className="text-sm text-gray-500 mb-2">건축헌금</p>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-mono text-base text-white">신협 131-019-861146</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('131-019-861146');
                        alert('계좌번호가 복사되었습니다');
                      }}
                      className="p-2 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                      aria-label="계좌번호 복사"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">포천중앙침례교회</p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-base">
                © {new Date().getFullYear()} 포천중앙침례교회. All rights reserved.
              </p>
            </div>
            <a
              href="/admin/login"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-base text-gray-400 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              관리자
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
