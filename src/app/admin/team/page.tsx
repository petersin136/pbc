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
      console.log("섹션 로드 시작:", selectedPage);
      const data = await getSectionsByPage(selectedPage);
      console.log("전체 섹션:", data);
      const teamSections = data.filter((s) => s.kind === "pastor");
      console.log("목사 섹션:", teamSections);
      setSections(teamSections);
    } catch (error) {
      console.error("섹션 로드 오류:", error);
      alert(`섹션을 불러오는데 실패했습니다: ${error instanceof Error ? error.message : String(error)}`);
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
              console.log("저장 시작:", { page: selectedPage, data });
              const allSections = await getSectionsByPage(selectedPage);
              const maxOrder = Math.max(...allSections.map((s) => s.section_order), 0);
              const newSection = await createSection({
                page: selectedPage,
                kind: "pastor",
                title: data.title,
                content: data.content,
                section_order: maxOrder + 1,
              });
              console.log("저장 완료:", newSection);
              
              // 저장 후 즉시 다시 로드
              await loadSections();
              setShowAddModal(false);
              alert("추가되었습니다! 페이지를 새로고침하면 반영됩니다.");
            } catch (error) {
              console.error("추가 오류:", error);
              alert(`추가에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`);
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
              console.log("수정 시작:", { id: editingSection.id, data });
              await updateSection(editingSection.id, {
                title: data.title,
                content: data.content,
              });
              console.log("수정 완료");
              
              // 저장 후 즉시 다시 로드
              await loadSections();
              setEditingSection(null);
              alert("저장되었습니다! 페이지를 새로고침하면 반영됩니다.");
            } catch (error) {
              console.error("저장 오류:", error);
              alert(`저장에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`);
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
  // greeting에서 각 파트 추출
  const existingGreeting = (section?.content.greeting as string) || "";
  const paragraphs = existingGreeting.split("\n\n").filter(p => p.trim());
  
  const [title, setTitle] = useState(section?.title || "");
  const [name, setName] = useState((section?.content.name as string) || "");
  const [position, setPosition] = useState((section?.content.position as string) || "");
  const [image, setImage] = useState((section?.content.image as string) || "");
  
  // 각 섹션별 개별 상태
  const [mainText, setMainText] = useState(paragraphs[0] || "");
  const [detailPart1, setDetailPart1] = useState(paragraphs[1] || "");
  const [detailPart2, setDetailPart2] = useState(paragraphs[2] || "");
  const [detailPart3, setDetailPart3] = useState(paragraphs[3] || "");
  const [quote, setQuote] = useState(paragraphs[4] || "");
  const [bodyText, setBodyText] = useState(paragraphs.slice(5).join("\n\n") || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 모든 단락을 \n\n으로 결합
    const greeting = [
      mainText,
      detailPart1,
      detailPart2,
      detailPart3,
      quote,
      bodyText,
    ].filter(p => p.trim()).join("\n\n");
    
    const content: Record<string, unknown> = {
      name,
      position,
      image,
      greeting,
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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <ImageUploadField
          label="프로필 이미지"
          value={image}
          onChange={setImage}
          placeholder="이미지 URL"
        />

        <div className="border-t-2 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 인사말 내용 (섹션별 입력)</h3>
          
          {/* 1. 대제목 */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <label className="block text-sm font-bold text-blue-900 mb-2">
              1️⃣ 대제목 (파란 박스 상단 - 큰 글씨)
            </label>
            <TextAreaField
              label=""
              value={mainText}
              onChange={setMainText}
              placeholder="예: 복음으로 세워지고, 사랑으로 세상을 섬기는 교회!"
              rows={2}
            />
          </div>

          {/* 2-4. 파란 박스 본문 */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <label className="block text-sm font-bold text-blue-900 mb-2">
              2️⃣~4️⃣ 파란 박스 본문 (3개 단락)
            </label>
            <div className="space-y-3">
              <TextAreaField
                label="첫 번째 단락"
                value={detailPart1}
                onChange={setDetailPart1}
                placeholder="예: 사랑하는 포천중앙침례교회 가족 여러분..."
                rows={3}
              />
              <TextAreaField
                label="두 번째 단락"
                value={detailPart2}
                onChange={setDetailPart2}
                placeholder="우리 교회는..."
                rows={3}
              />
              <TextAreaField
                label="세 번째 단락"
                value={detailPart3}
                onChange={setDetailPart3}
                placeholder="교회의 중심에는..."
                rows={3}
              />
            </div>
          </div>

          {/* 5. 인용구 */}
          <div className="mb-6 p-4 bg-gray-100 border-2 border-gray-400 rounded-lg">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              5️⃣ 중간 인용구 (회색 배경 - 큰 글씨)
            </label>
            <TextAreaField
              label=""
              value={quote}
              onChange={setQuote}
              placeholder="예: 여러분 한 분 한 분이 이 공동체의 귀한 지체로서..."
              rows={3}
            />
          </div>

          {/* 6. 하단 본문 */}
          <div className="mb-6 p-4 bg-white border-2 border-gray-300 rounded-lg">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              6️⃣ 하단 본문 (흰색 배경)
            </label>
            <TextAreaField
              label=""
              value={bodyText}
              onChange={setBodyText}
              placeholder="예: 포천중앙침례교회는... (여러 단락 가능, Enter 2번으로 구분)"
              rows={8}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t-2">
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
