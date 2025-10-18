#!/usr/bin/env node
/**
 * Google Drive 폴더에서 이미지를 가져와 Supabase gallery_photos 테이블에 삽입
 * 
 * 사용법:
 *   npx tsx scripts/import-drive-folder.ts <folder_id> <event_id>
 * 
 * 예시:
 *   npx tsx scripts/import-drive-folder.ts 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO 4
 */

import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const googleApiKey = process.env.GOOGLE_DRIVE_API_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

if (!googleApiKey) {
  console.error('❌ GOOGLE_DRIVE_API_KEY not found in .env.local');
  console.error('💡 Please add GOOGLE_DRIVE_API_KEY to your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Google Drive API 설정
const drive = google.drive({
  version: 'v3',
  auth: googleApiKey,
});

/**
 * Google Drive 폴더에서 이미지 파일 목록 가져오기
 */
async function getImagesFromFolder(folderId: string) {
  console.log(`🔍 Fetching files from folder: ${folderId}`);
  
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/jpg')`,
      fields: 'files(id, name, mimeType)',
      pageSize: 1000, // 최대 파일 수
    });

    const files = response.data.files || [];
    console.log(`✅ Found ${files.length} image files`);
    
    return files.map(file => ({
      id: file.id!,
      name: file.name!,
      mimeType: file.mimeType!,
    }));
  } catch (error) {
    console.error('❌ Error fetching files from Google Drive:', error);
    throw error;
  }
}

/**
 * Supabase에 사진 데이터 삽입
 */
async function insertPhotosToSupabase(
  files: Array<{ id: string; name: string; mimeType: string }>,
  eventId: number
) {
  console.log(`📥 Inserting ${files.length} photos into Supabase...`);
  
  const photos = files.map(file => ({
    event_id: eventId,
    file_url: `https://drive.google.com/file/d/${file.id}/preview`,
    file_name: file.name,
  }));

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert(photos)
    .select();

  if (error) {
    console.error('❌ Error inserting photos:', error);
    throw error;
  }

  return data;
}

/**
 * 메인 함수
 */
async function main() {
  // CLI 인자 파싱
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Missing arguments');
    console.log('');
    console.log('Usage:');
    console.log('  npx tsx scripts/import-drive-folder.ts <folder_id> <event_id>');
    console.log('');
    console.log('Example:');
    console.log('  npx tsx scripts/import-drive-folder.ts 1g6pVgXpuROpA3hA0dw_Az5sa84U1xNbO 4');
    process.exit(1);
  }

  const [folderId, eventIdStr] = args;
  const eventId = parseInt(eventIdStr, 10);

  if (isNaN(eventId)) {
    console.error('❌ Invalid event_id. Must be a number.');
    process.exit(1);
  }

  console.log('');
  console.log('🚀 Starting Google Drive to Supabase import...');
  console.log(`📁 Folder ID: ${folderId}`);
  console.log(`🎫 Event ID: ${eventId}`);
  console.log('');

  try {
    // 1. Google Drive에서 이미지 파일 목록 가져오기
    const files = await getImagesFromFolder(folderId);

    if (files.length === 0) {
      console.log('⚠️  No image files found in the folder');
      return;
    }

    // 2. Supabase에 삽입
    const insertedPhotos = await insertPhotosToSupabase(files, eventId);

    // 3. 결과 출력
    console.log('');
    console.log('✅ Import completed successfully!');
    console.log(`📊 Total photos imported: ${insertedPhotos?.length || 0}`);
    console.log('');
    console.log('📋 Summary:');
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name}`);
    });
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main();

