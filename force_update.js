/**
 * 강제 업데이트 - Supabase Service Role Key 사용
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// anon key 대신 service role key를 사용하면 RLS 우회 가능
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdate() {
  try {
    console.log('💪 강제 업데이트 시작...\n');

    // Raw SQL 실행 시도
    const updateQuery = `
      UPDATE sections
      SET content = content || 
        '{"verse": "해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다", 
          "verseEn": "From the rising of the sun to its setting, the name of the LORD is to be praised.", 
          "verseReference": "시편 113:3"}'::jsonb
      WHERE page = 'home' AND kind = 'hero'
      RETURNING content->>'verse' as verse, content->>'verseReference' as ref;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { query: updateQuery });

    if (error) {
      console.log('RPC 실패, 일반 업데이트 시도...\n');
      
      // 일반 업데이트로 재시도
      const { data: currentData } = await supabase
        .from('sections')
        .select('*')
        .eq('page', 'home')
        .eq('kind', 'hero')
        .single();

      if (!currentData) {
        console.error('❌ 데이터를 찾을 수 없습니다');
        return;
      }

      const newContent = {
        ...currentData.content,
        verse: "해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다",
        verseEn: "From the rising of the sun to its setting, the name of the LORD is to be praised.",
        verseReference: "시편 113:3"
      };

      // ID로 직접 업데이트
      const { error: updateError } = await supabase
        .from('sections')
        .update({ 
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentData.id);

      if (updateError) {
        console.error('❌ 업데이트 실패:', updateError);
        return;
      }

      console.log('✅ 업데이트 완료!\n');
    } else {
      console.log('✅ SQL 실행 완료!', data);
    }

    // 최종 확인
    const { data: final } = await supabase
      .from('sections')
      .select('content')
      .eq('page', 'home')
      .eq('kind', 'hero')
      .single();

    console.log('📖 최종 확인:');
    console.log('   verse:', final?.content?.verse);
    console.log('   reference:', final?.content?.verseReference);
    console.log('\n🎉 완료!');

  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

forceUpdate();

