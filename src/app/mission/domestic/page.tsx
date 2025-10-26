"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";
import EmptyPagePlaceholder from "@/components/sections/EmptyPagePlaceholder";

export default function DomesticMissionPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSectionsByPage("mission-domestic");
      setSections(data);
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

  if (sections.length === 0) {
    return <EmptyPagePlaceholder title="국내선교" description="우리나라 복음화를 위하여" />;
  }

  return (
    <main className="min-h-screen">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
