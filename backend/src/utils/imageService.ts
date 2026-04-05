import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { publicUrlFromStorageKey, uploadBufferToR2 } from './fileUpload';

export const MAIN_MAX_WIDTH = 1400;
export const MAIN_WEBP_QUALITY = 70;
/** Tiny LQIP-style blur asset: max edge 20px, WebP q30 (matches “20px, quality 30”). */
export const BLUR_MAX_EDGE = 20;
export const BLUR_WEBP_QUALITY = 30;

export function isAlreadyOptimizedPublicUrl(url: string): boolean {
  return url.includes('/optimized/') && url.endsWith('/main.webp');
}

export function pairedBlurUrlFromMainUrl(mainUrl: string): string | null {
  if (!isAlreadyOptimizedPublicUrl(mainUrl)) return null;
  return `${mainUrl.slice(0, -'/main.webp'.length)}/blur.webp`;
}

/**
 * Main: max width 1400, fit inside, WebP q70.
 * Blur: same geometry pipeline then downscale to max edge 20px, WebP q30.
 */
export async function processImageBuffers(input: Buffer): Promise<{ main: Buffer; blur: Buffer }> {
  const pipeline = sharp(input).rotate();

  const main = await pipeline
    .clone()
    .resize(MAIN_MAX_WIDTH, MAIN_MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: MAIN_WEBP_QUALITY })
    .toBuffer();

  const blur = await sharp(input)
    .rotate()
    .resize(MAIN_MAX_WIDTH, MAIN_MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
    .resize(BLUR_MAX_EDGE, BLUR_MAX_EDGE, { fit: 'inside' })
    .webp({ quality: BLUR_WEBP_QUALITY })
    .toBuffer();

  return { main, blur };
}

export function newOptimizedProjectId(): string {
  return uuidv4();
}

export function optimizedObjectKeys(projectId: string): { mainKey: string; blurKey: string } {
  const base = `optimized/${projectId}`;
  return { mainKey: `${base}/main.webp`, blurKey: `${base}/blur.webp` };
}

export async function uploadOptimizedPairToR2(
  projectId: string,
  main: Buffer,
  blur: Buffer
): Promise<{ publicUrl: string; blurUrl: string }> {
  const { mainKey, blurKey } = optimizedObjectKeys(projectId);
  await uploadBufferToR2(mainKey, main, 'image/webp');
  await uploadBufferToR2(blurKey, blur, 'image/webp');

  return {
    publicUrl: publicUrlFromStorageKey(mainKey),
    blurUrl: publicUrlFromStorageKey(blurKey),
  };
}

export async function processUploadAndStoreInR2(fileBuffer: Buffer): Promise<{
  publicUrl: string;
  blurUrl: string;
}> {
  const { main, blur } = await processImageBuffers(fileBuffer);
  const projectId = newOptimizedProjectId();
  return uploadOptimizedPairToR2(projectId, main, blur);
}
