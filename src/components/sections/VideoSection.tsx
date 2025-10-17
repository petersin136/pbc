"use client";

import { Section } from "@/lib/supabase/sections";

/**
 * Video 섹션 컴포넌트
 * - YouTube 임베드
 */
export default function VideoSection({ section }: { section: Section }) {
  const { videoUrl = "", embedId = "" } = section.content;

  // YouTube URL에서 ID 추출
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : embedId;
  };

  const youtubeId = embedId || getYouTubeId(videoUrl);

  if (!youtubeId) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          {section.title}
        </h2>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={section.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

