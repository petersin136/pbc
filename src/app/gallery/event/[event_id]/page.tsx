"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getEventById,
  getPhotosByEvent,
  GalleryEvent,
  GalleryPhoto,
  getGoogleDriveThumbnailUrl,
} from "@/lib/supabase/gallery";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.event_id as string);

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNaN(eventId)) {
      loadData();
    }
  }, [eventId]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [eventData, photosData] = await Promise.all([
        getEventById(eventId),
        getPhotosByEvent(eventId),
      ]);

      if (!eventData) {
        setError("이벤트를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      setEvent(eventData);
      setPhotos(photosData);
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

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">오류가 발생했습니다</p>
          <p className="mt-2">{error || "이벤트를 찾을 수 없습니다."}</p>
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* 뒤로가기 */}
            <Link
              href={event.category ? `/gallery/${event.category.name_en}` : "/gallery"}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {event.category ? event.category.name_kr : "갤러리"} 목록으로
            </Link>

            {/* 이벤트 정보 */}
            <div>
              {event.category && (
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                  {event.category.name_kr}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{event.title}</h1>
              <p className="text-lg text-blue-100 mb-2">
                {new Date(event.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {event.description && (
                <p className="text-white/90 mt-4">{event.description}</p>
              )}
              <p className="text-sm text-white/80 mt-4">총 {photos.length}장의 사진</p>
            </div>
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
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={getGoogleDriveThumbnailUrl(photo.file_url)}
                    alt={photo.file_name || `사진 ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
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

      {/* 라이트박스 모달 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={getGoogleDriveThumbnailUrl(selectedPhoto.file_url).replace('w400', 'w1200')}
              alt={selectedPhoto.file_name || "사진"}
              className="w-full h-full object-contain"
            />
            {selectedPhoto.file_name && (
              <p className="text-white text-center mt-4">{selectedPhoto.file_name}</p>
            )}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
                if (currentIndex > 0) {
                  setSelectedPhoto(photos[currentIndex - 1]);
                }
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors"
              disabled={photos.findIndex((p) => p.id === selectedPhoto.id) === 0}
            >
              이전
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
                if (currentIndex < photos.length - 1) {
                  setSelectedPhoto(photos[currentIndex + 1]);
                }
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors"
              disabled={
                photos.findIndex((p) => p.id === selectedPhoto.id) === photos.length - 1
              }
            >
              다음
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

