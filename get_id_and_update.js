/**
 * ID 확인 후 직접 업데이트
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateById() {
  try {
    // 1. ID와 현재 content 확인
    const { data: section, error: fetchError } = await supabase
      .from('sections')
      .select('id, content, updated_at')
      .eq('page', 'home')
      .eq('kind', 'hero')
      .single();

    if (fetchError) {
      console.error('❌ 조회 오류:', fetchError);
      return;
    }

    console.log('🔍 현재 섹션 정보:');
    console.log('   ID:', section.id);
    console.log('   현재 구절:', section.content.verse);
    console.log('   업데이트 시각:', section.updated_at);
    console.log('');

    // 2. content 전체를 새로 만들기
    const newContent = {
      heading: section.content.heading || "포천중앙침례교회",
      subheading: section.content.subheading || "기도하는 교회   전도하는 교회",
      backgroundVideo: section.content.backgroundVideo || "",
      backgroundImage: section.content.backgroundImage || "",
      buttons: section.content.buttons || [],
      verse: "해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다",
      verseEn: "From the rising of the sun to its setting, the name of the LORD is to be praised.",
      verseReference: "시편 113:3"
    };

    console.log('🔄 업데이트 실행 중...');
    console.log('   새 구절:', newContent.verse);
    console.log('');

    // 3. ID로 업데이트
    const { error: updateError } = await supabase
      .from('sections')
      .update({ content: newContent })
      .eq('id', section.id);

    if (updateError) {
      console.error('❌ 업데이트 오류:', updateError);
      console.log('\n📋 Supabase 대시보드에서 수동으로 실행해야 할 SQL:');
      console.log(`
UPDATE sections
SET content = '${JSON.stringify(newContent)}'::jsonb
WHERE id = '${section.id}';
      `);
      return;
    }

    console.log('✅ 업데이트 명령 완료!');
    
    // 4. 2초 대기 후 확인
    console.log('\n⏳ 2초 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. 재확인
    const { data: verify, error: verifyError } = await supabase
      .from('sections')
      .select('content, updated_at')
      .eq('id', section.id)
      .single();

    if (verifyError) {
      console.error('❌ 재확인 오류:', verifyError);
      return;
    }

    console.log('📖 최종 확인:');
    console.log('   구절:', verify.content.verse);
    console.log('   출처:', verify.content.verseReference);
    console.log('   업데이트 시각:', verify.updated_at);
    
    if (verify.content.verse === newContent.verse) {
      console.log('\n🎉 성공! 서버를 재시작하세요!');
    } else {
      console.log('\n⚠️  업데이트가 반영되지 않았습니다.');
      console.log('   Supabase Dashboard에서 RLS 정책을 확인하거나');
      console.log('   UPDATE_VERSE_SQL.sql 파일의 SQL을 직접 실행하세요.');
    }

  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error);
  }
}

updateById();



