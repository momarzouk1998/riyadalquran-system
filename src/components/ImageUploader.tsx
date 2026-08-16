'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, ImageIcon, CheckCircle2 } from 'lucide-react';
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    // Local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewSrc(localPreview);

    try {
      const form = new FormData();
      form.append('file', file);
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
    onUploadSuccess?.('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold text-slate-500">{label}</label>

      <div className="flex items-start gap-3">
        {/* Preview box */}
        <div className="relative shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
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
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
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
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>جاري الرفع...</span></>
            ) : (
              <><Upload className="w-3.5 h-3.5" /><span>رفع صورة جديدة</span></>
            )}
          </button>

          {storedValue && !uploading && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم الرفع بنجاح على Cloudflare</span>
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
            className="form-input text-[11px] text-left"
            placeholder="أو الصق رابط الصورة مباشرة..."
            dir="ltr"
          />

          {error && (
            <p className="text-[11px] text-red-600">{error}</p>
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
