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
  formatZodError,
  infoCardBlockSchema,
  infoCardsContentSchema,
  mergeInfoCardsContent,
  type InfoCardBlock,
  type InfoCardsContent,
} from "@/lib/blocks";
import { z } from "zod";
import {
  SectionCard,
  EmptyState,
  LoadingSpinner,
  Modal,
  TextField,
  TextAreaField,
} from "@/components/admin/AdminComponents";

/**
 * 정보 카드 관리 페이지
 */
export default function ContentCardsAdminPage() {
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
      const cardSections = data.filter((s) => s.kind === "info-cards" || s.kind === "cards");
      setSections(cardSections);
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
    if (!confirm("이 정보 카드를 삭제하시겠습니까?")) {
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
      alert("순서 변경에 실패했습니다.");
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
      alert("순서 변경에 실패했습니다.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">📋 정보 카드 관리</h1>
        <p className="text-gray-600 mb-4">
          정보를 카드 형태로 표시하는 섹션을 관리합니다. (예: 예배 시간, 말씀 영상 등)
        </p>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            페이지 선택:
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
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
          새 정보 카드 추가
        </button>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon="📋"
          title="정보 카드가 없습니다"
          description="이 페이지에는 아직 정보 카드가 없습니다. 새로 추가해보세요!"
          actionLabel="정보 카드 추가"
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
        <CardFormModal
          page={selectedPage}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              const maxOrder = Math.max(...sections.map((s) => s.section_order), 0);
              await createSection({
                page: selectedPage,
                kind: "info-cards",
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
        <CardFormModal
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

function cardsFromSection(section?: Section): InfoCardBlock[] {
  if (!section?.content || typeof section.content !== "object") return [];
  const raw = (section.content as { cards?: unknown }).cards;
  if (!Array.isArray(raw)) return [];
  const r = z.array(infoCardBlockSchema).safeParse(raw);
  return r.success ? r.data : [];
}

/**
 * 카드 폼 모달
 */
function CardFormModal({
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
  const [description, setDescription] = useState((section?.content.description as string) || "");
  const [cards, setCards] = useState<InfoCardBlock[]>(() => cardsFromSection(section));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const prevContent =
      section?.content && typeof section.content === "object"
        ? { ...(section.content as Record<string, unknown>) }
        : {};

    const prevCards = Array.isArray(prevContent.cards) ? (prevContent.cards as InfoCardBlock[]) : [];
    const mergedCards = cards.map((card, index) => ({
      ...(typeof prevCards[index] === "object" && prevCards[index] !== null ? prevCards[index] : {}),
      ...card,
    }));

    const draft = {
      ...prevContent,
      heading,
      description,
      cards: mergedCards,
    };

    const pr = infoCardsContentSchema.safeParse(draft);
    if (!pr.success) {
      alert(`정보 카드 내용 검증 실패:\n${formatZodError(pr.error)}`);
      return;
    }

    const merged = mergeInfoCardsContent(pr.data as InfoCardsContent);
    await onSave({ title, content: { ...merged } as Record<string, unknown> });
  };

  const addCard = () => {
    setCards([...cards, { title: "", description: "", icon: "📌" }]);
  };

  const updateCard = (index: number, field: keyof InfoCardBlock, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <Modal title={section ? "정보 카드 수정" : "새 정보 카드 추가"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="섹션 제목 (관리용)"
          value={title}
          onChange={setTitle}
          placeholder="예: 예배 시간 안내"
          required
        />

        <TextField
          label="대제목"
          value={heading}
          onChange={setHeading}
          placeholder="섹션 대제목"
        />

        <TextAreaField
          label="설명"
          value={description}
          onChange={setDescription}
          placeholder="섹션 설명"
          rows={2}
        />

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">카드 목록</h3>
            <button
              type="button"
              onClick={addCard}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              + 카드 추가
            </button>
          </div>

          {cards.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">카드를 추가하세요</p>
          ) : (
            <div className="space-y-3">
              {cards.map((card, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">카드 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={card.icon || ""}
                      onChange={(e) => updateCard(index, "icon", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="아이콘 (예: 📌)"
                    />
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="카드 제목"
                      required
                    />
                    <textarea
                      value={card.description}
                      onChange={(e) => updateCard(index, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="카드 설명"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ✅ 저장
          </button>
        </div>
      </form>
    </Modal>
  );
}


