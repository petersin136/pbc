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

export default function TeamAdminPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPage, setSelectedPage] = useState("about");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    loadSections();
  }, [selectedPage]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await getSectionsByPage(selectedPage);
      const teamSections = data.filter((s) => s.kind === "pastor");
      setSections(teamSections);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">👤 목사 인사말 관리</h1>
        <p className="text-gray-600 mb-4">
          담임목사 인사말 및 소개를 관리합니다.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">페이지 선택:</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {PAGES.map((page) => (
              <option key={page.value} value={page.value}>{page.label}</option>
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
          새 인사말 추가
        </button>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="👤"
          title="목사 인사말이 없습니다"
          description="목사님의 인사말을 추가해보세요."
          actionLabel="인사말 추가"
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
        <PastorFormModal
          page={selectedPage}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              const allSections = await getSectionsByPage(selectedPage);
              const maxOrder = Math.max(...allSections.map((s) => s.section_order), 0);
              await createSection({
                page: selectedPage,
                kind: "pastor",
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
        <PastorFormModal
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

function PastorFormModal({
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
  const [name, setName] = useState((section?.content.name as string) || "");
  const [position, setPosition] = useState((section?.content.position as string) || "");
  const [image, setImage] = useState((section?.content.image as string) || "");
  const [greeting, setGreeting] = useState((section?.content.greeting as string) || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content: Record<string, unknown> = {
      name,
      position,
      image,
      greeting, // HTML 형식으로 저장
    };
    await onSave({ title, content });
  };

  return (
    <Modal title={section ? "목사 인사말 수정" : "새 목사 인사말 추가"} onClose={onClose} size="large">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="섹션 제목 (관리용)"
          value={title}
          onChange={setTitle}
          placeholder="예: 담임목사 인사말"
          required
        />

        <TextField
          label="목사님 성함"
          value={name}
          onChange={setName}
          placeholder="예: 박상구"
          required
        />

        <TextField
          label="직책"
          value={position}
          onChange={setPosition}
          placeholder="예: 담임목사"
          required
        />

        <ImageUploadField
          label="프로필 이미지"
          value={image}
          onChange={setImage}
          placeholder="이미지 URL"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            인사말 내용
          </label>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>📝 작성 가이드:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li><strong>1번째 단락:</strong> 대제목 (파란 박스 상단)</li>
              <li><strong>2~4번째 단락:</strong> 파란 박스 본문</li>
              <li><strong>5번째 단락:</strong> 중간 인용구 (회색 배경)</li>
              <li><strong>6번째 이후:</strong> 하단 본문 (흰색 배경)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              💡 단락 구분은 <strong>Enter 2번</strong> (빈 줄 추가)으로 하세요!
            </p>
          </div>
          <TextAreaField
            label=""
            value={greeting}
            onChange={setGreeting}
            placeholder="인사말을 입력하세요. 각 단락은 Enter 2번으로 구분합니다."
            rows={20}
          />
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
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
}
