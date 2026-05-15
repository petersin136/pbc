"use client";

import { useEffect, useState } from "react";
import {
  getSectionsByPage,
  createSection,
  updateSection,
  deleteSection,
  Section,
} from "@/lib/supabase/sections";
import {
  formatZodError,
  mergeNoticesContent,
  noticesContentSchema,
  type NoticeItem,
  type NoticesContent,
} from "@/lib/blocks";
import {
  SectionCard,
  EmptyState,
  LoadingSpinner,
  Modal,
  TextField,
  TextAreaField,
} from "@/components/admin/AdminComponents";

export default function AnnouncementsAdminPage() {
  const PAGE_ID = "news-notices"; // 고정된 페이지 ID
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await getSectionsByPage(PAGE_ID);
      const noticeSections = data.filter((s) => s.kind === "notices");
      setSections(noticeSections);
    } catch (error) {
      console.error("섹션 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (section: Section) => setEditingSection(section);

  const handleDelete = async (id: string) => {
    if (!confirm("이 공지사항을 삭제하시겠습니까?")) return;
    try {
      await deleteSection(id);
      await loadSections();
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">📢 공지사항 관리</h1>
        <p className="text-gray-600 mb-4">
          교회 공지사항을 작성하고 관리합니다.
        </p>

        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 공지사항 추가
        </button>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="📢"
          title="공지사항이 없습니다"
          description="아직 공지사항이 없습니다. 새로 추가해보세요!"
          actionLabel="공지사항 추가"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onEdit={() => handleEdit(section)}
              onDelete={() => handleDelete(section.id)}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AnnouncementFormModal
          page={PAGE_ID}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              // 전체 페이지의 섹션 조회
              const allSections = await getSectionsByPage(PAGE_ID);
              
              // Hero 섹션의 order 찾기
              const heroSection = allSections.find((s) => s.kind === "hero");
              const heroOrder = heroSection?.section_order || 0;
              
              // 기존 notices 섹션들의 order를 +1 증가 (아래로 밀어내기)
              const noticeSections = allSections.filter((s) => s.kind === "notices");
              for (const section of noticeSections) {
                await updateSection(section.id, { section_order: section.section_order + 1 });
              }
              
              // 새 섹션을 Hero 바로 다음에 추가
              await createSection({
                page: PAGE_ID,
                kind: "notices",
                title: data.title,
                content: data.content,
                section_order: heroOrder + 1,
              });
              await loadSections();
              setShowAddModal(false);
              alert("추가되었습니다!");
            } catch (error) {
              console.error("추가 오류:", error);
              alert("추가에 실패했습니다.");
            }
          }}
        />
      )}

      {editingSection && (
        <AnnouncementFormModal
          page={PAGE_ID}
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={async (data) => {
            try {
              await updateSection(editingSection.id, {
                title: data.title,
                content: data.content,
              });
              await loadSections();
              setEditingSection(null);
              alert("저장되었습니다!");
            } catch (error) {
              console.error("저장 오류:", error);
              alert("저장에 실패했습니다.");
            }
          }}
        />
      )}
    </div>
  );
}

function AnnouncementFormModal({
  page,
  section,
  onClose,
  onSave,
}: {
  page: string;
  section?: Section;
  onClose: () => void;
  onSave: (data: { title: string; content: Record<string, unknown> }) => Promise<void>;
}) {
  const [title, setTitle] = useState(section?.title || "");
  const [description, setDescription] = useState((section?.content.description as string) || "");
  const [notices, setNotices] = useState<NoticeItem[]>(
    (section?.content.notices as NoticeItem[] | undefined) || []
  );

  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    important: false,
    category: "",
    author: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prev =
      section?.content && typeof section.content === "object"
        ? { ...(section.content as Record<string, unknown>) }
        : {};
    const draft = { ...prev, description, notices };
    const pr = noticesContentSchema.safeParse(draft);
    if (!pr.success) {
      alert(`공지사항 내용 검증 실패:\n${formatZodError(pr.error)}`);
      return;
    }
    const merged = mergeNoticesContent(pr.data as NoticesContent, section?.content as NoticesContent | null);
    await onSave({ title, content: { ...merged } as Record<string, unknown> });
  };

  const addNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      alert("제목과 내용은 필수입니다.");
      return;
    }
    setNotices([...notices, { ...newNotice }]);
    setNewNotice({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      important: false,
      category: "",
      author: "",
    });
  };

  const removeNotice = (index: number) => {
    setNotices(notices.filter((_, i) => i !== index));
  };

  return (
    <Modal title={section ? "공지사항 수정" : "새 공지사항 추가"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="섹션 제목 (관리용)"
          value={title}
          onChange={setTitle}
          placeholder="예: 주간 공지사항"
          required
        />

        <TextAreaField
          label="섹션 설명"
          value={description}
          onChange={setDescription}
          placeholder="공지사항 섹션 상단에 표시될 설명"
          rows={2}
        />

        {/* 기존 공지사항 목록 */}
        {notices.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">등록된 공지사항 ({notices.length}개)</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notices.map((notice, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{notice.title}</span>
                    <span className="text-xs text-gray-600 ml-2">({notice.date})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNotice(idx)}
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
            <input
              type="text"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
              placeholder="제목 *"
            />
            <textarea
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
              rows={3}
              placeholder="공지사항 내용 *"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newNotice.date}
                onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                placeholder="분류"
              />
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
              <input
                type="text"
                value={newNotice.author}
                onChange={(e) => setNewNotice({ ...newNotice, author: e.target.value })}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                placeholder="작성자"
              />
            </div>
            <button
              type="button"
              onClick={addNotice}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
            >
              ➕ 공지사항 추가
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            ✅ 저장
          </button>
        </div>
      </form>
    </Modal>
  );
}

