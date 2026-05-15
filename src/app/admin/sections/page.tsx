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
import { formatZodError, heroContentSchema, mergeHeroContent, type HeroContent, imageContentSchema, mergeImageContent, type ImageContent, lifegroupContentSchema, mergeLifegroupContent, type LifegroupContent, noticesContentSchema, mergeNoticesContent, type NoticesContent, prayerContentSchema, mergePrayerContent, type PrayerContent, textContentSchema, mergeTextContent, type TextContent } from "@/lib/blocks";

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

  // 기도제목/공지사항 추가용 상태
  const [newPrayer, setNewPrayer] = useState({ title: "", content: "", date: "", category: "", urgent: false, requestedBy: "" });
  const [newNotice, setNewNotice] = useState({ title: "", content: "", date: "", important: false, category: "", author: "" });

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
        if (section.kind === "hero") {
          const pr = heroContentSchema.safeParse(parsedContent);
          if (!pr.success) {
            alert(`Hero 내용 검증 실패:\n${formatZodError(pr.error)}`);
            return;
          }
          const merged = mergeHeroContent(pr.data as HeroContent);
          onSave({ title, content: { ...merged } as Record<string, unknown> });
          return;
        }
        if (section.kind === "text") {
          const pr = textContentSchema.safeParse(parsedContent);
          if (!pr.success) {
            alert(`텍스트 섹션 내용 검증 실패:\n${formatZodError(pr.error)}`);
            return;
          }
          const merged = mergeTextContent(pr.data as TextContent);
          onSave({ title, content: { ...merged } as Record<string, unknown> });
          return;
        }
        if (section.kind === "image") {
          const pr = imageContentSchema.safeParse(parsedContent);
          if (!pr.success) {
            alert(`이미지 섹션 내용 검증 실패:\n${formatZodError(pr.error)}`);
            return;
          }
          const merged = mergeImageContent(pr.data as ImageContent);
          onSave({ title, content: { ...merged } as Record<string, unknown> });
          return;
        }
        if (section.kind === "notices") {
          const pr = noticesContentSchema.safeParse(parsedContent);
          if (!pr.success) {
            alert(`공지사항 내용 검증 실패:\n${formatZodError(pr.error)}`);
            return;
          }
          const merged = mergeNoticesContent(pr.data as NoticesContent, section.content as NoticesContent | null);
          onSave({ title, content: { ...merged } as Record<string, unknown> });
          return;
        }
        if (section.kind === "prayer") {
          const pr = prayerContentSchema.safeParse(parsedContent);
          if (!pr.success) {
            alert(`기도제목 내용 검증 실패:\n${formatZodError(pr.error)}`);
            return;
          }
          const merged = mergePrayerContent(pr.data as PrayerContent, section.content as PrayerContent | null);
          onSave({ title, content: { ...merged } as Record<string, unknown> });
          return;
        }
        if (section.kind === "lifegroup") {
          const pr = lifegroupContentSchema.safeParse(parsedContent);
          if (!pr.success) {
            alert(`목장 내용 검증 실패:\n${formatZodError(pr.error)}`);
            return;
          }
          const merged = mergeLifegroupContent(pr.data as LifegroupContent, section.content as LifegroupContent | null);
          onSave({ title, content: { ...merged } as Record<string, unknown> });
          return;
        }
        onSave({ title, content: parsedContent });
      } catch {
        alert("❌ JSON 형식이 올바르지 않습니다.");
      }
    } else {
      if (section.kind === "hero") {
        const pr = heroContentSchema.safeParse(content);
        if (!pr.success) {
          alert(`Hero 내용 검증 실패:\n${formatZodError(pr.error)}`);
          return;
        }
        const merged = mergeHeroContent(pr.data as HeroContent);
        onSave({ title, content: { ...merged } as Record<string, unknown> });
        return;
      }
      if (section.kind === "text") {
        const pr = textContentSchema.safeParse(content);
        if (!pr.success) {
          alert(`텍스트 섹션 내용 검증 실패:\n${formatZodError(pr.error)}`);
          return;
        }
        const merged = mergeTextContent(pr.data as TextContent);
        onSave({ title, content: { ...merged } as Record<string, unknown> });
        return;
      }
      if (section.kind === "image") {
        const pr = imageContentSchema.safeParse(content);
        if (!pr.success) {
          alert(`이미지 섹션 내용 검증 실패:\n${formatZodError(pr.error)}`);
          return;
        }
        const merged = mergeImageContent(pr.data as ImageContent);
        onSave({ title, content: { ...merged } as Record<string, unknown> });
        return;
      }
      if (section.kind === "notices") {
        const pr = noticesContentSchema.safeParse(content);
        if (!pr.success) {
          alert(`공지사항 내용 검증 실패:\n${formatZodError(pr.error)}`);
          return;
        }
        const merged = mergeNoticesContent(pr.data as NoticesContent, section.content as NoticesContent | null);
        onSave({ title, content: { ...merged } as Record<string, unknown> });
        return;
      }
      if (section.kind === "prayer") {
        const pr = prayerContentSchema.safeParse(content);
        if (!pr.success) {
          alert(`기도제목 내용 검증 실패:\n${formatZodError(pr.error)}`);
          return;
        }
        const merged = mergePrayerContent(pr.data as PrayerContent, section.content as PrayerContent | null);
        onSave({ title, content: { ...merged } as Record<string, unknown> });
        return;
      }
      if (section.kind === "lifegroup") {
        const pr = lifegroupContentSchema.safeParse(content);
        if (!pr.success) {
          alert(`목장 내용 검증 실패:\n${formatZodError(pr.error)}`);
          return;
        }
        const merged = mergeLifegroupContent(pr.data as LifegroupContent, section.content as LifegroupContent | null);
        onSave({ title, content: { ...merged } as Record<string, unknown> });
        return;
      }
      onSave({ title, content });
    }
  };

  // 배열을 텍스트로 변환 (줄바꿈으로 구분)
  const arrayToText = (arr: unknown[]): string => {
    if (!Array.isArray(arr)) return "";
    return arr.map((item) => String(item)).join("\n");
  };

  // 텍스트를 배열로 변환 (줄바꿈으로 구분)
  const textToArray = (text: string): string[] => {
    return text.split("\n").filter((line) => line.trim() !== "");
  };

  const renderFields = () => {
    // 섹션 타입별 맞춤 필드
    switch (section.kind) {
      case "pastor":
        return (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
              <p className="text-xs text-blue-700">
                💡 <strong>참고:</strong> 이 섹션은 실제 웹페이지에 표시되는 필드들입니다. 아래 순서대로 입력하세요.
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                👤 이름
              </label>
              <input
                type="text"
                value={(content.name as string) || ""}
                onChange={(e) => setContent({ ...content, name: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 박상구"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📸 목사님 사진
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.photo as string) || ""}
                  onChange={(e) => setContent({ ...content, photo: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="이미지 URL"
                />
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
                  {uploading ? "업로드중..." : "📁 파일 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "photo")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {content.photo && (
                <img src={content.photo as string} alt="미리보기" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🖼️ 배경 이미지 (산 배경)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.backgroundImage as string) || ""}
                  onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="배경 이미지 URL"
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

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 메인 텍스트 (큰 제목 - 파란 박스 안)
              </label>
              <input
                type="text"
                value={(content.mainText as string) || ""}
                onChange={(e) => setContent({ ...content, mainText: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 복음으로 세워지고, 사랑으로 세상을 섬기는 교회!"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 상세 인사말 (파란 박스 안 본문)
              </label>
              <textarea
                value={(content.detailText as string) || ""}
                onChange={(e) => setContent({ ...content, detailText: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={6}
                placeholder="인사말 본문을 입력하세요 (여러 줄 가능)"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                💬 인용구 (회색 배경 섹션)
              </label>
              <textarea
                value={(content.quote as string) || ""}
                onChange={(e) => setContent({ ...content, quote: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
                placeholder="인용구를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📄 하단 본문 (흰 배경 섹션)
              </label>
              <textarea
                value={(content.bodyText as string) || ""}
                onChange={(e) => setContent({ ...content, bodyText: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={8}
                placeholder="하단 본문을 입력하세요 (여러 줄 가능)"
              />
            </div>
          </>
        );

      case "location":
        return (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 설명
              </label>
              <textarea
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="교회 위치 안내 설명"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🏠 도로명 주소
              </label>
              <input
                type="text"
                value={(content.roadAddress as string) || ""}
                onChange={(e) => setContent({ ...content, roadAddress: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 경기 포천시 중앙로105번길 23-2"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🏘️ 지번 주소
              </label>
              <input
                type="text"
                value={(content.jibunAddress as string) || ""}
                onChange={(e) => setContent({ ...content, jibunAddress: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 경기 포천시 신읍동 135-10"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📞 전화번호
              </label>
              <input
                type="text"
                value={(content.phone as string) || ""}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 031-1234-5678"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🚗 주차 안내
              </label>
              <input
                type="text"
                value={(content.parking as string) || ""}
                onChange={(e) => setContent({ ...content, parking: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 교회 주차장 이용 가능 (20대)"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🚌 대중교통 안내
              </label>
              <input
                type="text"
                value={(content.bus as string) || ""}
                onChange={(e) => setContent({ ...content, bus: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 버스: 37, 38번 이용 (신읍동 정류장 하차)"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🚙 자가용 안내
              </label>
              <input
                type="text"
                value={(content.car as string) || ""}
                onChange={(e) => setContent({ ...content, car: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 네비게이션: '포천중앙침례교회' 또는 주소 검색"
              />
            </div>
          </>
        );

      case "department":
        return (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📋 부서명
              </label>
              <input
                type="text"
                value={(content.departmentName as string) || ""}
                onChange={(e) => setContent({ ...content, departmentName: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="부서명"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 설명
              </label>
              <textarea
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={4}
                placeholder="부서 소개"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🎨 색상
              </label>
              <select
                value={(content.color as string) || "blue"}
                onChange={(e) => setContent({ ...content, color: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="blue">파란색</option>
                <option value="purple">보라색</option>
                <option value="green">초록색</option>
                <option value="pink">분홍색</option>
                <option value="orange">주황색</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📸 이미지
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.image as string) || ""}
                  onChange={(e) => setContent({ ...content, image: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="이미지 URL"
                />
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
                  {uploading ? "업로드중..." : "📁 파일 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {content.image && (
                <img src={content.image as string} alt="미리보기" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📞 연락처 - 담당자 이름
              </label>
              <input
                type="text"
                value={((content.contact as { name?: string })?.name as string) || ""}
                onChange={(e) => setContent({ ...content, contact: { ...(content.contact as object), name: e.target.value } })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="담당자 이름"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📞 연락처 - 전화번호
              </label>
              <input
                type="text"
                value={((content.contact as { phone?: string })?.phone as string) || ""}
                onChange={(e) => setContent({ ...content, contact: { ...(content.contact as object), phone: e.target.value } })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="전화번호"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📧 연락처 - 이메일
              </label>
              <input
                type="email"
                value={((content.contact as { email?: string })?.email as string) || ""}
                onChange={(e) => setContent({ ...content, contact: { ...(content.contact as object), email: e.target.value } })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="이메일"
              />
            </div>
          </>
        );

      case "nurture":
        return (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📋 프로그램명
              </label>
              <input
                type="text"
                value={(content.programName as string) || ""}
                onChange={(e) => setContent({ ...content, programName: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="프로그램명"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 설명
              </label>
              <textarea
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={4}
                placeholder="프로그램 소개"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🎨 색상
              </label>
              <select
                value={(content.color as string) || "orange"}
                onChange={(e) => setContent({ ...content, color: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="blue">파란색</option>
                <option value="purple">보라색</option>
                <option value="green">초록색</option>
                <option value="orange">주황색</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📸 이미지
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.image as string) || ""}
                  onChange={(e) => setContent({ ...content, image: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="이미지 URL"
                />
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
                  {uploading ? "업로드중..." : "📁 파일 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {content.image && (
                <img src={content.image as string} alt="미리보기" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>
          </>
        );

      case "hero":
        return (
      <>
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
                value={(content.heading as string) || ""}
                onChange={(e) => setContent({ ...content, heading: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="메인 제목"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                부제목
              </label>
              <input
                type="text"
                value={(content.subheading as string) || ""}
                onChange={(e) => setContent({ ...content, subheading: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="부제목"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📸 배경 이미지
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.backgroundImage as string) || ""}
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

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📹 배경 동영상 URL
              </label>
              <input
                type="text"
                value={(content.backgroundVideo as string) || ""}
                onChange={(e) => setContent({ ...content, backgroundVideo: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="동영상 URL"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📖 성경 구절 (한글)
              </label>
              <textarea
                value={(content.verse as string) || ""}
                onChange={(e) => setContent({ ...content, verse: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="성경 구절"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📖 성경 구절 (영어)
              </label>
              <textarea
                value={(content.verseEn as string) || ""}
                onChange={(e) => setContent({ ...content, verseEn: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="Bible verse in English"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📖 성경 구절 출처
              </label>
              <input
                type="text"
                value={(content.verseReference as string) || ""}
                onChange={(e) => setContent({ ...content, verseReference: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="예: 요한복음 3:16"
              />
            </div>
          </>
        );

      case "text":
        return (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={(content.heading as string) || ""}
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
                value={(content.subheading as string) || ""}
                onChange={(e) => setContent({ ...content, subheading: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="부제목"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                본문 텍스트
              </label>
              <textarea
                value={(content.text as string) || (content.description as string) || ""}
                onChange={(e) => setContent({ ...content, text: e.target.value, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={6}
                placeholder="본문 내용"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={(content.alignment as string) || "center"}
                onChange={(e) => setContent({ ...content, alignment: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="center">가운데</option>
                <option value="left">왼쪽</option>
                <option value="right">오른쪽</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📸 배경 이미지
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.backgroundImage as string) || ""}
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

      case "image":
        return (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={(content.heading as string) || ""}
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
                value={(content.subheading as string) || ""}
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
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
                placeholder="설명 텍스트"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📸 이미지
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.backgroundImage as string) || (content.src as string) || (content.image as string) || (content.url as string) || ""}
                  onChange={(e) => setContent({ ...content, backgroundImage: e.target.value, src: e.target.value, image: e.target.value, url: e.target.value })}
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
              {(content.backgroundImage || content.src || content.image || content.url) && (
                <img src={(content.backgroundImage || content.src || content.image || content.url) as string} alt="미리보기" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                캡션
              </label>
              <input
                type="text"
                value={(content.caption as string) || ""}
                onChange={(e) => setContent({ ...content, caption: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="이미지 캡션"
              />
            </div>
          </>
        );

      case "prayer":
        const prayers = (content.prayers as Array<Record<string, unknown>>) || [];
        
        return (
          <>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 mb-4 rounded">
              <p className="text-xs text-purple-700">
                💡 <strong>참고:</strong> 기도제목은 카드 형태로 표시됩니다. 아래에서 각 기도제목을 추가하세요.
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🖼️ 헤더 이미지 (상단 큰 이미지) <span className="text-gray-500 font-normal">(선택사항)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.headerImage as string) || ""}
                  onChange={(e) => setContent({ ...content, headerImage: e.target.value || undefined })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="이미지 URL (선택사항 - 비워두면 이미지 없음)"
                />
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
                  {uploading ? "업로드중..." : "📁 파일 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "headerImage")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {content.headerImage && (content.headerImage as string).trim() !== "" && (
                <div className="mt-2">
                  <img src={content.headerImage as string} alt="미리보기" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setContent({ ...content, headerImage: undefined })}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    이미지 제거
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 섹션 설명
              </label>
              <textarea
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="기도제목 섹션 상단에 표시될 설명"
              />
            </div>

            {/* 기존 기도제목 목록 */}
            {prayers.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  📋 등록된 기도제목 ({prayers.length}개)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3">
                  {prayers.map((prayer, idx) => (
                    <div key={idx} className="bg-purple-50 p-2 rounded flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                        {idx + 1}. {prayer.title as string || "제목 없음"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = prayers.filter((_, i) => i !== idx);
                          setContent({ ...content, prayers: updated });
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-xs"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 기도제목 추가 폼 */}
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="text-sm font-bold text-gray-900 mb-3">➕ 새 기도제목 추가</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">제목 *</label>
                  <input
                    type="text"
                    value={newPrayer.title}
                    onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="예: 환우들을 위한 기도"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">내용 *</label>
                  <textarea
                    value={newPrayer.content}
                    onChange={(e) => setNewPrayer({ ...newPrayer, content: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    rows={3}
                    placeholder="기도 내용을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">날짜 *</label>
                    <input
                      type="date"
                      value={newPrayer.date}
                      onChange={(e) => setNewPrayer({ ...newPrayer, date: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">분류</label>
                    <input
                      type="text"
                      value={newPrayer.category}
                      onChange={(e) => setNewPrayer({ ...newPrayer, category: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      placeholder="예: 치유"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPrayer.urgent}
                      onChange={(e) => setNewPrayer({ ...newPrayer, urgent: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">긴급</span>
                  </label>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">요청자</label>
                    <input
                      type="text"
                      value={newPrayer.requestedBy}
                      onChange={(e) => setNewPrayer({ ...newPrayer, requestedBy: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      placeholder="예: 교회"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newPrayer.title && newPrayer.content && newPrayer.date) {
                      const updated = [...prayers, { ...newPrayer }];
                      setContent({ ...content, prayers: updated });
                      setNewPrayer({ title: "", content: "", date: "", category: "", urgent: false, requestedBy: "" });
                    } else {
                      alert("제목, 내용, 날짜는 필수입니다.");
                    }
                  }}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm"
                >
                  ➕ 기도제목 추가
                </button>
              </div>
            </div>
          </>
        );

      case "notices":
        const notices = (content.notices as Array<Record<string, unknown>>) || [];
        
        return (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
              <p className="text-xs text-blue-700">
                💡 <strong>참고:</strong> 공지사항은 카드 형태로 표시됩니다. 아래에서 각 공지사항을 추가하세요.
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🖼️ 헤더 이미지 (상단 큰 이미지) <span className="text-gray-500 font-normal">(선택사항)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.headerImage as string) || ""}
                  onChange={(e) => setContent({ ...content, headerImage: e.target.value || undefined })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="이미지 URL (선택사항 - 비워두면 이미지 없음)"
                />
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
                  {uploading ? "업로드중..." : "📁 파일 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "headerImage")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {content.headerImage && (content.headerImage as string).trim() !== "" && (
                <div className="mt-2">
                  <img src={content.headerImage as string} alt="미리보기" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setContent({ ...content, headerImage: undefined })}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    이미지 제거
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 섹션 설명
              </label>
              <textarea
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="공지사항 섹션 상단에 표시될 설명"
              />
            </div>

            {/* 기존 공지사항 목록 */}
            {notices.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  📋 등록된 공지사항 ({notices.length}개)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3">
                  {notices.map((notice, idx) => (
                    <div key={idx} className="bg-blue-50 p-2 rounded flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                        {idx + 1}. {notice.title as string || "제목 없음"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = notices.filter((_, i) => i !== idx);
                          setContent({ ...content, notices: updated });
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-xs"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 공지사항 추가 폼 */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="text-sm font-bold text-gray-900 mb-3">➕ 새 공지사항 추가</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">제목 *</label>
                  <input
                    type="text"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="예: 새해 예배 안내"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">내용 *</label>
                  <textarea
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    placeholder="공지사항 내용을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">날짜 *</label>
                    <input
                      type="date"
                      value={newNotice.date}
                      onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">분류</label>
                    <input
                      type="text"
                      value={newNotice.category}
                      onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="예: 예배"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newNotice.important}
                      onChange={(e) => setNewNotice({ ...newNotice, important: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">중요</span>
                  </label>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">작성자</label>
                    <input
                      type="text"
                      value={newNotice.author}
                      onChange={(e) => setNewNotice({ ...newNotice, author: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="예: 교회"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newNotice.title && newNotice.content && newNotice.date) {
                      const updated = [...notices, { ...newNotice }];
                      setContent({ ...content, notices: updated });
                      setNewNotice({ title: "", content: "", date: "", important: false, category: "", author: "" });
                    } else {
                      alert("제목, 내용, 날짜는 필수입니다.");
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                >
                  ➕ 공지사항 추가
                </button>
              </div>
            </div>
          </>
        );

      case "5k-movement":
        return (
          <>
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
              <p className="text-xs text-red-700">
                💡 <strong>참고:</strong> 5K 운동 섹션은 자동으로 예쁜 양식으로 표시됩니다. 기본 내용이 포함되어 있으며 필요시 수정하세요.
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🖼️ 히어로 이미지 (상단 큰 이미지) <span className="text-gray-500 font-normal">(선택사항)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={(content.heroImage as string) || ""}
                  onChange={(e) => setContent({ ...content, heroImage: e.target.value || undefined })}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="이미지 URL (선택사항 - 비워두면 이미지 없음)"
                />
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-medium whitespace-nowrap text-center text-sm">
                  {uploading ? "업로드중..." : "📁 파일 선택"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "heroImage")}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {content.heroImage && (content.heroImage as string).trim() !== "" && (
                <div className="mt-2">
                  <img src={content.heroImage as string} alt="미리보기" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setContent({ ...content, heroImage: undefined })}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    이미지 제거
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 부제목
              </label>
              <input
                type="text"
                value={(content.subtitle as string) || ""}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="NCMN 5대 운동 중 하나로써..."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📄 교회 부흥 운동 설명
              </label>
              <textarea
                value={(content.description as string) || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                rows={4}
                placeholder="교회 반경, 내가 사는 반경 5km안에 있는 복음이 필요한 모든 분께 찾아가 맞춤형 섬김으로 영혼구원에 이르게 하는 사역"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📋 4대 사역 커스터마이징 (JSON 형식 - 선택사항)
              </label>
              <textarea
                value={JSON.stringify((content.fourMinistries as unknown[]) || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setContent({ ...content, fourMinistries: parsed });
                  } catch {
                    // JSON 파싱 실패 시 무시
                  }
                }}
                className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                rows={8}
                placeholder={`예시:
[
  {
    "title": "복음전파사역",
    "icon": "📖",
    "description": "설명...",
    "color": "from-blue-500 to-blue-600",
    "bgColor": "bg-blue-50",
    "borderColor": "border-blue-200"
  }
]`}
              />
              <p className="text-xs text-gray-500 mt-1">
                비워두면 기본 4대 사역이 표시됩니다. JSON 형식으로 커스터마이징 가능합니다.
              </p>
            </div>
          </>
        );

      default:
        // 기본 공통 필드들
        return (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={(content.heading as string) || ""}
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
                value={(content.subheading as string) || ""}
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
                value={(content.description as string) || ""}
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
                  value={(content.backgroundImage as string) || ""}
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
    }
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
