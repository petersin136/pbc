'use client';

import React from 'react';

interface HeroSectionProps {
  backgroundImageUrl?: string;
  backgroundColor?: string;
}

export default function HeroSection({ 
  backgroundImageUrl,
  backgroundColor = '#FFFFFF'
}: HeroSectionProps = {}) {
  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{
        width: '1920px',
        height: '1006px',
        maxWidth: '100%',
        aspectRatio: '1920/1006',
        backgroundColor: backgroundImageUrl ? 'transparent' : backgroundColor,
        minHeight: '1006px',
      }}
    >
      {/* 배경 이미지 */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={backgroundImageUrl}
            alt="히어로 배경 이미지"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* 1. "The Light of Life" - Figma 정확한 위치: x: 90, y: 414 */}
      <div 
        className="absolute z-10"
        style={{
          left: '90px',
          top: '414px',
          width: '1740px',
          height: '312px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '220px',
            lineHeight: '1.2102272727272727em',
            color: '#000000',
            textAlign: 'left',
            margin: 0,
            padding: 0,
          }}
        >
          The Light of Life
        </h1>
      </div>

      {/* 2. 하단 Rectangle 영역 - x: 1, y: 708, width: 1918, height: 298 */}
      <div 
        className="absolute bg-white"
        style={{
          left: '1px',
          top: '708px',
          width: '1918px',
          height: '298px',
        }}
      >
        {/* 왼쪽 Rectangle - x: 1, y: 708, width: 959, height: 298 */}
        <div 
          className="absolute bg-white"
          style={{
            left: '0px',
            top: '0px',
            width: '959px',
            height: '298px',
          }}
        >
          {/* 한글 성경 구절 - x: 1, y: 726 (상대적으로 y: 18) */}
          <div 
            className="absolute"
            style={{
              left: '0px',
              top: '18px',
              width: '905px',
              height: '280px',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '40px',
                lineHeight: '1.2102272033691406em',
                color: '#000000',
                textAlign: 'right',
                margin: 0,
                padding: 0,
                textShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                whiteSpace: 'pre-line',
              }}
            >
              흑암에 행하던 백성이 큰 빛을 보고{'\n'}사망의 그늘진 땅에 거주하던 자에게{'\n'}빛이 비치도다
            </p>
          </div>
        </div>

        {/* 구분선 - x: 961, y: 708, width: 0, height: 298 (세로선) */}
        <div 
          className="absolute bg-black"
          style={{
            left: '960px',
            top: '0px',
            width: '1px',
            height: '298px',
          }}
        />

        {/* 오른쪽 Rectangle - x: 960, y: 712 (상대적으로 y: 4), width: 958, height: 298 */}
        <div 
          className="absolute bg-white"
          style={{
            left: '960px',
            top: '4px',
            width: '958px',
            height: '298px',
          }}
        >
          {/* 영어 성경 구절 */}
          <div 
            className="absolute"
            style={{
              right: '0px',
              top: '33px', // y: 741 상대적으로
              width: '508px',
              height: '116px',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '24px',
                lineHeight: '1.2102272510528564em',
                color: '#000000',
                textAlign: 'right',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-line',
              }}
            >
              The people who walked in darkness{'\n'}have seen a great light;{'\n'}those who dwelt in a land of deep darkness,{'\n'}on them has light shone.
            </p>
          </div>

          {/* 히브리어 텍스트 */}
          <div 
            className="absolute"
            style={{
              right: '0px',
              top: '15px', // 대략적인 위치
              width: '428px',
              height: '123px',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '40px',
                lineHeight: '1.2102272033691406em',
                color: '#000000',
                textAlign: 'right',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-line',
              }}
            >
              הָעָם הַהֹלְכִים בַּחֹשֶׁךְ{'\n'}רָאוּ אוֹר גָּדוֹל{'\n'}יֹשְׁבֵי בְּאֶרֶץ צַלְמָוֶת{'\n'}אוֹר נָגַהּ עֲלֵיהֶם
            </p>
          </div>

          {/* 구분선 (세로) - x: 1524, y: 741, width: 2, height: 237 */}
          <div 
            className="absolute bg-black"
            style={{
              left: '564px', // 1524 - 960
              top: '33px', // 741 - 708
              width: '2px',
              height: '237px',
            }}
          />

          {/* "이사야 9:2" / "Isaiah 9:2" */}
          <div 
            className="absolute"
            style={{
              right: '0px',
              bottom: '0px',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '24px',
                lineHeight: '1.2102272510528564em',
                color: '#000000',
                textAlign: 'right',
                margin: 0,
                padding: 0,
                marginBottom: '4px',
              }}
            >
              이사야 9:2
            </p>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '24px',
                lineHeight: '1.2102272510528564em',
                color: '#000000',
                textAlign: 'right',
                margin: 0,
                padding: 0,
              }}
            >
              Isaiah 9:2
            </p>
          </div>
        </div>
      </div>

      {/* 상단 가로선 - width: 1919, height: 0 */}
      <div 
        className="absolute bg-black"
        style={{
          left: '0px',
          top: '708px',
          width: '1919px',
          height: '1px',
        }}
      />
    </section>
  );
}
