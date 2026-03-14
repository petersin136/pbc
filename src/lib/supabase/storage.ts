/**
 * Supabase Storage 헬퍼 함수
 * 이미지 업로드 및 관리
 */

import { supabase } from "./client";

/**
 * Storage 버킷 이름
 */
export const BUCKET_NAME = "church-images";

/**
 * 파일을 Supabase Storage에 업로드
 * @param file - 업로드할 파일
 * @param folder - 저장할 폴더 (optional)
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadToStorage(
  file: File,
  folder: string = "uploads"
): Promise<{ url: string; path: string }> {
  try {
    // 파일명 정제 (공백 제거, 소문자 변환, 특수문자 제거)
    const originalName = file.name;
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9가-힣._-]/g, "");

    // 타임스탬프 추가 (중복 방지)
    const timestamp = Date.now();
    const ext = sanitizedName.split(".").pop();
    const nameWithoutExt = sanitizedName.replace(`.${ext}`, "");
    const fileName = `${nameWithoutExt}-${timestamp}.${ext}`;
    
    // 전체 경로
    const filePath = `${folder}/${fileName}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage 업로드 오류:", error);
      throw new Error(`업로드 실패: ${error.message}`);
    }

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("uploadToStorage 오류:", error);
    throw error;
  }
}

/**
 * Storage에서 파일 삭제
 * @param path - 삭제할 파일 경로
 */
export async function deleteFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    console.error("Storage 삭제 오류:", error);
    throw new Error(`삭제 실패: ${error.message}`);
  }
}

/**
 * Storage의 모든 파일 목록 가져오기
 * @param folder - 폴더 이름 (optional)
 */
export async function listStorageFiles(folder: string = "") {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folder);

  if (error) {
    console.error("Storage 목록 조회 오류:", error);
    throw new Error(`목록 조회 실패: ${error.message}`);
  }

  return data;
}

/**
 * 버킷이 존재하는지 확인하고, 없으면 생성
 * (관리자 권한 필요 - Service Role Key 사용)
 */
export async function ensureBucketExists(): Promise<boolean> {
  try {
    // 버킷 목록 확인
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);
    
    if (bucketExists) {
      console.log(`✅ 버킷 '${BUCKET_NAME}' 이미 존재합니다.`);
      return true;
    }

    console.log(`⚠️ 버킷 '${BUCKET_NAME}'가 없습니다. Supabase Dashboard에서 생성해주세요.`);
    return false;
  } catch (error) {
    console.error("버킷 확인 오류:", error);
    return false;
  }
}

