"use client";

import { useState } from "react";
import Link from "next/link";

// 유튜브 ID 추출 함수
function getYouTubeID(url: string): string | null {
  if (!url) return null;
  
  // /live/ 형식 처리
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];
  
  // 일반 watch?v= 형식 처리
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// 설교 카테고리 데이터 (나중에 Supabase로 대체 가능)
const sermonCategories = [
  {
    id: "sunday",
    name: "주일예배",
    icon: "⛪",
    color: "from-blue-500 to-blue-600",
    sermons: [
      {
        id: 1,
        title: "주일 낮 예배 설교",
        date: "2025-01-19",
        youtubeUrl: "https://www.youtube.com/live/iBDTgLNICm4?si=mZmaF_G6sPDvAJmd",
        speaker: "담임목사",
      },
    ],
  },
  {
    id: "evening",
    name: "주일저녁",
    icon: "🌙",
    color: "from-purple-500 to-purple-600",
    sermons: [
      {
        id: 1,
        title: "주일 저녁 예배 설교",
        date: "2025-01-19",
        youtubeUrl: "https://www.youtube.com/live/NDjkPkfPN1c?si=sR8E4jBIJty7NnGT",
        speaker: "담임목사",
      },
    ],
  },
  {
    id: "wednesday",
    name: "수요예배",
    icon: "📖",
    color: "from-green-500 to-green-600",
    sermons: [
      {
        id: 1,
        title: "수요 예배 설교",
        date: "2025-01-15",
        youtubeUrl: "https://www.youtube.com/live/mFMOr7KQoXw?si=YXujpkTW9fyNWvGI",
        speaker: "담임목사",
      },
    ],
  },
  {
    id: "friday",
    name: "금요기도회",
    icon: "🙏",
    color: "from-orange-500 to-orange-600",
    sermons: [],
  },
  {
    id: "dawn",
    name: "새벽예배",
    icon: "🌅",
    color: "from-pink-500 to-pink-600",
    sermons: [
      {
        id: 1,
        title: "새벽 예배 설교",
        date: "2025-01-20",
        youtubeUrl: "https://www.youtube.com/live/CBXRY5gpab8?si=hziAQXBkN4kAhb-F",
        speaker: "담임목사",
      },
    ],
  },
];

export default function SermonsPage() {
  const [activeCategory, setActiveCategory] = useState("sunday");
  const [selectedSermon, setSelectedSermon] = useState<{ id: number; title: string; date: string; youtubeUrl: string; speaker: string } | null>(null);

  const currentCategory = sermonCategories.find((cat) => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            설교 영상
          </h1>
          <p className="text-lg text-gray-600">
            주일 설교 영상 및 음성 파일을 시청하실 수 있습니다
          </p>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sermonCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setSelectedSermon(null);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* 설교 콘텐츠 */}
        <div className="max-w-6xl mx-auto">
          {selectedSermon ? (
            /* 선택된 설교 영상 */
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <button
                onClick={() => setSelectedSermon(null)}
                className="mb-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                목록으로 돌아가기
              </button>

              <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 mb-6">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeID(selectedSermon.youtubeUrl)}`}
                  title={selectedSermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedSermon.title}
              </h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>📅 {selectedSermon.date}</span>
                <span>👤 {selectedSermon.speaker}</span>
              </div>
            </div>
          ) : (
            /* 설교 목록 */
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-4xl`}>{currentCategory?.icon}</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentCategory?.name}
                </h2>
              </div>

              {currentCategory && currentCategory.sermons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCategory.sermons.map((sermon) => (
                    <div
                      key={sermon.id}
                      onClick={() => setSelectedSermon(sermon)}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
                    >
                      {/* 썸네일 */}
                      <div className="relative aspect-video bg-gray-200">
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeID(sermon.youtubeUrl)}/maxresdefault.jpg`}
                          alt={sermon.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 정보 */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {sermon.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                          <span>📅 {sermon.date}</span>
                          <span>👤 {sermon.speaker}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* 설교 없을 때 */
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">{currentCategory?.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    아직 등록된 설교가 없습니다
                  </h3>
                  <p className="text-gray-600 mb-6">
                    곧 업데이트 예정입니다
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    홈으로 돌아가기
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
