"use client";

import { Section } from "@/lib/supabase/sections";
import HeroSection from "./HeroSection";
import InfoCardsSection from "./InfoCardsSection";
import TextSection from "./TextSection";
import ImageSection from "./ImageSection";
import VideoSection from "./VideoSection";
import CardsSection from "./CardsSection";
import WelcomeSection from "./WelcomeSection";
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

/**
 * 섹션 타입에 따라 적절한 컴포넌트를 렌더링
 */
export default function SectionRenderer({ section }: { section: Section }) {
  switch (section.kind) {
    case "hero":
      return <HeroSection section={section} />;
    case "info-cards":
      return <InfoCardsSection section={section} />;
    case "welcome":
      return <WelcomeSection section={section} />;
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
    case "video":
      return <VideoSection section={section} />;
    case "cards":
      return <CardsSection section={section} />;
    case "contact":
      // contact 섹션은 제거됨 - 아무것도 렌더링하지 않음
      return null;
    default:
      // 알 수 없는 타입은 기본 텍스트로 표시
      return (
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <pre className="text-sm text-gray-600 bg-white p-4 rounded-lg overflow-auto">
              {JSON.stringify(section.content, null, 2)}
            </pre>
          </div>
        </section>
      );
  }
}

