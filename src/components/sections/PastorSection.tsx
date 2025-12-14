"use client";

import { Section } from "@/lib/supabase/sections";
import GreetingSection from "@/components/pastor/GreetingSection";

export default function PastorSection({ section }: { section: Section }) {
  const {
    name = "박상구",
    position = "담임목사",
    image,
    greeting = "",
  } = section.content;

  // greeting을 단락별로 분리
  // \n\n으로 구분된 단락들을 그대로 사용
  const paragraphs = (greeting as string).split("\n\n").filter(p => p.trim());
  
  const mainText = paragraphs[0] || "복음으로 세워지고, 사랑으로 세상을 섬기는 교회!";
  const detailText = paragraphs.slice(1, 4).join("\n\n") || "";
  const quote = paragraphs[4] || "여러분 한 분 한 분이 이 공동체의 귀한 지체로서 예배와 말씀,\n사랑과 섬김 안에서 하나님 나라의 기쁨을 함께 누리시길 바랍니다.";
  const bodyText = paragraphs.slice(5).join("\n\n") || "";

  return (
    <GreetingSection
      name={`${name} ${position}`.trim()}
      photo={(image as string) || "https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/park.png"}
      backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
      mainText={mainText}
      detailText={detailText}
      quote={quote}
      bodyText={bodyText}
    />
  );
}

