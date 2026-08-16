import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 & Cloudflare Images Utility
 *
 * Cloudflare R2 Setup:
 *  1. Cloudflare Dashboard -> R2 -> Manage R2 API Tokens -> Create API Token
 *  2. Access Key ID     -> CLOUDFLARE_R2_ACCESS_KEY_ID
 *  3. Secret Access Key -> CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *  4. Endpoint          -> CLOUDFLARE_R2_ENDPOINT (e.g. https://8bfa627acdc4c71f61e84c73116805e9.r2.cloudflarestorage.com)
 *  5. Bucket Name       -> CLOUDFLARE_R2_BUCKET (default: riyadalquran)
 *  6. Public URL Domain -> NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL (e.g. https://pub-xxx.r2.dev)
 */

const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || 'https://8bfa627acdc4c71f61e84c73116805e9.r2.cloudflarestorage.com';
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || 'riyadalquran';
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;

// Cloudflare Images legacy environment variables fallback
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
const IMAGES_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH;

// Initialize S3 Client for Cloudflare R2
const r2Client = (R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
  ? new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

export type CFVariant = 'public' | 'thumbnail' | 'avatar';

/**
 * Upload a file to Cloudflare R2 (or fallback Cloudflare Images)
 */
export async function uploadToCFImages(
  file: File | Blob,
  metadata?: Record<string, string>
): Promise<{ success: true; imageId: string; url: string } | { success: false; error: string }> {
  
  // 1. Try Cloudflare R2 Upload first if R2 is configured
  if (r2Client && R2_PUBLIC_URL) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.type?.split('/')[1] || 'jpg';
      const key = `students/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type || 'image/jpeg',
          Metadata: metadata,
        })
      );

      const url = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
      return { success: true, imageId: key, url };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ أثناء الرفع إلى Cloudflare R2';
      return { success: false, error: msg };
    }
  }

  // 2. Fallback to Cloudflare Images API if configured
  if (ACCOUNT_ID && API_TOKEN) {
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
          headers: { Authorization: `Bearer ${API_TOKEN}` },
          body: form,
        }
      );

      const data = await response.json();
      if (!data.success) {
        return { success: false, error: data.errors?.[0]?.message || 'خطأ من Cloudflare Images' };
      }

      const imageId: string = data.result.id;
      const url = IMAGES_HASH ? `https://imagedelivery.net/${IMAGES_HASH}/${imageId}/public` : data.result.variants?.[0] ?? '';
      return { success: true, imageId, url };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف في Cloudflare Images';
      return { success: false, error: msg };
    }
  }

  return {
    success: false,
    error: 'لم يتم تهيئة بيانات Cloudflare R2 في ملف .env (تحتاج R2_ACCESS_KEY_ID و R2_SECRET_ACCESS_KEY ورابط الـ Public URL).',
  };
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteCFImage(keyOrId: string): Promise<boolean> {
  if (r2Client && keyOrId) {
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: keyOrId,
        })
      );
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Resolve stored image URL
 */
export function resolveImageUrl(
  stored: string | null | undefined,
  variant: CFVariant = 'public'
): string | null {
  if (!stored) return null;
  if (stored.startsWith('http')) return stored;
  if (R2_PUBLIC_URL && !stored.includes('/')) {
    return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${stored}`;
  }
  if (IMAGES_HASH && !stored.includes('/')) {
    return `https://imagedelivery.net/${IMAGES_HASH}/${stored}/${variant}`;
  }
  return stored;
}
