import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { uploadToCFImages } from '@/lib/cloudflare';

/**
 * POST /api/upload-image
 * Accepts: multipart/form-data with field "file" (image)
 * Optional: field "studentId" for metadata
 *
 * Returns: { success: true, imageId, url } | { success: false, error }
 *
 * Protected: admin session required
 */
export async function POST(req: NextRequest) {
  // Auth check — only logged-in admins can upload
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'غير مصرح. يجب تسجيل الدخول أولاً.' },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: 'بيانات الطلب غير صالحة' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: 'لم يتم إرسال أي ملف صورة' },
      { status: 400 }
    );
  }

  // Validate type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: 'نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP.' },
      { status: 400 }
    );
  }

  // Validate size — 5 MB max
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: 'حجم الصورة يتجاوز الحد المسموح (5 MB).' },
      { status: 400 }
    );
  }

  const studentId = formData.get('studentId')?.toString();
  const metadata: Record<string, string> = { uploadedBy: admin.username };
  if (studentId) {
    metadata.studentId = studentId;
  }

  const result = await uploadToCFImages(file, metadata);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    imageId: result.imageId,
    url: result.url,
  });
}
