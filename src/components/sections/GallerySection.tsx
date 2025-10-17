"use client";

import { Section } from "@/lib/supabase/sections";
import Image from "next/image";
import { useState } from "react";

/**
 * 갤러리 섹션 컴포넌트
 */
export default function GallerySection({ section }: { section: Section }) {
  const {
    description = "",
    albums = []
  } = section.content;

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");

  // 선택된 앨범의 사진들 필터링
  const filteredAlbums = selectedAlbum === "all" 
    ? albums 
    : albums.filter((album: any) => album.category === selectedAlbum);

  // 모든 카테고리 추출
  const categories = ["all", ...Array.from(new Set(albums.map((album: any) => album.category)))];

  const categoryLabels: { [key: string]: string } = {
    "all": "전체",
    "worship": "예배",
    "event": "행사",
    "youth": "청년부",
    "children": "어린이",
    "mission": "선교",
    "fellowship": "교제"
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-pink-600 mx-auto mb-8"></div>
            {description && (
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* 카테고리 필터 */}
          {albums.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-200">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedAlbum(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                    selectedAlbum === category
                      ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>
          )}

          {/* 갤러리 그리드 */}
          {filteredAlbums.length > 0 ? (
            <div className="space-y-16 animate-fade-in-up animation-delay-400">
              {filteredAlbums.map((album: any, albumIndex: number) => (
                <div key={albumIndex} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {album.title}
                      </h3>
                      {album.date && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {album.date}
                        </p>
                      )}
                    </div>
                    {album.category && (
                      <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        {categoryLabels[album.category] || album.category}
                      </span>
                    )}
                  </div>
                  {album.description && (
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {album.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {album.photos && album.photos.map((photo: any, photoIndex: number) => (
                      <div
                        key={photoIndex}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all transform hover:scale-105"
                        onClick={() => setSelectedImage({ ...photo, albumTitle: album.title })}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.caption || `사진 ${photoIndex + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg">등록된 사진이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 이미지 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full" style={{ maxHeight: "80vh" }}>
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || "사진"}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: "80vh", objectFit: "contain" }}
              />
            </div>
            {(selectedImage.caption || selectedImage.albumTitle) && (
              <div className="mt-4 text-center">
                {selectedImage.albumTitle && (
                  <p className="text-white/60 text-sm mb-1">{selectedImage.albumTitle}</p>
                )}
                {selectedImage.caption && (
                  <p className="text-white text-lg">{selectedImage.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

