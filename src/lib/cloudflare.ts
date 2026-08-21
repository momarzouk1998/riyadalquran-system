import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 & Storage Utility
 */

const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '9dafabea95366ecaae3ce745d07a3486';
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '90ca81e27de2023f897d754cc598d7aca10bb877ab0a112e2499941284fe9065';
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || 'https://8bfa627acdc4c71f61e84c73116805e9.r2.cloudflarestorage.com';
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || 'riyadalquran';
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;

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
 * Upload a file directly to Cloudflare R2 Bucket
 */
export async function uploadToCFImages(
  file: File | Blob,
  metadata?: Record<string, string>
): Promise<{ success: true; imageId: string; url: string } | { success: false; error: string }> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type?.split('/')[1] || 'jpg';
    const key = `students/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const contentType = file.type || 'image/jpeg';

    if (r2Client) {
      try {
        await r2Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            Metadata: metadata,
          })
        );

        const url = R2_PUBLIC_URL 
          ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
          : `data:${contentType};base64,${buffer.toString('base64')}`;

        return { success: true, imageId: key, url };
      } catch (r2Err: any) {
        console.error('Cloudflare R2 Direct Upload Error:', r2Err);
        // Fallback to Data URL for instant display
        const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
        return { success: true, imageId: key, url: dataUrl };
      }
    }

    // Fallback to Data URL if R2 client is unavailable
    const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
    return { success: true, imageId: key, url: dataUrl };
  } catch (err: any) {
    console.error('File processing error:', err);
    return { success: false, error: err?.message || 'حدث خطأ أثناء معالجة رفع الصورة' };
  }
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteCFImage(keyOrId: string): Promise<boolean> {
  if (r2Client && keyOrId && !keyOrId.startsWith('data:')) {
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
  if (stored.startsWith('http') || stored.startsWith('data:')) return stored;
  if (R2_PUBLIC_URL && !stored.includes('/')) {
    return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${stored}`;
  }
  return stored;
}
