import { deleteFileFromR2 } from './fileUpload';
import { pairedBlurUrlFromMainUrl } from './imageService';

export async function deleteR2UrlIfOwned(
  url: string | undefined,
  isR2Url: (u: string) => boolean
): Promise<void> {
  if (!url || !isR2Url(url)) return;
  try {
    await deleteFileFromR2(url);
  } catch (err) {
    console.warn('Failed to delete file from R2:', err);
  }
}

/**
 * Deletes main `images[]` URLs and any known blur companions (explicit parallel array or derived /blur.webp).
 */
export async function deleteGalleryAndBlurFromR2(
  images: string[] | undefined,
  imageBlurUrls: string[] | undefined,
  isR2Url: (u: string) => boolean
): Promise<void> {
  const toDelete = new Set<string>();

  for (const u of images || []) {
    if (isR2Url(u)) toDelete.add(u);
  }
  for (const u of imageBlurUrls || []) {
    if (isR2Url(u)) toDelete.add(u);
  }
  for (const u of images || []) {
    const paired = pairedBlurUrlFromMainUrl(u);
    if (paired && isR2Url(paired)) toDelete.add(paired);
  }

  for (const u of toDelete) {
    await deleteR2UrlIfOwned(u, isR2Url);
  }
}
