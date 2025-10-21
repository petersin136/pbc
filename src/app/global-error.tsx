"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>전역 오류</h2>
        <button onClick={() => reset()}>다시 시도</button>
      </body>
    </html>
  );
}



