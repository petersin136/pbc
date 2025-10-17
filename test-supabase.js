// Supabase 연결 테스트
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local 파일 읽기
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envLines = envFile.split('\n');

let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

console.log('🔍 Supabase URL:', supabaseUrl ? '✅' : '❌ 없음');
console.log('🔍 Supabase Key:', supabaseKey ? '✅' : '❌ 없음');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ .env.local 파일을 확인하세요!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Supabase 연결 테스트 중...\n');
    
    // 1. 테이블 확인
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('page', 'home');
    
    if (error) {
      console.error('❌ 에러 발생:', error.message);
      console.log('\n💡 해결 방법: Supabase에서 테이블을 생성하세요!');
      return;
    }
    
    console.log('✅ 연결 성공!');
    console.log(`📊 home 페이지 섹션 개수: ${data.length}개`);
    
    if (data.length === 0) {
      console.log('\n⚠️  데이터가 없습니다!');
      console.log('💡 해결 방법: Supabase에서 샘플 데이터를 INSERT 하세요!');
    } else {
      console.log('\n📋 섹션 목록:');
      data.forEach(section => {
        console.log(`  - ${section.kind}: ${section.title} (순서: ${section.section_order})`);
      });
    }
    
  } catch (err) {
    console.error('❌ 예외 발생:', err.message);
  }
}

testConnection();

