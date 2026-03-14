import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

/**
 * Sitemap 생성 함수
 * Next.js가 자동으로 /sitemap.xml 경로로 제공합니다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://포천중앙침례교회.kr";
  
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/word/sermons`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/location`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // 사용자 요청 페이지들 (리다이렉트 또는 별칭 경로)
    {
      url: `${baseUrl}/sermons`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Supabase에서 발행된 페이지들 가져오기
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // app_public.pages 테이블에서 is_published=true인 페이지들 조회
      const { data: pages, error } = await supabase
        .from("pages")
        .select("slug, updated_at")
        .eq("is_published", true)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase pages 조회 오류:", error);
      } else if (pages && pages.length > 0) {
        dynamicPages = pages.map((page) => ({
          url: `${baseUrl}${page.slug.startsWith("/") ? page.slug : `/${page.slug}`}`,
          lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      }
    } else {
      console.warn("⚠️ Supabase 환경 변수가 설정되지 않아 동적 페이지를 가져올 수 없습니다.");
    }
  } catch (error) {
    console.error("❌ Sitemap 생성 중 오류:", error);
    // 오류가 발생해도 정적 페이지는 반환
  }

  // 정적 페이지와 동적 페이지 합치기
  return [...staticPages, ...dynamicPages];
}

