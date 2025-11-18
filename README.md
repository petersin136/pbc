This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase 자동 일시중지 방지

이 프로젝트는 GitHub Actions를 사용하여 Supabase 데이터베이스가 7일 후 자동 일시중지되는 것을 방지합니다.

### 작동 방식

- **자동 실행**: 매주 월요일, 목요일 오전 9시(UTC)에 자동으로 Supabase에 간단한 쿼리를 실행합니다.
- **수동 실행**: GitHub Actions 탭에서 수동으로 실행할 수 있습니다.

### GitHub Secrets 설정

워크플로우가 정상 작동하려면 다음 Secrets를 설정해야 합니다:

1. GitHub 저장소 페이지로 이동
2. **Settings** > **Secrets and variables** > **Actions** 클릭
3. **"New repository secret"** 버튼 클릭
4. 다음 두 개의 Secret 추가:
   - **Name**: `SUPABASE_URL`
     - **Value**: `https://your-project-id.supabase.co` (Supabase 대시보드에서 확인)
   - **Name**: `SUPABASE_ANON_KEY`
     - **Value**: Supabase 대시보드 > Settings > API > anon/public key

설정 후 워크플로우가 자동으로 실행됩니다.
