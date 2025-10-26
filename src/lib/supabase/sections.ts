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
 * 섹션 Kind 목록 (실제 DB에서 사용 중인 섹션 타입)
 */
export const SECTION_KINDS = [
  { value: "hero", label: "🎬 Hero 배너 (상단 대표 이미지/영상)" },
  { value: "info-cards", label: "📋 정보 카드 (말씀영상 + 예배시간)" },
  { value: "image-slider", label: "🖼️ 이미지 슬라이더" },
  { value: "text", label: "📝 텍스트 섹션" },
  { value: "image", label: "🖼️ 이미지 섹션" },
  { value: "pastor", label: "👤 담임목사 소개" },
  { value: "location", label: "📍 교회 위치 (지도 + 주소)" },
  { value: "contact", label: "📞 연락처" },
  { value: "lifegroup", label: "👥 목장 목록" },
  { value: "department", label: "🎓 부서 안내" },
  { value: "notices", label: "📢 공지사항" },
  { value: "prayer", label: "🙏 기도제목" },
  { value: "mission", label: "🌍 선교" },
  { value: "nurture", label: "🌱 양육" },
  { value: "gallery", label: "📸 갤러리" },
] as const;

/**
 * 페이지 목록 (실제 웹사이트 구조와 일치)
 */
export const PAGES = [
  { value: "home", label: "🏠 홈" },
  { value: "about", label: "📖 교회소개" },
  { value: "about-pastor", label: "📖 교회소개 > 담임목사" },
  { value: "about-location", label: "📖 교회소개 > 오시는길" },
  { value: "about-facilities", label: "📖 교회소개 > 시설안내" },
  { value: "education-youth", label: "🎓 교육 > 청년부" },
  { value: "education-highschool", label: "🎓 교육 > 중고등부" },
  { value: "education-sunday-school", label: "🎓 교육 > 주일학교" },
  { value: "education-kindergarten", label: "🎓 교육 > 유치부" },
  { value: "education-bible-study", label: "🎓 교육 > 성경공부" },
  { value: "choir", label: "🎵 찬양" },
  { value: "choir-yada", label: "🎵 찬양 > 야다 성가대" },
  { value: "choir-joyful", label: "🎵 찬양 > 기쁜소리 찬양단" },
  { value: "choir-terua", label: "🎵 찬양 > 테루아 찬양단" },
  { value: "nurture-newcomer", label: "🌱 양육 > 새신자" },
  { value: "nurture-leader", label: "🌱 양육 > 리더" },
  { value: "nurture-discipleship", label: "🌱 양육 > 제자훈련" },
  { value: "nurture-advanced", label: "🌱 양육 > 심화과정" },
  { value: "mission-domestic", label: "🌍 선교 > 국내선교" },
  { value: "mission-overseas", label: "🌍 선교 > 해외선교" },
  { value: "lifegroup", label: "👥 목장" },
  { value: "news-bulletin", label: "📰 소식 > 주보" },
  { value: "news-notices", label: "📰 소식 > 공지사항" },
  { value: "news-prayer", label: "📰 소식 > 기도제목" },
  { value: "news-testimony", label: "📰 소식 > 간증" },
  { value: "word-sermons", label: "✝️ 말씀 > 설교" },
  { value: "word-articles", label: "✝️ 말씀 > 칼럼" },
  { value: "gallery", label: "📸 갤러리" },
] as const;

