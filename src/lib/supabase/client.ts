/**
 * Supabase 클라이언트 설정
 * 브라우저에서 사용하는 Supabase 클라이언트
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 확인 및 디버깅
console.log('🔍 Environment Check:', {
  url: supabaseUrl,
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length
});

// 환경 변수가 없으면 에러
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
}

/**
 * 클라이언트 사이드 Supabase 클라이언트
 * 
 * 환경 변수가 설정되지 않으면 기본값을 사용하되 에러 로그를 출력합니다.
 */
export const supabase = createClient(
  supabaseUrl || "https://czbffjnslwauemngpayh.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YmZmam5zbHdhdWVtbmdwYXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjU5ODIsImV4cCI6MjA3NjIwMTk4Mn0.LcBQvfZTxqEnxZgLzHaUuukZEB9mPb5KG_VBeIcFy1M"
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

