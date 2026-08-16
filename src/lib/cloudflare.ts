/**
 * Cloudflare Images utility
 * Docs: https://developers.cloudflare.com/images/
 *
 * Setup:
 *  1. Cloudflare Dashboard → Images → Overview
 *  2. Copy Account ID  → CLOUDFLARE_ACCOUNT_ID
 *  3. My Profile → API Tokens → Create Token (Images: Edit) → CLOUDFLARE_IMAGES_API_TOKEN
 *  4. Images → Overview → Account Hash → NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH
 */

const ACCOUNT_ID   = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN    = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
const IMAGES_HASH  = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH;

/** Variants defined in your Cloudflare Images dashboard */
export type CFVariant = 'public' | 'thumbnail' | 'avatar';

/**
 * Build the CDN delivery URL for a stored image.
 * Returns null when env vars are missing (dev without CF configured).
 */
export function getCFImageUrl(
  imageId: string,
  variant: CFVariant = 'public'
): string | null {
  if (!IMAGES_HASH || !imageId) return null;
  // Standard Cloudflare Images URL pattern
  return `https://imagedelivery.net/${IMAGES_HASH}/${imageId}/${variant}`;
}

/**
 * Upload a file (File | Blob) to Cloudflare Images.
 * Returns the image ID that you should store in the database.
 *
 * Call this server-side only (API route / Server Action).
 */
export async function uploadToCFImages(
  file: File | Blob,
  metadata?: Record<string, string>
): Promise<{ success: true; imageId: string; url: string } | { success: false; error: string }> {
  if (!ACCOUNT_ID || !API_TOKEN) {
    return {
      success: false,
      error:
        'Cloudflare Images غير مُهيأ. أضف CLOUDFLARE_ACCOUNT_ID و CLOUDFLARE_IMAGES_API_TOKEN في ملف .env',
    };
  }

  try {
    const form = new FormData();
    form.append('file', file);

    if (metadata) {
      form.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: form,
      }
    );

    const data = await response.json();

    if (!data.success) {
      const msg = data.errors?.[0]?.message || 'خطأ من Cloudflare Images';
      return { success: false, error: msg };
    }

    const imageId: string = data.result.id;
    const url = getCFImageUrl(imageId) ?? data.result.variants?.[0] ?? '';

    return { success: true, imageId, url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطأ غير معروف';
    return { success: false, error: message };
  }
}

/**
 * Delete an image from Cloudflare Images by its ID.
 * Returns true on success.
 */
export async function deleteCFImage(imageId: string): Promise<boolean> {
  if (!ACCOUNT_ID || !API_TOKEN || !imageId) return false;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a Cloudflare image ID (not a full URL).
 * IDs look like: "2cdc28f0-017a-49c4-9ed7-87056c83901d"
 */
export function isCFImageId(value: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(value);
}

/**
 * Given a stored value (could be a CF image ID or a full URL),
 * returns the best display URL.
 */
export function resolveImageUrl(
  stored: string | null | undefined,
  variant: CFVariant = 'public'
): string | null {
  if (!stored) return null;
  // Already a full URL
  if (stored.startsWith('http')) return stored;
  // Treat as CF image ID
  return getCFImageUrl(stored, variant);
}
