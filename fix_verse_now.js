/**
 * 시편 113:3으로 강제 업데이트
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixVerse() {
  try {
    console.log('🔄 시편 113:3으로 업데이트 중...\n');

    // 1. 현재 데이터 가져오기
    const { data: current, error: fetchError } = await supabase
      .from('sections')
      .select('*')
      .eq('page', 'home')
      .eq('kind', 'hero')
      .single();

    if (fetchError) {
      console.error('❌ 조회 오류:', fetchError);
      return;
    }

    console.log('📖 현재 구절:', current.content.verse);
    console.log('');

    // 2. content 업데이트 (기존 내용 유지하면서 구절만 변경)
    const newContent = {
      ...current.content,
      verse: "해 돋는 곳에서부터 해 지는 곳까지 여호와의 이름이 찬양을 받으시리로다",
      verseEn: "From the rising of the sun to its setting, the name of the LORD is to be praised.",
      verseReference: "시편 113:3"
    };

    // 3. 업데이트 실행
    const { error: updateError } = await supabase
      .from('sections')
      .update({ content: newContent })
      .eq('page', 'home')
      .eq('kind', 'hero');

    if (updateError) {
      console.error('❌ 업데이트 오류:', updateError);
      return;
    }

    console.log('✅ 업데이트 완료!\n');
    console.log('📖 새로운 구절:', newContent.verse);
    console.log('📖 영문:', newContent.verseEn);
    console.log('📖 출처:', newContent.verseReference);
    
    // 4. 다시 한번 확인
    console.log('\n🔍 업데이트 확인 중...');
    const { data: verify, error: verifyError } = await supabase
      .from('sections')
      .select('content')
      .eq('page', 'home')
      .eq('kind', 'hero')
      .single();

    if (verifyError) {
      console.error('❌ 확인 오류:', verifyError);
      return;
    }

    console.log('✅ 최종 확인:', verify.content.verse);
    console.log('\n🎉 완료! 서버를 재시작하고 브라우저 캐시를 지우세요! (Cmd+Shift+R)');

  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error);
  }
}

fixVerse();

