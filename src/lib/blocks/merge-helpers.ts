/**
 * 배열 필드 저장 시 인덱스별 머지 (폼이 덮어쓴 필드만 갱신, 나머지는 이전 행 유지)
 */
export function mergeArrayByIndex<T extends Record<string, unknown>>(
  prev: T[] | undefined,
  next: T[] | undefined,
  defaults: T
): T[] {
  if (!next) return prev ?? [];
  return next.map((item, i) => ({
    ...defaults,
    ...(prev?.[i] ?? {}),
    ...item,
  }));
}
