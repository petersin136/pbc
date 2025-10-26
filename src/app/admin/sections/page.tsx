"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSectionsByPage,
  createSection,
  updateSection,
  deleteSection,
  Section,
  SECTION_KINDS,
  PAGES,
} from "@/lib/supabase/sections";
import { hasAdminAccess, signOut } from "@/lib/supabase/auth";

/**
 * 간단한 섹션 관리 페이지
 * - 일반 사용자도 쉽게 사용할 수 있도록 개선
 * - JSON 대신 간단한 폼 제공
 */
export default function AdminSectionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPage, setSelectedPage] = useState("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showFormEditor, setShowFormEditor] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadSections();
    }
  }, [selectedPage]);

  const checkAuth = async () => {
    try {
      const hasAccess = await hasAdminAccess();
      if (!hasAccess) {
        router.push("/admin/login");
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error("인증 확인 오류:", error);
      router.push("/admin/login");
    }
  };

  const loadSections = async () => {
    try {
      setError("");
      const data = await getSectionsByPage(selectedPage);
      setSections(data);
    } catch (err: unknown) {
      console.error("섹션 로드 오류:", err);
      setError(err instanceof Error ? err.message : "섹션을 불러오는데 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const handleAddSection = async (kind: string, title: string) => {
    try {
      setError("");
      const maxOrder = Math.max(...sections.map((s) => s.section_order), 0);
      await createSection({
        page: selectedPage,
        kind,
        title,
        content: {},
        section_order: maxOrder + 1,
      });
      await loadSections();
      setShowAddModal(false);
    } catch (err: unknown) {
      console.error("섹션 추가 오류:", err);
      setError(err instanceof Error ? err.message : "섹션 추가에 실패했습니다.");
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("이 섹션을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setError("");
      await deleteSection(id);
      await loadSections();
    } catch (err: unknown) {
      console.error("섹션 삭제 오류:", err);
      setError(err instanceof Error ? err.message : "섹션 삭제에 실패했습니다.");
    }
  };

  const handleSaveSection = async (id: string, updates: Partial<Section>) => {
    try {
      setError("");
      await updateSection(id, updates);
      await loadSections();
      setEditingSection(null);
      setShowFormEditor(false);
      alert("저장되었습니다! ✅");
    } catch (err: unknown) {
      console.error("섹션 저장 오류:", err);
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = sections[index];
    const previous = sections[index - 1];

    try {
      await updateSection(current.id, { section_order: previous.section_order });
      await updateSection(previous.id, { section_order: current.section_order });
      await loadSections();
    } catch (err: unknown) {
      console.error("순서 변경 오류:", err);
      setError(err instanceof Error ? err.message : "순서 변경에 실패했습니다.");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sections.length - 1) return;
    const current = sections[index];
    const next = sections[index + 1];

    try {
      await updateSection(current.id, { section_order: next.section_order });
      await updateSection(next.id, { section_order: current.section_order });
      await loadSections();
    } catch (err: unknown) {
      console.error("순서 변경 오류:", err);
      setError(err instanceof Error ? err.message : "순서 변경에 실패했습니다.");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 - 모바일 최적화 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="w-full sm:w-auto">
              <Link href="/admin/dashboard" className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 block">
                포천중앙침례교회 관리자
              </Link>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">📝 섹션 관리 (쉬운 편집 모드)</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/"
                target="_blank"
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-xs sm:text-sm text-center"
              >
                🌐 사이트
              </Link>
            <button
              onClick={handleLogout}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-xs sm:text-sm"
            >
              로그아웃
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 - 모바일 최적화 */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* 안내 메시지 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>사용법:</strong> 페이지를 선택하고, 섹션을 추가하거나 수정하세요. 수정 버튼을 누르면 간단한 폼이 나옵니다!
              </p>
            </div>
          </div>
        </div>

        {/* 페이지 선택 & 추가 버튼 - 모바일 최적화 */}
        <div className="flex flex-col gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 w-full">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
              📄 페이지:
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-sm"
            >
              {PAGES.map((page) => (
                <option key={page.value} value={page.value}>
                  {page.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 섹션 추가
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <p className="text-sm font-medium">❌ {error}</p>
          </div>
        )}

        {/* 섹션 목록 */}
        {sections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg font-medium mb-2">
              이 페이지에는 아직 섹션이 없습니다.
            </p>
            <p className="text-gray-400 text-sm">
              &quot;새 섹션 추가&quot; 버튼을 눌러 시작하세요! 📝
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                totalCount={sections.length}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onEdit={() => {
                  setEditingSection(section);
                  setShowFormEditor(true);
                }}
                onDelete={() => handleDeleteSection(section.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 섹션 추가 모달 */}
      {showAddModal && (
        <AddSectionModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSection}
        />
      )}

      {/* 간단한 폼 에디터 모달 */}
      {showFormEditor && editingSection && (
        <SimpleFormEditor
          section={editingSection}
          onClose={() => {
            setEditingSection(null);
            setShowFormEditor(false);
          }}
          onSave={(updates) => handleSaveSection(editingSection.id, updates)}
        />
      )}
    </div>
  );
}

/**
 * 섹션 카드 컴포넌트
 */
function SectionCard({
  section,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: {
  section: Section;
  index: number;
  totalCount: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const kindLabel =
    SECTION_KINDS.find((k) => k.value === section.kind)?.label || section.kind;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 border-2 border-transparent hover:border-blue-100">
      {/* 모바일: 세로 레이아웃 / 데스크탑: 가로 레이아웃 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* 섹션 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap w-fit">
              {kindLabel}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">
              {section.title}
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
            <p className="flex items-center gap-2">
              <span className="font-medium">📊 순서:</span> {section.section_order}번째
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">📦 데이터:</span> {Object.keys(section.content).length}개 항목
            </p>
          </div>
        </div>

        {/* 액션 버튼 - 모바일 최적화 */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* 위/아래 이동 */}
          <div className="flex sm:flex-col gap-2 sm:gap-1">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="flex-1 sm:flex-none p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="위로 이동"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === totalCount - 1}
              className="flex-1 sm:flex-none p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="아래로 이동"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* 수정 버튼 */}
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm text-sm"
            title="내용 수정"
          >
            ✏️ 수정
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium shadow-sm text-sm"
            title="삭제"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 섹션 추가 모달
 */
function AddSectionModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (kind: string, title: string) => void;
}) {
  const [kind, setKind] = useState("text");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(kind, title.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">✨ 새 섹션 추가</h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              📦 섹션 타입
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            >
              {SECTION_KINDS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              ✏️ 섹션 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="예: 메인 배너, 환영 인사 등"
              required
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md text-sm"
            >
              ✅ 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * 간단한 폼 에디터 (섹션 타입별로 맞춤 폼 제공)
 */
function SimpleFormEditor({
  section,
  onClose,
  onSave,
}: {
  section: Section;
  onClose: () => void;
  onSave: (updates: Partial<Section>) => void;
}) {
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState<Record<string, unknown>>(section.content);
  const [uploading, setUploading] = useState(false);
  const [showJsonMode, setShowJsonMode] = useState(false);
  const [jsonContent, setJsonContent] = useState(JSON.stringify(section.content, null, 2));

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      // HTTP 상태 코드 먼저 확인!
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `서버 오류 (${response.status})`);
      }

      const data = await response.json();

      if (data.success && data.images && data.images.length > 0) {
        setContent({
          ...content,
          [field]: data.images[0].url,
        });
        
        // 압축 정보 표시
        const img = data.images[0];
        const message = img.compressed 
          ? `✅ 이미지 업로드 완료!\n📦 압축: ${img.originalSize} → ${img.compressedSize}`
          : "✅ 이미지가 업로드되었습니다!";
        
        alert(message);
      } else {
        throw new Error(data.error || "업로드 실패");
      }
    } catch (error: unknown) {
      console.error("업로드 오류:", error);
      alert(`❌ ${error instanceof Error ? error.message : "업로드 중 오류 발생"}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showJsonMode) {
      try {
        const parsedContent = JSON.parse(jsonContent);
        onSave({ title, content: parsedContent });
      } catch {
        alert("❌ JSON 형식이 올바르지 않습니다.");
      }
    } else {
      onSave({ title, content });
    }
  };

  const renderFields = () => {
    // 공통 필드들
    const commonFields = (
      <>
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
            value={content.heading as string || ""}
            onChange={(e) => setContent({ ...content, heading: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="섹션 제목"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            부제목
          </label>
          <input
            type="text"
            value={content.subheading as string || ""}
            onChange={(e) => setContent({ ...content, subheading: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="부제목"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            설명
          </label>
          <textarea
            value={content.description as string || ""}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            rows={3}
            placeholder="설명 텍스트"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            📸 배경 이미지
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={content.backgroundImage as string || ""}
              onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
              className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="이미지 URL"
            />
            <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
              {uploading ? "업로드중..." : "📁 파일 선택"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "backgroundImage")}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {content.backgroundImage && (
            <img src={content.backgroundImage as string} alt="미리보기" className="mt-2 w-full h-32 object-cover rounded-lg" />
          )}
        </div>
      </>
    );

    return commonFields;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4 overflow-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4 sm:my-8">
        <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-lg sm:text-2xl font-bold">✏️ {section.title} 수정</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            {SECTION_KINDS.find((k) => k.value === section.kind)?.label || section.kind}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* 제목 수정 */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 섹션 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                required
              />
            </div>

            {/* 모드 전환 버튼 */}
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {showJsonMode ? "🔧 전문가 모드" : "😊 간단한 모드"}
                </span>
              <button
                type="button"
                onClick={() => {
                  setShowJsonMode(!showJsonMode);
                  if (!showJsonMode) {
                    setJsonContent(JSON.stringify(content, null, 2));
                  }
                }}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
              >
                {showJsonMode ? "간단히" : "JSON"}
              </button>
            </div>

            {/* 필드 렌더링 */}
            {showJsonMode ? (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  JSON 콘텐츠 (전문가용)
                </label>
            <textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs sm:text-sm"
                  rows={12}
              spellCheck={false}
            />
              </div>
            ) : (
              renderFields()
            )}
          </div>

          <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md text-sm"
            >
              ✅ 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
