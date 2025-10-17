/**
 * Sections 관리를 위한 Supabase 헬퍼 함수
 */

import { supabase } from "./client";

/**
 * Section 타입 정의
 */
export interface Section {
  id: string;
  page: string;
  kind: string;
  title: string;
  content: Record<string, unknown>;
  section_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

/**
 * 페이지별 섹션 목록 가져오기
 */
export async function getSectionsByPage(page: string): Promise<Section[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("page", page)
    .order("section_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * 모든 섹션 가져오기
 */
export async function getAllSections(): Promise<Section[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("page", { ascending: true })
    .order("section_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * 특정 섹션 가져오기
 */
export async function getSectionById(id: string): Promise<Section | null> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * 섹션 생성
 */
export async function createSection(
  section: Omit<Section, "id" | "created_at" | "updated_at" | "created_by">
): Promise<Section> {
  const { data, error } = await supabase
    .from("sections")
    .insert([section])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * 섹션 수정
 */
export async function updateSection(
  id: string,
  updates: Partial<Omit<Section, "id" | "created_at" | "updated_at" | "created_by">>
): Promise<Section> {
  const { data, error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * 섹션 삭제
 */
export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * 섹션 순서 변경 (여러 섹션 한번에)
 */
export async function updateSectionsOrder(
  updates: { id: string; section_order: number }[]
): Promise<void> {
  // 각 섹션 순서 업데이트
  const promises = updates.map((update) =>
    supabase
      .from("sections")
      .update({ section_order: update.section_order })
      .eq("id", update.id)
  );

  const results = await Promise.all(promises);

  // 에러 체크
  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error("섹션 순서 변경 중 오류가 발생했습니다.");
  }
}

/**
 * 섹션 Kind 목록 (추가할 수 있는 섹션 타입)
 */
export const SECTION_KINDS = [
  { value: "hero", label: "Hero 배너" },
  { value: "info-cards", label: "정보 카드 (말씀영상 + 이미지)" },
  { value: "welcome", label: "환영 메시지" },
  { value: "pastor", label: "목사님 소개" },
  { value: "location", label: "교회 위치 (지도)" },
  { value: "contact", label: "연락처" },
  { value: "features", label: "주요 기능/서비스" },
  { value: "cards", label: "카드 그리드" },
  { value: "testimonials", label: "간증/후기" },
  { value: "gallery", label: "갤러리" },
  { value: "staff", label: "교역자/스태프" },
  { value: "schedule", label: "예배 시간" },
  { value: "text", label: "텍스트 콘텐츠" },
  { value: "image", label: "이미지" },
  { value: "video", label: "비디오" },
  { value: "custom", label: "커스텀" },
] as const;

/**
 * 페이지 목록
 */
export const PAGES = [
  { value: "home", label: "홈" },
  { value: "about", label: "교회소개" },
  { value: "word", label: "말씀" },
  { value: "education", label: "교육" },
  { value: "nurture", label: "양육" },
  { value: "mission", label: "선교" },
  { value: "lifegroup", label: "목장" },
  { value: "news", label: "교회소식" },
  { value: "gallery", label: "갤러리" },
] as const;

