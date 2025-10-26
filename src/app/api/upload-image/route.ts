import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { supabase } from "@/lib/supabase/client";

const BUCKET_NAME = "church-images";

/**
 * 이미지 자동 압축 및 Supabase Storage 업로드
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "파일이 선택되지 않았습니다." },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      try {
        console.log(`🔄 처리 시작: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB)`);
        
        // 파일명 정제 (공백 제거, 소문자 변환, 특수문자 제거)
        const originalName = file.name;
        const sanitizedName = originalName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9가-힣._-]/g, "");

        // 타임스탬프 추가 (중복 방지)
        const timestamp = Date.now();
        const ext = sanitizedName.split(".").pop();
        const nameWithoutExt = sanitizedName.replace(`.${ext}`, "");
        const fileName = `${nameWithoutExt}-${timestamp}.webp`; // WebP로 변환하여 용량 절감

        // 파일을 Buffer로 변환
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log(`✅ Buffer 변환 완료: ${buffer.length} bytes`);

        // Sharp로 이미지 압축 및 최적화
        // - 최대 너비 1920px (큰 이미지 리사이즈)
        // - WebP 포맷 (80% 용량 절감)
        // - 품질 85% (눈에 띄지 않는 압축)
        console.log(`🔄 Sharp 압축 시작...`);
        const optimizedBuffer = await sharp(buffer)
          .resize(1920, null, {
            withoutEnlargement: true, // 작은 이미지는 확대하지 않음
            fit: "inside",
          })
          .webp({ quality: 85 })
          .toBuffer();

        console.log(
          `📦 압축 완료: ${file.name} (${(file.size / 1024).toFixed(1)}KB → ${(optimizedBuffer.length / 1024).toFixed(1)}KB)`
        );

        // Supabase Storage에 업로드
        const filePath = `uploads/${fileName}`;
        console.log(`🔄 Supabase 업로드 시작: ${BUCKET_NAME}/${filePath}`);
        
        const { data, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, optimizedBuffer, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });
        
        if (data) {
          console.log(`✅ Supabase 업로드 성공: ${data.path}`);
        }

        if (uploadError) {
          console.error("Supabase 업로드 오류:", uploadError);
          
          // 버킷이 없는 경우 친절한 에러 메시지
          if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("bucket")) {
            throw new Error(
              `❌ Supabase Storage 버킷 '${BUCKET_NAME}'가 생성되지 않았습니다!\n\n` +
              `📝 해결 방법:\n` +
              `1. https://supabase.com/dashboard/project/czbffjnslwauemngpayh 접속\n` +
              `2. Storage 메뉴 → New bucket\n` +
              `3. 이름: church-images, Public ✅ 체크\n` +
              `4. Create 클릭\n\n` +
              `자세한 가이드는 SUPABASE_STORAGE_SETUP.md 참조`
            );
          }
          
          throw new Error(`Supabase 업로드 실패: ${uploadError.message}`);
        }

        // 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

        uploadedImages.push({
          url: publicUrl,
          alt: nameWithoutExt.replace(/-/g, " "),
          originalName,
          compressed: true,
          originalSize: `${(file.size / 1024).toFixed(1)}KB`,
          compressedSize: `${(optimizedBuffer.length / 1024).toFixed(1)}KB`,
        });
      } catch (fileError) {
        console.error(`❌ 파일 처리 오류 (${file.name}):`, fileError);
        console.error(`❌ 에러 상세:`, fileError instanceof Error ? fileError.message : String(fileError));
        // 개별 파일 오류는 무시하고 계속 진행
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: "업로드된 이미지가 없습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `${uploadedImages.length}개 이미지가 자동 압축되어 업로드되었습니다! 🎉`,
    });
  } catch (error: unknown) {
    console.error("이미지 업로드 오류:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

