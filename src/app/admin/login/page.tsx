"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmail, hasAdminAccess } from "@/lib/supabase/auth";

/**
 * 관리자 로그인 페이지
 * - 이메일 + 비밀번호 인증
 * - admin 또는 editor 역할만 접근 가능
 * - 로그인 후 /admin/dashboard로 리다이렉트
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [envConfigured, setEnvConfigured] = useState(true);

  /**
   * 환경 변수 설정 확인
   */
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl.includes("your_supabase") || 
        supabaseKey.includes("your_supabase")) {
      setEnvConfigured(false);
    }
  }, []);

  /**
   * 로그인 처리
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. 이메일 + 비밀번호로 로그인
      await signInWithEmail(email, password);

      // 2. 관리자 권한 확인
      const hasAccess = await hasAdminAccess();

      if (!hasAccess) {
        setError("관리자 권한이 없습니다. (admin 또는 editor 역할 필요)");
        setLoading(false);
        return;
      }

      // 3. 대시보드로 리다이렉트
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("로그인 오류:", err);
      
      // 오류 메시지 한국어로 변환
      if (err.message?.includes("Invalid login credentials")) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("이메일 인증이 완료되지 않았습니다.");
      } else {
        setError(err.message || "로그인에 실패했습니다.");
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              포천중앙침례교회
            </h1>
          </Link>
          <p className="text-gray-600">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* 환경 변수 미설정 경고 */}
          {!envConfigured && (
            <div
              className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6"
              role="alert"
            >
              <p className="font-semibold mb-2">⚠️ Supabase 설정이 필요합니다</p>
              <p className="text-sm mb-2">
                .env.local 파일에 Supabase URL과 Anon Key를 설정해주세요.
              </p>
              <p className="text-xs text-yellow-700">
                자세한 내용은 프로젝트 루트의 <code className="bg-yellow-100 px-1 py-0.5 rounded">ADMIN_SETUP.md</code> 파일을 참고하세요.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                role="alert"
              >
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-sm text-gray-600 mt-6">
          관리자 권한이 필요합니다.
          <br />
          문의사항은 담당자에게 연락해주세요.
        </p>
      </div>
    </div>
  );
}

