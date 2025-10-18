"use client";

import { Section } from "@/lib/supabase/sections";
import { useState } from "react";

export default function LocationSection({ section }: { section: Section }) {
  const {
    roadAddress = "경기 포천시 중앙로105번길 23-2",
    jibunAddress = "경기 포천시 신읍동 135-10",
    phone = "031-1234-5678",
    parking = "교회 주차장 이용 가능 (20대)",
    bus = "버스: 37, 38번 이용 (신읍동 정류장 하차)",
    car = "네비게이션: '포천중앙침례교회' 또는 주소 검색",
    description = "포천중앙침례교회를 찾아오시는 길을 안내해 드립니다."
  } = section.content;

  const [copied, setCopied] = useState(false);

  // 주소 복사
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(roadAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  // 구글 맵 임베드 URL
  const googleMapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(roadAddress)}&zoom=17`;
  
  // 외부 지도 링크
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(roadAddress)}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(roadAddress)}`;
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(roadAddress)}`;

  return (
    <section id="location" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* 제목 */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* 왼쪽: 구글 맵 */}
            <div className="order-2 lg:order-1 animate-fade-in-up animation-delay-200">
              <div className="relative w-full h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                  src={googleMapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
            </div>

            {/* 오른쪽: 주소 정보 + 교통 안내 */}
            <div className="order-1 lg:order-2 space-y-6 animate-fade-in-up animation-delay-400">
              {/* 주소 카드 */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">교회 주소</h3>
                    
                    {/* 도로명 주소 */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">도로명</p>
                      <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {roadAddress}
                      </p>
                    </div>

                    {/* 지번 주소 */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">지번</p>
                      <p className="text-sm text-gray-600">
                        {jibunAddress}
                      </p>
                    </div>

                    {/* 복사 버튼 */}
                    <button
                      onClick={copyAddress}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          복사됨!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          주소 복사
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 전화번호 */}
                {phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">전화문의</p>
                      <a href={`tel:${phone}`} className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* 주차 안내 */}
                {parking && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">주차안내</p>
                      <p className="text-sm font-medium text-gray-900">{parking}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 교통 안내 카드 */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">🚗</span>
                  오시는 길
                </h3>
                <div className="space-y-4">
                  {/* 대중교통 */}
                  {bus && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-1">대중교통</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{bus}</p>
                      </div>
                    </div>
                  )}

                  {/* 자가용 */}
                  {car && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-1">자가용</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{car}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 지도 앱 링크 */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">지도 앱에서 보기</h4>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href={naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:bg-green-50 hover:border-green-200 border-2 border-transparent transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      N
                    </div>
                    <span className="text-xs font-medium text-gray-700">네이버</span>
                  </a>
                  <a
                    href={kakaoMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:bg-yellow-50 hover:border-yellow-200 border-2 border-transparent transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">
                      K
                    </div>
                    <span className="text-xs font-medium text-gray-700">카카오</span>
                  </a>
                  <a
                    href={googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      G
                    </div>
                    <span className="text-xs font-medium text-gray-700">구글</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
