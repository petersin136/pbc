/**
 * Supabase 클라이언트 설정
 * 브라우저에서 사용하는 Supabase 클라이언트
 *
 * 모듈 import 시점에 env가 없어서 앱 전체가 500이 나지 않도록,
 * 실제 `createClient`는 첫 API 접근 시에만 수행한다.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL 및 NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다. " +
        "루트의 .env.example을 참고해 .env.local을 만들고 값을 채운 뒤 다시 실행하세요."
    );
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}

/**
 * 클라이언트 사이드 Supabase 클라이언트 (지연 초기화)
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseBrowserClient();
    const value = Reflect.get(client, prop, receiver) as unknown;
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});

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
