/**
 * Supabase sections 전체 content를 Zod 블록 스키마로 검증 (read-only)
 * 사용: npm run validate:sections
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { getBlockDefinition, parseBlockContent } from "../src/lib/blocks";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 필요합니다.");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const { data: rows, error } = await supabase.from("sections").select("id, page, kind, title, content");

  if (error) {
    console.error("sections 조회 실패:", error.message);
    process.exit(1);
  }

  const list = rows ?? [];
  let broken = 0;
  const samples: string[] = [];

  for (const row of list) {
    const kind = String(row.kind);
    const def = getBlockDefinition(kind);
    if (!def) {
      broken += 1;
      const msg = `[unknown kind] id=${row.id} page=${row.page} kind=${kind}`;
      console.error(msg);
      if (samples.length < 10) samples.push(msg);
      continue;
    }
    const result = parseBlockContent(kind, row.content);
    if (!result.success) {
      broken += 1;
      const msg = `id=${row.id} page=${row.page} kind=${kind} title=${row.title}\n  → ${result.error}`;
      console.error(msg);
      if (samples.length < 10) samples.push(msg);
    }
  }

  console.log("\n--- validate:sections 요약 ---");
  console.log(`총 행: ${list.length}`);
  console.log(`검증 실패(미등록 kind 포함): ${broken}`);
  if (samples.length) {
    console.log("\n샘플(최대 10개):");
    samples.slice(0, 5).forEach((s, i) => console.log(`\n[${i + 1}]\n${s}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
