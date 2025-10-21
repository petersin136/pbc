"use client";

import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 pt-20 py-12">
      <div className="container mx-auto px-4 py-8">
        <div className="relative w-full max-w-5xl mx-auto perspective-1000">
          <div className="relative transform hover:scale-[1.02] transition-transform duration-500 ease-out">
            <Image
              src="https://czbffjnslwauemngpayh.supabase.co/storage/v1/object/public/public-media/tt.png"
              alt="포천중앙침례교회 환영 편지"
              width={1920}
              height={2880}
              className="w-full h-auto rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]"
              style={{
                filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))'
              }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

