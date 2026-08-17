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
  mainBuffer: Buffer,
  blurBuffer: Buffer
): Promise<{ publicUrl: string; blurUrl: string }> {
  const { mainKey, blurKey } = optimizedObjectKeys(projectId);

  await Promise.all([
    uploadBufferToR2(mainKey, mainBuffer, 'image/webp'),
    uploadBufferToR2(blurKey, blurBuffer, 'image/webp'),
  ]);

  return {
    publicUrl: publicUrlFromStorageKey(mainKey),
    blurUrl: publicUrlFromStorageKey(blurKey),
  };
}

function extensionFromNameOrMime(name: string, mimeType: string): string {
  const sanitizedName = name.split('?')[0].split('#')[0];
  const extension = sanitizedName.split('.').pop() || '';
  if (extension) {
    return extension.toLowerCase();
  }
  if (mimeType) {
    const parts = mimeType.split('/');
    return parts[1] || 'bin';
  }
  return 'bin';
}

export async function uploadRawFileToR2(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<{ publicUrl: string; blurUrl: string }> {
  const extension = extensionFromNameOrMime(fileName, contentType);
  const projectId = newOptimizedProjectId();
  const key = `uploads/raw/${projectId}.${extension}`;
  await uploadBufferToR2(key, fileBuffer, contentType || 'application/octet-stream');
  return {
    publicUrl: publicUrlFromStorageKey(key),
    blurUrl: '',
  };
}

export async function processUploadAndStoreInR2(
  fileBuffer: Buffer,
  originalName: string,
  originalMimeType: string
): Promise<{
  publicUrl: string;
  blurUrl: string;
}> {
  try {
    const { main, blur } = await processImageBuffers(fileBuffer);
    const projectId = newOptimizedProjectId();
    return uploadOptimizedPairToR2(projectId, main, blur);
  } catch (err) {
    console.warn('⚠️ Image optimization failed, uploading original asset instead:', err instanceof Error ? err.message : err);
    return uploadRawFileToR2(originalName, fileBuffer, originalMimeType || 'application/octet-stream');
  }
}
