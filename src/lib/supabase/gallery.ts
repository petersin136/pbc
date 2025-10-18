import { supabase } from "./client";

export interface GalleryCategory {
  id: number;
  name_kr: string;
  name_en: string;
  description: string | null;
  created_at: string;
}

export interface GalleryEvent {
  id: number;
  category_id: number;
  title: string;
  date: string;
  cover_url: string | null;
  description: string | null;
  created_at: string;
  category?: GalleryCategory;
  photo_count?: number;
}

export interface GalleryPhoto {
  id: number;
  event_id: number;
  file_url: string;
  file_name: string | null;
  uploaded_at: string;
}

/**
 * 모든 카테고리 가져오기
 */
export async function getAllCategories(): Promise<GalleryCategory[]> {
  
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("카테고리 조회 오류:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * 특정 카테고리 가져오기
 */
export async function getCategoryByNameEn(name_en: string): Promise<GalleryCategory | null> {
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("*")
    .eq("name_en", name_en)
    .single();

  if (error) {
    console.error("카테고리 조회 오류:", error);
    return null;
  }

  return data;
}

/**
 * 모든 이벤트 가져오기 (카테고리 정보 포함)
 */
export async function getAllEvents(): Promise<GalleryEvent[]> {
  const { data, error } = await supabase
    .from("gallery_events")
    .select(`
      *,
      category:gallery_categories(*)
    `)
    .order("date", { ascending: false });

  if (error) {
    console.error("이벤트 조회 오류:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * 특정 카테고리의 이벤트 가져오기
 */
export async function getEventsByCategory(category_id: number): Promise<GalleryEvent[]> {
  const { data, error } = await supabase
    .from("gallery_events")
    .select(`
      *,
      category:gallery_categories(*)
    `)
    .eq("category_id", category_id)
    .order("date", { ascending: false });

  if (error) {
    console.error("이벤트 조회 오류:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * 특정 이벤트 상세 정보 가져오기
 */
export async function getEventById(event_id: number): Promise<GalleryEvent | null> {
  const { data, error } = await supabase
    .from("gallery_events")
    .select(`
      *,
      category:gallery_categories(*)
    `)
    .eq("id", event_id)
    .single();

  if (error) {
    console.error("이벤트 조회 오류:", error);
    return null;
  }

  return data;
}

/**
 * 특정 이벤트의 사진 가져오기
 */
export async function getPhotosByEvent(event_id: number): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("event_id", event_id)
    .order("uploaded_at", { ascending: true});

  if (error) {
    console.error("사진 조회 오류:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * 모든 사진 가져오기
 */
export async function getAllPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("사진 조회 오류:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Google Drive 파일 ID 추출
 * @param url - Google Drive URL 또는 파일 ID
 * @returns 파일 ID
 */
export function extractGoogleDriveFileId(url: string): string {
  // 이미 파일 ID인 경우
  if (!url.includes('drive.google.com')) {
    return url;
  }

  // https://drive.google.com/file/d/FILE_ID/view 형식
  const match1 = url.match(/\/file\/d\/([^\/]+)/);
  if (match1) return match1[1];

  // https://drive.google.com/open?id=FILE_ID 형식
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2) return match2[1];

  return url;
}

/**
 * Google Drive 임베드 URL 생성
 * @param fileId - Google Drive 파일 ID
 * @returns 임베드 가능한 URL
 */
export function getGoogleDriveEmbedUrl(fileId: string): string {
  const cleanId = extractGoogleDriveFileId(fileId);
  return `https://drive.google.com/file/d/${cleanId}/preview`;
}

/**
 * Google Drive 썸네일 URL 생성
 * @param fileId - Google Drive 파일 ID
 * @returns 썸네일 URL
 */
export function getGoogleDriveThumbnailUrl(fileId: string): string {
  const cleanId = extractGoogleDriveFileId(fileId);
  return `https://drive.google.com/thumbnail?id=${cleanId}&sz=w400`;
}

