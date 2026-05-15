"use client";

import { useEffect, useState } from "react";
import {
  getSectionsByPage,
  createSection,
  updateSection,
  deleteSection,
  Section,
  PAGES,
} from "@/lib/supabase/sections";
import { formatZodError, mergeTextContent, textContentSchema, type TextContent } from "@/lib/blocks";
import {
  SectionCard,
  EmptyState,
  LoadingSpinner,
  Modal,
  TextField,
  TextAreaField,
  ImageUploadField,
  SelectField,
} from "@/components/admin/AdminComponents";

/**
 * 텍스트 섹션 관리 페이지
 */
export default function TextSectionsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPage, setSelectedPage] = useState("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    loadSections();
  }, [selectedPage]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await getSectionsByPage(selectedPage);
      const textSections = data.filter((s) => s.kind === "text");
      setSections(textSections);
    } catch (error) {
      console.error("섹션 로드 오류:", error);
      alert("섹션을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 텍스트 섹션을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteSection(id);
      await loadSections();
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제에 실패했습니다.");
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
    } catch (error) {
      console.error("순서 변경 오류:", error);
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
    } catch (error) {
      console.error("순서 변경 오류:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">📝 텍스트 섹션 관리</h1>
        <p className="text-gray-600 mb-4">
          텍스트 기반 콘텐츠를 관리합니다. 제목, 본문, 배경 이미지 등을 설정할 수 있습니다.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            페이지 선택:
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {PAGES.map((page) => (
              <option key={page.value} value={page.value}>
                {page.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 텍스트 섹션 추가
        </button>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="📝"
          title="텍스트 섹션이 없습니다"
          description="이 페이지에는 아직 텍스트 섹션이 없습니다."
          actionLabel="텍스트 섹션 추가"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              onEdit={() => handleEdit(section)}
              onDelete={() => handleDelete(section.id)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < sections.length - 1}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <TextFormModal
          page={selectedPage}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              const maxOrder = Math.max(...sections.map((s) => s.section_order), 0);
              await createSection({
                page: selectedPage,
                kind: "text",
                title: data.title,
                content: data.content,
                section_order: maxOrder + 1,
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
        <TextFormModal
          page={selectedPage}
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

function TextFormModal({
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
  const [heading, setHeading] = useState((section?.content.heading as string) || "");
  const [subheading, setSubheading] = useState((section?.content.subheading as string) || "");
  const [text, setText] = useState((section?.content.text as string) || (section?.content.description as string) || "");
  const [backgroundImage, setBackgroundImage] = useState((section?.content.backgroundImage as string) || "");
  const [alignment, setAlignment] = useState((section?.content.alignment as string) || "center");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const prev =
      section?.content && typeof section.content === "object"
        ? { ...(section.content as Record<string, unknown>) }
        : {};
    const draft = {
      ...prev,
      heading,
      subheading,
      text,
      description: text,
      alignment,
      backgroundImage: backgroundImage.trim(),
    };

    const pr = textContentSchema.safeParse(draft);
    if (!pr.success) {
      alert(`텍스트 섹션 내용 검증 실패:\n${formatZodError(pr.error)}`);
      return;
    }

    const merged = mergeTextContent(pr.data as TextContent);
    await onSave({ title, content: { ...merged } as Record<string, unknown> });
  };

  return (
    <Modal title={section ? "텍스트 섹션 수정" : "새 텍스트 섹션 추가"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="섹션 제목 (관리용)"
          value={title}
          onChange={setTitle}
          placeholder="예: 교회 소개"
          required
        />

        <TextField
          label="대제목"
          value={heading}
          onChange={setHeading}
          placeholder="메인 제목"
        />

        <TextField
          label="부제목"
          value={subheading}
          onChange={setSubheading}
          placeholder="부제목"
        />

        <TextAreaField
          label="본문 텍스트"
          value={text}
          onChange={setText}
          placeholder="본문 내용을 입력하세요"
          rows={6}
        />

        <SelectField
          label="정렬"
          value={alignment}
          onChange={setAlignment}
          options={[
            { value: "center", label: "가운데" },
            { value: "left", label: "왼쪽" },
            { value: "right", label: "오른쪽" },
          ]}
        />

        <ImageUploadField
          label="배경 이미지 (선택사항)"
          value={backgroundImage}
          onChange={setBackgroundImage}
          placeholder="배경 이미지 URL"
        />

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


