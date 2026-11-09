import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/lib/app-store';
import { Field, inputCls } from './core';
export function MediaUpload({ salonId, onUploaded }: { salonId?: string; onUploaded: (url: string) => void }) {
  const { phone } = useApp(); const [busy, setBusy] = useState(false), [error, setError] = useState('');
  return <Field label="بارگذاری تصویر" error={error}><input type="file" accept="image/jpeg,image/png,image/webp" className={inputCls} disabled={busy || !phone} onChange={async e => {
    const file = e.target.files?.[0]; if (!file || !phone) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('تصویر JPG، PNG یا WebP تا ۵ مگابایت انتخاب کنید.'); return; }
    setBusy(true); setError('');
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${salonId ? `salons/${salonId}` : `avatars/${phone}`}/${crypto.randomUUID()}.${ext}`;
    const result = await supabase.storage.from('makezi-media').upload(path, file);
    if (result.error) setError('تصویر ذخیره نشد.');
    else if (salonId) onUploaded(`/api/public/media?path=${encodeURIComponent(path)}`);
    else onUploaded(`storage:${path}`);
    setBusy(false);
  }} />{busy && <span role="status">در حال ارسال…</span>}</Field>;
}