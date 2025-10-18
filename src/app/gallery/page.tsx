"use client";

import { useEffect, useState } from "react";
import { getAllPhotos, getAllCategories, getPhotosByEvent, getAllEvents, getGoogleDriveThumbnailUrl, GalleryPhoto, GalleryCategory, GalleryEvent } from "@/lib/supabase/gallery";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [photosData, categoriesData, eventsData] = await Promise.all([
        getAllPhotos(),
        getAllCategories(),
        getAllEvents()
      ]);
      setAllPhotos(photosData);
      setPhotos(photosData);
      setCategories(categoriesData);
      setEvents(eventsData);
    } catch (err: unknown) {
      console.error("데이터 로드 오류:", err);
      setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryNameEn: string) => {
    setActiveCategory(categoryNameEn);
    
    if (categoryNameEn === "all") {
      setPhotos(allPhotos);
      return;
    }

    // 해당 카테고리의 이벤트들 찾기
    const categoryEvents = events.filter(
      event => event.category?.name_en === categoryNameEn
    );

    // 각 이벤트의 사진들 가져오기
    const photoPromises = categoryEvents.map(event => 
      getPhotosByEvent(event.id)
    );
    
    const photoArrays = await Promise.all(photoPromises);
    const filteredPhotos = photoArrays.flat();
    
    setPhotos(filteredPhotos);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">오류가 발생했습니다</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* 카테고리 필터 */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => filterByCategory("all")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              전체사진
            </button>
            <button
              onClick={() => filterByCategory("church-event")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "church-event"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              교회행사
            </button>
            <button
              onClick={() => filterByCategory("adults")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "adults"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              장년부
            </button>
            <button
              onClick={() => filterByCategory("youth")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "youth"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              청년부
            </button>
            <button
              onClick={() => filterByCategory("students")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "students"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              중고등부
            </button>
            <button
              onClick={() => filterByCategory("children")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "children"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              주일학교
            </button>
            <button
              onClick={() => filterByCategory("preschool")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "preschool"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              유치부
            </button>
            <button
              onClick={() => filterByCategory("choir")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === "choir"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              성가대
            </button>
          </div>
        </div>
      </section>

      {/* 사진 그리드 */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-12">
          {photos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">아직 등록된 사진이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <img
                    alt={photo.file_name || `사진 ${photo.id}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    src={getGoogleDriveThumbnailUrl(photo.file_url)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 이미지 모달 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              aria-label="닫기"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={getGoogleDriveThumbnailUrl(selectedPhoto.file_url).replace('sz=w400', 'sz=w1200')}
              alt={selectedPhoto.file_name || `사진 ${selectedPhoto.id}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </main>
  );
}
