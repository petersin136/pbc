"use client";

import { Section } from "@/lib/supabase/sections";
import {
  mergeBlockDefaults,
  mergeHeroContent,
  mergeImageContent,
  mergeInfoCardsContent,
  mergeLifegroupContent,
  mergeNoticesContent,
  mergePrayerContent,
  mergeTextContent,
  parseBlockContent,
  type HeroContent,
  type ImageContent,
  type InfoCardsContent,
  type LifegroupContent,
  type NoticesContent,
  type PrayerContent,
  type TextContent,
} from "@/lib/blocks";
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

function ContentParseFailure({
  kind,
  title,
  error,
}: {
  kind: string;
  title: string;
  error: string;
}) {
  return (
    <section className="py-12 px-4 bg-red-50 border-l-4 border-red-400">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-red-800 mb-2">블록 content 검증 실패 (개발 전용)</h3>
          <p className="text-sm text-gray-700 mb-1">
            <strong>kind:</strong> <code className="bg-gray-100 px-1 rounded">{kind}</code>
          </p>
          <p className="text-sm text-gray-700 mb-3">
            <strong>제목:</strong> {title}
          </p>
          <pre className="text-xs text-red-700 whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-100">{error}</pre>
        </div>
      </div>
    </section>
  );
}

function sectionMeta(section: Section) {
  return {
    id: section.id,
    page: section.page,
    kind: section.kind,
    title: section.title,
  };
}

/**
 * 섹션 타입에 따라 적절한 컴포넌트를 렌더링
 * DB에 실제로 존재하는 섹션 타입만 처리
 */
export default function SectionRenderer({ section }: { section: Section }) {
  const parsed = parseBlockContent(section.kind, section.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      return (
        <ContentParseFailure
          kind={section.kind}
          title={section.title}
          error={parsed.error ?? "알 수 없는 오류"}
        />
      );
    }
    return null;
  }

  const mergedContent = mergeBlockDefaults(section.kind, parsed.data);
  const safeSection: Section = { ...section, content: mergedContent };

  switch (section.kind) {
    case "hero":
      return (
        <HeroSection
          meta={sectionMeta(section)}
          content={mergeHeroContent(parsed.data as HeroContent)}
        />
      );
    case "info-cards":
      return (
        <InfoCardsSection
          meta={sectionMeta(section)}
          content={mergeInfoCardsContent(parsed.data as InfoCardsContent)}
        />
      );
    case "pastor":
      return <PastorSection section={safeSection} />;
    case "location":
      return <LocationSection section={safeSection} />;
    case "department":
      return <DepartmentSection section={safeSection} />;
    case "nurture":
      return <NurtureSection section={safeSection} />;
    case "mission":
      return <MissionSection section={safeSection} />;
    case "5k-movement":
      return <FiveKMovementSection section={safeSection} />;
    case "notices":
      return (
        <NoticesSection
          meta={sectionMeta(section)}
          content={mergeNoticesContent(parsed.data as NoticesContent)}
        />
      );
    case "prayer":
      return (
        <PrayerSection
          meta={sectionMeta(section)}
          content={mergePrayerContent(parsed.data as PrayerContent)}
        />
      );
    case "gallery":
      return <GallerySection section={safeSection} />;
    case "lifegroup":
      return (
        <LifeGroupSection
          meta={sectionMeta(section)}
          content={mergeLifegroupContent(parsed.data as LifegroupContent)}
        />
      );
    case "image-slider":
      return <ImageSliderSection section={safeSection} />;
    case "text":
      return (
        <TextSection
          meta={sectionMeta(section)}
          content={mergeTextContent(parsed.data as TextContent)}
        />
      );
    case "image":
      return (
        <ImageSection
          meta={sectionMeta(section)}
          content={mergeImageContent(parsed.data as ImageContent)}
        />
      );
    case "contact": {
      const textParsed = parseBlockContent("text", section.content);
      if (!textParsed.success) {
        if (process.env.NODE_ENV === "development") {
          return (
            <ContentParseFailure
              kind={`${section.kind} (text 스키마)`}
              title={section.title}
              error={textParsed.error ?? "알 수 없는 오류"}
            />
          );
        }
        return null;
      }
      return (
        <TextSection
          meta={sectionMeta(section)}
          content={mergeTextContent(textParsed.data as TextContent)}
        />
      );
    }
    default:
      console.warn(`Unknown section kind: ${section.kind}`, section);
      return (
        <section className="py-12 px-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">⚠️ 지원하지 않는 섹션 타입</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>섹션 종류:</strong>{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{section.kind}</code>
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
