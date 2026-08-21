'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, ImageIcon, CheckCircle2, Zap } from 'lucide-react';
import { resolveImageUrl } from '@/lib/cloudflare';

interface ImageUploaderProps {
  /** Current stored value — CF image ID or full URL */
  currentValue?: string | null;
  /** Name of the hidden input that holds the final URL/ID */
  inputName?: string;
  /** Optional student ID to attach as metadata */
  studentId?: string;
  /** Called when upload succeeds; receives the stored URL */
  onUploadSuccess?: (url: string) => void;
  label?: string;
}

/**
 * Compress and resize images on client-side before upload to save Cloudflare R2 storage & bandwidth
 * Resizes to max 600x600 at 75% JPEG quality (~30 KB size instead of 5 MB)
 */
function compressImage(
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.75
): Promise<Blob> {
  return new Promise((resolve) => {
    // If file is already smaller than 80 KB, don't re-compress
    if (file.size <= 80 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  currentValue,
  inputName = 'imageUrl',
  studentId,
  onUploadSuccess,
  label = 'صورة الطالب',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<string>(currentValue ?? '');
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    resolveImageUrl(currentValue, 'thumbnail')
  );
  const [compressedStats, setCompressedStats] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    setError(null);
    setUploading(true);
    setCompressedStats(null);

    // Compress image to save Cloudflare storage
    const originalKb = (originalFile.size / 1024).toFixed(0);
    const compressedBlob = await compressImage(originalFile);
    const compressedKb = (compressedBlob.size / 1024).toFixed(0);

    setCompressedStats(`تم ضغط الصورة من ${originalKb} KB إلى ${compressedKb} KB لتوفير المساحة ⚡`);

    // Local preview immediately
    const localPreview = URL.createObjectURL(compressedBlob);
    setPreviewSrc(localPreview);

    try {
      const form = new FormData();
      form.append('file', compressedBlob, originalFile.name.replace(/\.[^/.]+$/, ".jpg"));
      if (studentId) form.append('studentId', studentId);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'فشل الرفع');
        setPreviewSrc(resolveImageUrl(currentValue, 'thumbnail'));
        setUploading(false);
        return;
      }

      // Store the URL returned (full CDN URL)
      setStoredValue(data.url);
      setPreviewSrc(data.url);
      onUploadSuccess?.(data.url);
    } catch {
      setError('خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً.');
      setPreviewSrc(resolveImageUrl(currentValue, 'thumbnail'));
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setStoredValue('');
    setPreviewSrc(null);
    setError(null);
    setCompressedStats(null);
    onUploadSuccess?.('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2 font-cairo">
      <label className="block text-[11px] font-bold text-slate-700">{label}</label>

      <div className="flex items-start gap-3">
        {/* Preview box */}
        <div className="relative shrink-0 w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
          {previewSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="معاينة"
                className="w-full h-full object-cover"
                onError={() => setPreviewSrc(null)}
              />
              {!uploading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {uploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" /><span>جاري ضغط ورفع الصورة...</span></>
            ) : (
              <><Upload className="w-3.5 h-3.5 text-emerald-700" /><span>رفع صورة ضوئية مضغوطة</span></>
            )}
          </button>

          {compressedStats && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              <Zap className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{compressedStats}</span>
            </div>
          )}

          {storedValue && !uploading && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مرفوعة ومحفوظة بنجاح على Cloudflare</span>
            </div>
          )}

          {/* Manual URL input fallback */}
          <input
            type="text"
            value={storedValue}
            onChange={(e) => {
              setStoredValue(e.target.value);
              setPreviewSrc(e.target.value || null);
            }}
            className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-left font-mono"
            placeholder="أو الصق رابط الصورة مباشرة..."
            dir="ltr"
          />

          {error && (
            <p className="text-[11px] font-bold text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Hidden input carrying the value to the form */}
      <input type="hidden" name={inputName} value={storedValue} />

      {/* Actual file picker — hidden */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
