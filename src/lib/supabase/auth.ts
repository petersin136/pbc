/**
 * Supabase 인증 관련 유틸리티 함수
 */

import { supabase, UserRole } from "./client";

/**
 * 이메일 + 비밀번호로 로그인
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

/**
 * 현재 로그인된 사용자 가져오기
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

/**
 * 사용자의 역할(role) 가져오기
 * user_metadata에 저장된 role을 확인
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  // user_metadata에서 role 가져오기
  const role = user.user_metadata?.role as UserRole | undefined;
  
  return role || null;
}

/**
 * 사용자가 관리자 권한이 있는지 확인
 * admin 또는 editor만 접근 가능
 */
export async function hasAdminAccess(): Promise<boolean> {
  const role = await getUserRole();
  
  return role === "admin" || role === "editor";
}

/**
 * 세션 상태 변경 감지
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

