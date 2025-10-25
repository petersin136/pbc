"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";
import CommunitySection from "@/components/sections/CommunitySection";

export default function AboutPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSectionsByPage("about");
      setSections(data);
    } catch (err: unknown) {
      console.error("섹션 로드 오류:", err);
      // 오류 발생해도 일단 화면은 보이게 함
      setError(err instanceof Error ? err.message : "섹션을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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

  // 오류가 있거나 섹션이 없으면 기본 컨텐츠 + 커뮤니티 섹션 표시
  if (error || sections.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 헤더 섹션 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              포천중앙침례교회 소개
            </h1>
            <p className="text-lg text-gray-600">
              하나님의 사랑과 은혜가 가득한 곳
            </p>
          </div>

          {/* 환영 메시지 */}
          <div className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">환영합니다</h2>
            <p className="text-gray-700 leading-relaxed">
              포천중앙침례교회는 하나님의 말씀을 따라 살아가며, 서로 사랑하고 돌보는 공동체입니다.
              우리 교회에 방문하신 모든 분들을 환영합니다.
            </p>
          </div>

          {/* 교회 정보 카드 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">교회 위치</h3>
              <p className="text-gray-600">
                경기도 포천시<br />
                자세한 위치는 교회 안내를 참고해주세요.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">예배 시간</h3>
              <p className="text-gray-600">
                주일 예배<br />
                시간은 교회로 문의해주세요.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">연락처</h3>
              <p className="text-gray-600">
                전화 문의<br />
                교회 사무실로 연락주세요.
              </p>
            </div>
          </div>

          {/* 관리자 안내 메시지 */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                ⚠️ 관리자 안내
              </h3>
              <p className="text-yellow-800 mb-2">
                Supabase 연결 오류가 발생했습니다. 관리자 페이지에서 섹션을 추가하려면 먼저 연결을 확인해주세요.
              </p>
              <p className="text-sm text-yellow-700 font-mono bg-yellow-100 p-2 rounded">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* 교회 공동체 섹션 */}
        <CommunitySection />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
      
      {/* 교회 공동체 섹션 */}
      <CommunitySection />
    </main>
  );
}

