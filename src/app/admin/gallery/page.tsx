"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * 관리자 갤러리 관리 페이지
 * - Google Drive 폴더 열기
 * - Drive → Supabase 동기화
 */
export default function AdminGalleryPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Google Drive 폴더 ID (환경 변수 또는 고정값)
  const DRIVE_FOLDER_ID = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || "1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO";
  const EVENT_ID = process.env.NEXT_PUBLIC_DRIVE_EVENT_ID || "2";

  /**
   * Google Drive 폴더 열기
   */
  const handleOpenDrive = () => {
    const driveUrl = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;
    window.open(driveUrl, "_blank");
  };

  /**
   * Drive → Supabase 동기화 API 호출
   */
  const handleSyncGallery = async () => {
    try {
      setLoading(true);
      setMessage("🔄 갤러리 동기화 중...");

      const response = await fetch(
        `/api/gallery-sync?folder_id=${DRIVE_FOLDER_ID}&event_id=${EVENT_ID}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("✅ 갤러리 업데이트 완료!");
        alert("✅ 갤러리가 성공적으로 업데이트되었습니다!");
      } else {
        setMessage(`❌ 오류: ${data.error || "알 수 없는 오류"}`);
        alert(`❌ 동기화 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "네트워크 오류";
      setMessage(`❌ 오류: ${errorMessage}`);
      alert(`❌ 동기화 실패: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            관리자 대시보드로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">갤러리 관리</h1>
          <p className="text-gray-600 mt-2">Google Drive 사진을 업로드하고 동기화하세요</p>
        </div>

        {/* 버튼 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* 설명 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 사용 방법</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1️⃣ <strong>"📂 사진 올리기"</strong> 버튼을 클릭하여 Google Drive 폴더를 엽니다</li>
                <li>2️⃣ Drive 폴더에 사진을 업로드합니다</li>
                <li>3️⃣ <strong>"💾 올리기 저장"</strong> 버튼을 클릭하여 사진을 웹사이트에 반영합니다</li>
              </ol>
            </div>

            {/* 폴더 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">📁 현재 폴더 ID:</p>
              <p className="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                {DRIVE_FOLDER_ID}
              </p>
              <p className="text-sm text-gray-600 mt-3 mb-1">🎯 이벤트 ID:</p>
              <p className="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                {EVENT_ID}
              </p>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 1. Google Drive 폴더 열기 버튼 */}
              <button
                onClick={handleOpenDrive}
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                📂 사진 올리기
              </button>

              {/* 2. 동기화 버튼 */}
              <button
                onClick={handleSyncGallery}
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    동기화 중...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    💾 올리기 저장
                  </>
                )}
              </button>
            </div>

            {/* 상태 메시지 */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.includes("✅")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : message.includes("❌")
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 주의사항</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Google Drive API Key가 환경 변수에 설정되어 있어야 합니다</li>
            <li>• 사진 업로드 후 반드시 "올리기 저장" 버튼을 클릭해야 웹사이트에 반영됩니다</li>
            <li>• 동기화에는 몇 초에서 몇 분이 소요될 수 있습니다</li>
            <li>• 대용량 사진은 자동으로 압축되어 저장됩니다</li>
          </ul>
        </div>

        {/* 갤러리 보기 링크 */}
        <div className="mt-6 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            갤러리 페이지 보기
          </Link>
        </div>
      </div>
    </div>
  );
}


