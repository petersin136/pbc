"use client";

import { Section } from "@/lib/supabase/sections";
import HeroSection from "./HeroSection";
import InfoCardsSection from "./InfoCardsSection";
import TextSection from "./TextSection";
import ImageSection from "./ImageSection";
import PastorSection from "./PastorSection";
import LocationSection from "./LocationSection";
import DepartmentSection from "./DepartmentSection";
import NurtureSection from "./NurtureSection";
import MissionSection from "./MissionSection";
import NoticesSection from "./NoticesSection";
import PrayerSection from "./PrayerSection";
import GallerySection from "./GallerySection";
import LifeGroupSection from "./LifeGroupSection";
import ImageSliderSection from "./ImageSliderSection";
import FiveKMovementSection from "./FiveKMovementSection";

/**
 * 섹션 타입에 따라 적절한 컴포넌트를 렌더링
 * DB에 실제로 존재하는 섹션 타입만 처리
 */
export default function SectionRenderer({ section }: { section: Section }) {
  switch (section.kind) {
    case "hero":
      return <HeroSection section={section} />;
    case "info-cards":
      return <InfoCardsSection section={section} />;
    case "pastor":
      return <PastorSection section={section} />;
    case "location":
      return <LocationSection section={section} />;
    case "department":
      return <DepartmentSection section={section} />;
    case "nurture":
      return <NurtureSection section={section} />;
    case "mission":
      return <MissionSection section={section} />;
    case "5k-movement":
      return <FiveKMovementSection section={section} />;
    case "notices":
      return <NoticesSection section={section} />;
    case "prayer":
      return <PrayerSection section={section} />;
    case "gallery":
      return <GallerySection section={section} />;
    case "lifegroup":
      return <LifeGroupSection section={section} />;
    case "image-slider":
      return <ImageSliderSection section={section} />;
    case "text":
      return <TextSection section={section} />;
    case "image":
      return <ImageSection section={section} />;
    case "contact":
      // contact 섹션은 아직 컴포넌트가 없음 - 임시로 텍스트 섹션 사용
      return <TextSection section={section} />;
    default:
      // 알 수 없는 타입은 경고와 함께 디버그 정보 표시
      console.warn(`Unknown section kind: ${section.kind}`, section);
      return (
        <section className="py-12 px-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ⚠️ 지원하지 않는 섹션 타입
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <strong>섹션 종류:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">{section.kind}</code>
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>제목:</strong> {section.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    관리자 페이지에서 이 섹션을 삭제하거나 다른 섹션 타입으로 변경해주세요.
                  </p>
                  <details className="bg-gray-50 rounded p-3">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                      🔧 개발자 정보 (디버그)
                    </summary>
                    <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                      {JSON.stringify(section.content, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }
}

