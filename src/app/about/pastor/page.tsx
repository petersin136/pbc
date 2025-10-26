"use client";

import { useEffect, useState } from "react";
import { getSectionsByPage, Section } from "@/lib/supabase/sections";
import SectionRenderer from "@/components/sections/SectionRenderer";
import GreetingSection from "@/components/pastor/GreetingSection";

export default function PastorPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSectionsByPage("about-pastor");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // DB에 섹션이 없으면 기본 콘텐츠 표시
  if (sections.length === 0) {
    return (
      <main className="min-h-screen">
        <GreetingSection
          name="박상구 목사"
          photo="https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/park.png"
          backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          mainText="복음으로 세워지고, 사랑으로 세상을 섬기는 교회!"
          detailText={`사랑하는 포천중앙침례교회 가족 여러분, 그리고 이곳을 방문하신 모든 분들께 주님의 이름으로 환영과 축복의 인사를 드립니다.

우리 교회는 오직 복음만이 생명의 능력임을 믿으며, 예수 그리스도의 십자가와 부활의 복된 소식을 세상에 전하기 위해 존재합니다.

교회의 중심에는 언제나 하나님 말씀이 있고, 말씀을 따라 사랑으로 행하는 공동체가 되기를 소망합니다.

세상은 빠르게 변하지만, 변하지 않는 하나님의 사랑과 진리는 우리를 굳건히 붙들어 줍니다.`}
          quote={`여러분 한 분 한 분이 이 공동체의 귀한 지체로서 예배와 말씀,
사랑과 섬김 안에서 하나님 나라의 기쁨을 함께 누리시길 바랍니다.`}
          bodyText={`포천중앙침례교회는 이 시대의 어둠 속에서도 빛과 소금으로서의 사명을 감당하며, 믿음의 다음 세대를 세우고,
지역 사회를 품는 복음적 교회로 서 가고자 합니다.

여러분 한 분 한 분이 이 공동체의 귀한 지체로서 예배와 말씀, 사랑과 섬김 안에서 하나님 나라의 기쁨을 함께 누리시길 바랍니다.

주님 안에서 여러분의 삶이 날마다 새로워지고, 하나님의 은혜가 가정과 일터 위에 충만히 임하기를 기도합니다.

감사합니다.

포천중앙침례교회
담임목사 박상구 드림`}
        />
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

