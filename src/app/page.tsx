"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";
import QuickLinksSection from "@/components/sections/QuickLinksSection";

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
      // 오류 발생해도 로딩 상태만 해제하고 계속 진행
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

  // 오류가 있거나 섹션이 없으면 기본 페이지 표시
  if (error || sections.length === 0) {
    return (
      <>
        {/* 기본 히어로 섹션 */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* 배경 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
          
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black/40" />

          {/* 콘텐츠 */}
          <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up leading-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
              포천중앙침례교회
            </h1>
            <p className="text-lg md:text-2xl lg:text-3xl mb-12 text-gray-50 font-light animate-fade-in-up animation-delay-200" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9)' }}>
              기도하는 교회 전도하는 교회
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link
                href="/about"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl bg-white text-gray-900 hover:bg-gray-100"
              >
                교회 소개
              </Link>
              <Link
                href="/about/location"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl bg-white/20 border-2 border-white text-white hover:bg-white/30 backdrop-blur-sm"
              >
                오시는 길
              </Link>
            </div>
          </div>

          {/* 성경 구절 */}
          <div className="absolute bottom-16 md:bottom-12 right-4 md:right-12 text-right text-white animate-fade-in-up animation-delay-400">
            <p className="text-sm md:text-lg leading-relaxed mb-2" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.95)', fontFamily: "'Gowun Batang', serif" }}>
              여호와는 나의 목자시니 내게 부족함이 없으리라
            </p>
            <p className="text-xs md:text-base leading-relaxed mb-3 opacity-90" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)', fontFamily: "'Georgia', serif", fontStyle: 'italic' }}>
              The LORD is my shepherd; I shall not want.
            </p>
            <p className="text-xs opacity-75" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              시편 23:1
            </p>
          </div>

          {/* 스크롤 인디케이터 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* 퀵링크 */}
        <QuickLinksSection />

        {/* 관리자 경고 메시지 (오류가 있을 경우만) */}
        {error && (
          <div className="bg-yellow-50 border-t border-b border-yellow-200 py-8">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ 관리자 안내</h3>
                  <p className="text-yellow-800 mb-2">Supabase 연결 오류가 발생했습니다. 무료 플랜 한도를 초과했을 수 있습니다.</p>
                  <p className="text-sm text-yellow-700 font-mono bg-yellow-100 p-2 rounded">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white border-t border-gray-800">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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

              <div className="md:col-span-2">
                <h4 className="text-2xl font-semibold mb-6">헌금 계좌</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                    <p className="text-sm text-gray-500 mb-2">교회헌금</p>
                    <p className="font-mono text-base text-white mb-2">신협 131-016-216985</p>
                    <p className="text-sm text-gray-500">포천중앙침례교회</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                    <p className="text-sm text-gray-500 mb-2">선교헌금</p>
                    <p className="font-mono text-base text-white mb-2">신협 131-019-861153</p>
                    <p className="text-sm text-gray-500">포천중앙침례교회</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                    <p className="text-sm text-gray-500 mb-2">건축헌금</p>
                    <p className="font-mono text-base text-white mb-2">신협 131-019-861146</p>
                    <p className="text-sm text-gray-500">포천중앙침례교회</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-base">© {new Date().getFullYear()} 포천중앙침례교회. All rights reserved.</p>
              <a href="/admin/login" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-base text-gray-400 hover:text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                관리자
              </a>
            </div>
          </div>
        </footer>
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {/* location 섹션(오시는 길)을 제외한 모든 섹션 표시 */}
      {sections
        .filter((section) => section.kind !== 'location')
        .map((section, index) => (
          <div key={section.id}>
            <SectionRenderer section={section} />
            {/* 히어로 섹션 바로 다음에 QuickLinks 추가 */}
            {section.kind === 'hero' && <QuickLinksSection />}
          </div>
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
