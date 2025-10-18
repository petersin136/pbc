"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getAllCategories,
  getCategoryByNameEn,
  getEventsByCategory,
  GalleryCategory,
  GalleryEvent,
} from "@/lib/supabase/gallery";

export default function CategoryGalleryPage() {
  const params = useParams();
  const categoryName = params.category as string;

  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<GalleryCategory | null>(null);
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [categoryName]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [catsData, categoryData] = await Promise.all([
        getAllCategories(),
        getCategoryByNameEn(categoryName),
      ]);

      setCategories(catsData);

      if (!categoryData) {
        setError("카테고리를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      setCurrentCategory(categoryData);

      const eventsData = await getEventsByCategory(categoryData.id);
      setEvents(eventsData);
    } catch (err: unknown) {
      console.error("데이터 로드 오류:", err);
      setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다.");
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

  if (error || !currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">오류가 발생했습니다</p>
          <p className="mt-2">{error || "카테고리를 찾을 수 없습니다."}</p>
          <Link
            href="/gallery"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            갤러리 홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              📸 {currentCategory.name_kr}
            </h1>
            {currentCategory.description && (
              <p className="text-lg md:text-xl text-blue-100">
                {currentCategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/gallery"
              className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              전체 보기
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/gallery/${category.name_en}`}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  category.name_en === categoryName
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name_kr}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 이벤트 그리드 */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {currentCategory.name_kr}의 갤러리가 아직 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/gallery/event/${event.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* 커버 이미지 */}
                  <div className="relative h-64 bg-gray-200">
                    {event.cover_url ? (
                      <img
                        src={event.cover_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg
                          className="w-20 h-20 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(event.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {event.description && (
                      <p className="text-gray-600 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

