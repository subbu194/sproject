/**
 * Resolves the LQIP blur URL for an optimized main image.
 * Uses the parallel `imageBlurUrls` slot when present; otherwise derives
 * `/blur.webp` from `/optimized/.../main.webp` (same folder as migration).
 */
export function resolveBlurPlaceholder(
  mainSrc: string,
  blurFromArray?: string | null
): string | undefined {
  const trimmed = typeof blurFromArray === 'string' ? blurFromArray.trim() : '';
  if (trimmed) return trimmed;
  if (mainSrc?.includes('/optimized/') && mainSrc.endsWith('/main.webp')) {
    return `${mainSrc.slice(0, -'/main.webp'.length)}/blur.webp`;
  }
  return undefined;
}
