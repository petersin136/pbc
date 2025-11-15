"use client";

import { Section } from "@/lib/supabase/sections";
import GreetingSection from "@/components/pastor/GreetingSection";

export default function PastorSection({ section }: { section: Section }) {
  const {
    name = "박상구",
    title = "목사",
    photo,
    description = "",
    education = [],
    ministry = [],
    // GreetingSection 필드들
    backgroundImage,
    mainText,
    detailText,
    quote,
    bodyText,
  } = section.content;

  // name에서 "목사" 제거 (GreetingSection이 자동으로 추가)
  const displayName = (name as string).replace(/\s*목사\s*$/, "").trim() || "박상구";
  
  // 항상 GreetingSection 사용 (실제 웹페이지와 일치)
  return (
    <GreetingSection
      name={displayName ? `${displayName} 목사` : "담임목사"}
      photo={(photo as string) || "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/park.png"}
      backgroundImage={(backgroundImage as string) || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"}
      mainText={(mainText as string) || "복음으로 세워지고, 사랑으로 세상을 섬기는 교회!"}
      detailText={(detailText as string) || (description as string) || ""}
      quote={(quote as string) || ""}
      bodyText={(bodyText as string) || ""}
    />
  );
}

