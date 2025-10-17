import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

    // public/images 폴더 확인 및 생성
    const uploadsDir = join(process.cwd(), "public", "images");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedImages = [];

    for (const file of files) {
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
      const fileName = `${nameWithoutExt}-${timestamp}.${ext}`;

      // 파일 저장
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      uploadedImages.push({
        url: `/images/${fileName}`,
        alt: nameWithoutExt.replace(/-/g, " "),
        originalName,
      });
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error: any) {
    console.error("이미지 업로드 오류:", error);
    return NextResponse.json(
      { error: error.message || "이미지 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}

