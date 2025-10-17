"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";

export default function NewcomerPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSectionsByPage("nurture-newcomer");
      setSections(data);
    } catch (err: any) {
      console.error("섹션 로드 오류:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
        </div>
      </div>
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

