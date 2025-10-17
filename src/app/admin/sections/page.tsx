"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSectionsByPage,
  createSection,
  updateSection,
  deleteSection,
  updateSectionsOrder,
  Section,
  SECTION_KINDS,
  PAGES,
} from "@/lib/supabase/sections";
import { hasAdminAccess, signOut } from "@/lib/supabase/auth";

/**
 * 섹션 관리 페이지
 * - 페이지별 섹션 목록 표시
 * - 섹션 추가/수정/삭제
 * - 섹션 순서 변경
 * - JSON 에디터로 content 수정
 */
export default function AdminSectionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPage, setSelectedPage] = useState("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [error, setError] = useState("");

  // 인증 확인
  useEffect(() => {
    checkAuth();
  }, []);

  // 페이지 변경 시 섹션 로드
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

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      setError("");
      await updateSection(id, { section_order: newOrder });
      await loadSections();
    } catch (err: unknown) {
      console.error("순서 변경 오류:", err);
      setError(err instanceof Error ? err.message : "순서 변경에 실패했습니다.");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = sections[index];
    const previous = sections[index - 1];

    try {
      setError("");
      await updateSectionsOrder([
        { id: current.id, section_order: previous.section_order },
        { id: previous.id, section_order: current.section_order },
      ]);
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
      setError("");
      await updateSectionsOrder([
        { id: current.id, section_order: next.section_order },
        { id: next.id, section_order: current.section_order },
      ]);
      await loadSections();
    } catch (err: unknown) {
      console.error("순서 변경 오류:", err);
      setError(err instanceof Error ? err.message : "순서 변경에 실패했습니다.");
    }
  };

  const handleSaveContent = async (id: string, content: string) => {
    try {
      setError("");
      const parsedContent = JSON.parse(content);
      await updateSection(id, { content: parsedContent });
      await loadSections();
      setEditingSection(null);
      setShowContentEditor(false);
    } catch (err: unknown) {
      console.error("콘텐츠 저장 오류:", err);
      if (err instanceof SyntaxError) {
        setError("JSON 형식이 올바르지 않습니다.");
      } else {
        setError(err instanceof Error ? err.message : "콘텐츠 저장에 실패했습니다.");
      }
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
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
                포천중앙침례교회
              </Link>
              <p className="text-sm text-gray-600 mt-1">섹션 관리</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 페이지 선택 & 추가 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              페이지 선택:
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            섹션 추가
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            role="alert"
          >
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 섹션 목록 */}
        {sections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">
              이 페이지에는 아직 섹션이 없습니다.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              &quot;섹션 추가&quot; 버튼을 눌러 새 섹션을 만들어보세요.
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
                  setShowContentEditor(true);
                }}
                onDelete={() => handleDeleteSection(section.id)}
                onUpdateOrder={(newOrder) =>
                  handleUpdateOrder(section.id, newOrder)
                }
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

      {/* JSON 에디터 모달 */}
      {showContentEditor && editingSection && (
        <ContentEditorModal
          section={editingSection}
          onClose={() => {
            setEditingSection(null);
            setShowContentEditor(false);
          }}
          onSave={(content) => handleSaveContent(editingSection.id, content)}
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
  onUpdateOrder,
}: {
  section: Section;
  index: number;
  totalCount: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateOrder: (order: number) => void;
}) {
  const [orderInput, setOrderInput] = useState(section.section_order.toString());

  const kindLabel =
    SECTION_KINDS.find((k) => k.value === section.kind)?.label || section.kind;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {kindLabel}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {section.title}
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            <p>
              순서:{" "}
              <input
                type="number"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                onBlur={() => {
                  const newOrder = parseInt(orderInput);
                  if (!isNaN(newOrder) && newOrder !== section.section_order) {
                    onUpdateOrder(newOrder);
                  } else {
                    setOrderInput(section.section_order.toString());
                  }
                }}
                className="w-20 px-2 py-1 border border-gray-300 rounded ml-2"
              />
            </p>
            <p className="mt-1 text-xs">
              Content 키 개수: {Object.keys(section.content).length}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2">
          {/* 위/아래 이동 */}
          <div className="flex flex-col gap-1">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="위로 이동"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === totalCount - 1}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="아래로 이동"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* 수정 버튼 */}
          <button
            onClick={onEdit}
            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="내용 수정"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
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
  const [kind, setKind] = useState("hero");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(kind, title.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">새 섹션 추가</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              섹션 타입
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              섹션 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 메인 히어로"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * JSON 에디터 모달
 */
function ContentEditorModal({
  section,
  onClose,
  onSave,
}: {
  section: Section;
  onClose: () => void;
  onSave: (content: string) => void;
}) {
  const [content, setContent] = useState(
    JSON.stringify(section.content, null, 2)
  );
  const [jsonError, setJsonError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleChange = (value: string) => {
    setContent(value);
    try {
      JSON.parse(value);
      setJsonError("");
    } catch {
      setJsonError("JSON 형식이 올바르지 않습니다.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.images) {
        // JSON에 이미지 추가
        const parsedContent = JSON.parse(content);
        
        // images 배열이 없으면 생성
        if (!parsedContent.images) {
          parsedContent.images = [];
        }

        // 새 이미지들 추가
        data.images.forEach((img: { url: string; alt: string }) => {
          parsedContent.images.push({
            url: img.url,
            alt: img.alt,
          });
        });

        // JSON 업데이트
        const updatedContent = JSON.stringify(parsedContent, null, 2);
        setContent(updatedContent);
        setUploadMessage(
          `✅ ${data.images.length}개의 이미지가 추가되었습니다!`
        );
      } else {
        setUploadMessage(`❌ ${data.error || "업로드 실패"}`);
      }
    } catch (error: unknown) {
      console.error("업로드 오류:", error);
      setUploadMessage(`❌ ${error instanceof Error ? error.message : "업로드 중 오류 발생"}`);
    } finally {
      setUploading(false);
      // 파일 입력 초기화
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonError) {
      onSave(content);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">{section.title} - 내용 수정</h2>
          <p className="text-sm text-gray-600 mt-1">
            JSON 형식으로 섹션 내용을 편집하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            {/* 이미지 업로드 버튼 */}
            <div className="mb-4 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all cursor-pointer shadow-md hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? "업로드 중..." : "📸 이미지 업로드"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              
              {uploadMessage && (
                <span className={`text-sm font-medium ${uploadMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                  {uploadMessage}
                </span>
              )}
            </div>

            {/* JSON 에디터 */}
            <textarea
              value={content}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-full min-h-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              spellCheck={false}
            />
            {jsonError && (
              <p className="text-red-600 text-sm mt-2">{jsonError}</p>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!!jsonError}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

