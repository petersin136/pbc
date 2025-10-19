import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

/**
 * Google Drive 폴더의 이미지를 Supabase gallery_photos에 자동 갱신
 * 
 * 사용법:
 * GET /api/gallery-sync?folder_id=FOLDER_ID&event_id=EVENT_ID
 * 
 * 또는 환경변수 사용:
 * GET /api/gallery-sync
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 환경변수 또는 쿼리 파라미터에서 가져오기
    const folderId = searchParams.get('folder_id') || process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID;
    const eventId = searchParams.get('event_id') || process.env.NEXT_PUBLIC_DRIVE_EVENT_ID || '2';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    // 필수 파라미터 검증
    if (!folderId) {
      return NextResponse.json(
        { error: '❌ folder_id가 필요합니다. 쿼리 파라미터 또는 환경변수를 설정하세요.' },
        { status: 400 }
      );
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { error: '❌ Google API Key가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: '❌ Supabase 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Google Drive API 설정
    const drive = google.drive({
      version: 'v3',
      auth: apiKey
    });

    console.log(`🔍 Google Drive 폴더 스캔 중: ${folderId}`);

    // 폴더 내 모든 파일 가져오기
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/jpg' or mimeType='image/webp')`,
      fields: 'files(id, name, mimeType)',
      pageSize: 1000
    });

    const files = response.data.files || [];
    
    if (files.length === 0) {
      return NextResponse.json({
        success: true,
        message: '⚠️ 폴더에 이미지가 없습니다.',
        count: 0
      });
    }

    console.log(`📸 ${files.length}개의 이미지 발견`);

    // 기존 사진 삭제 (중복 방지)
    const { error: deleteError } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('event_id', eventId);

    if (deleteError) {
      console.error('기존 사진 삭제 실패:', deleteError);
    } else {
      console.log(`🗑️ 기존 사진 삭제 완료 (event_id: ${eventId})`);
    }

    // 새 사진 데이터 준비
    const photos = files.map(file => ({
      event_id: parseInt(eventId),
      file_url: file.id || '',
      file_name: file.name || 'unknown'
    }));

    // Supabase에 일괄 삽입
    const { data, error } = await supabase
      .from('gallery_photos')
      .insert(photos)
      .select();

    if (error) {
      console.error('Supabase 삽입 실패:', error);
      return NextResponse.json(
        { 
          error: '❌ Supabase 삽입 실패',
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log(`✅ ${data?.length || 0}개의 사진이 Supabase에 저장됨`);

    return NextResponse.json({
      success: true,
      message: '✅ 갤러리 업데이트 완료!',
      count: data?.length || 0,
      folderId,
      eventId,
      photos: data?.map(p => ({
        id: p.id,
        fileName: p.file_name,
        fileUrl: `https://drive.google.com/thumbnail?id=${p.file_url}&sz=w400`
      }))
    });

  } catch (error) {
    console.error('❌ 갤러리 동기화 오류:', error);
    return NextResponse.json(
      { 
        error: '❌ 갤러리 동기화 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

/**
 * POST 메서드도 지원 (body로 파라미터 전달)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const folderId = body.folder_id || process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID;
    const eventId = body.event_id || process.env.NEXT_PUBLIC_DRIVE_EVENT_ID || '2';

    // GET 메서드와 동일한 로직 실행
    const url = new URL(request.url);
    url.searchParams.set('folder_id', folderId);
    url.searchParams.set('event_id', eventId);
    
    const newRequest = new NextRequest(url, request);
    return GET(newRequest);

  } catch (error) {
    return NextResponse.json(
      { 
        error: '❌ 요청 처리 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 400 }
    );
  }
}


