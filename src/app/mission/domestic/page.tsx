"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";
import FiveKMovementSection from "@/components/sections/FiveKMovementSection";

export default function DomesticMissionPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSectionsByPage("mission-domestic");
      // 5k-movement 타입 섹션만 필터링 (기존 mission 섹션 제외)
      const fiveKSections = data.filter((s) => s.kind === "5k-movement");
      setSections(fiveKSections);
    } catch (err) {
      console.error("섹션 로드 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 5K 운동 섹션이 없으면 기본 5K 운동 섹션 표시
  if (sections.length === 0) {
    const defaultSection: Section = {
      id: "default-5k",
      page: "mission-domestic",
      kind: "5k-movement",
      title: "5K운동이란?",
      content: {
        subtitle: "NCMN 5대 운동 중 하나로써 내가 속한 반경 5km 안의 절대필요가 있는 이웃들에게 예수님의 4대 사역을 펼치는 운동",
        description: "교회 반경, 내가 사는 반경 5km안에 있는 복음이 필요한 모든 분께 찾아가 맞춤형 섬김으로 영혼구원에 이르게 하는 사역",
      },
      section_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return (
      <main className="min-h-screen">
        <FiveKMovementSection section={defaultSection} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
