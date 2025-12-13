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
  SectionCard,
  EmptyState,
  LoadingSpinner,
  Modal,
  TextField,
  TextAreaField,
  ImageUploadField,
  SelectField,
} from "@/components/admin/AdminComponents";

export default function SundaySchoolAdminPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const PAGE_ID = "education-sunday-school";

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await getSectionsByPage(PAGE_ID);
      setSections(data);
    } catch (error) {
      console.error("섹션 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (section: Section) => setEditingSection(section);

  const handleDelete = async (id: string) => {
    if (!confirm("이 섹션을 삭제하시겠습니까?")) return;
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">✏️ 주일학교 관리</h1>
        <p className="text-gray-600 mb-4">
          주일학교 페이지의 콘텐츠를 관리합니다.
        </p>

        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 섹션 추가
        </button>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="✏️"
          title="섹션이 없습니다"
          description="주일학교 페이지에 아직 섹션이 없습니다."
          actionLabel="섹션 추가"
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
        <SectionFormModal
          page={PAGE_ID}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              const maxOrder = Math.max(...sections.map((s) => s.section_order), 0);
              await createSection({
                page: PAGE_ID,
                kind: data.kind,
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
        <SectionFormModal
          page={PAGE_ID}
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={async (data) => {
            try {
              await updateSection(editingSection.id, {
                kind: data.kind,
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

function SectionFormModal({
  page,
  section,
  onClose,
  onSave,
}: {
  page: string;
  section?: Section;
  onClose: () => void;
  onSave: (data: { kind: string; title: string; content: Record<string, unknown> }) => Promise<void>;
}) {
  const [kind, setKind] = useState(section?.kind || "text");
  const [title, setTitle] = useState(section?.title || "");
  const [heading, setHeading] = useState((section?.content.heading as string) || "");
  const [description, setDescription] = useState((section?.content.description as string) || "");
  const [image, setImage] = useState((section?.content.backgroundImage as string) || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content: Record<string, unknown> = {
      heading,
      description,
    };
    if (image) content.backgroundImage = image;
    await onSave({ kind, title, content });
  };

  return (
    <Modal title={section ? "섹션 수정" : "새 섹션 추가"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="섹션 타입"
          value={kind}
          onChange={setKind}
          options={[
            { value: "text", label: "텍스트 섹션" },
            { value: "image", label: "이미지 섹션" },
            { value: "hero", label: "Hero 배너" },
            { value: "department", label: "부서 안내" },
          ]}
        />

        <TextField
          label="섹션 제목 (관리용)"
          value={title}
          onChange={setTitle}
          placeholder="예: 주일학교 소개"
          required
        />

        <TextField
          label="대제목"
          value={heading}
          onChange={setHeading}
          placeholder="메인 제목"
        />

        <TextAreaField
          label="설명"
          value={description}
          onChange={setDescription}
          placeholder="섹션 설명"
          rows={4}
        />

        <ImageUploadField
          label="이미지 (선택사항)"
          value={image}
          onChange={setImage}
          placeholder="이미지 URL"
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

