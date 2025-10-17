/**
 * Supabase 클라이언트 설정
 * 브라우저에서 사용하는 Supabase 클라이언트
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * 클라이언트 사이드 Supabase 클라이언트
 * 
 * 주의: 환경 변수가 설정되지 않으면 실제 로그인 시 오류가 발생합니다.
 * .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/**
 * 사용자 역할 타입
 */
export type UserRole = "admin" | "editor" | "viewer";

/**
 * 사용자 프로필 타입
 */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

