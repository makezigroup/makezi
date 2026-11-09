import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ContentPage } from '@/components/mk/content-page';
import { Button, StatePanel, StatusBadge, btn } from '@/components/mk/core';
import { useApp, useFmt } from '@/lib/app-store';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/notifications')({ head: () => seo('اعلان‌های من', 'وضعیت بررسی نظرها، پاسخ‌ها و گزارش‌های شما در میکزی.', { noindex: true }), component: Notifications });
function Notifications() {
  const { phone } = useApp(), fmt = useFmt();
  const [rows, setRows] = useState<Database['public']['Tables']['user_notifications']['Row'][]>([]), [loading, setLoading] = useState(true), [error, setError] = useState('');
  useEffect(() => { if (!phone) { setLoading(false); return; } void supabase.from('user_notifications').select('*').eq('user_id', phone).order('created_at', { ascending: false }).then(({ data, error }) => { setRows(data ?? []); setError(error ? 'اعلان‌ها دریافت نشد.' : ''); setLoading(false); }); }, [phone]);
  const read = async (id?: string) => { if (!phone) return; let q = supabase.from('user_notifications').update({ read: true }).eq('user_id', phone); if (id) q = q.eq('id', id); const { error } = await q; if (error) setError('تغییر ذخیره نشد.'); else setRows(v => v.map(r => !id || r.id === id ? { ...r, read: true } : r)); };
  return <ContentPage title="اعلان‌های من">{!phone ? <StatePanel title="وارد حساب شوید" action={<Link to="/login" className={btn()}>ورود</Link>} /> : loading ? <p role="status">در حال دریافت…</p> : error ? <p role="alert">{error}</p> : rows.length === 0 ? <StatePanel title="اعلانی ندارید" action={<Link to="/my-reviews" className={btn({ variant: 'outline' })}>نظرهای من</Link>} /> : <><Button variant="outline" onClick={() => read()} disabled={rows.every(r => r.read)}>خواندن همه</Button><ul className="mt-6 divide-y divide-border">{rows.map(r => <li key={r.id} className="flex flex-wrap items-center gap-3 py-4"><div className="flex-1"><p>{r.message}</p><span className="text-caption text-muted-foreground">{fmt.date(r.created_at)}</span></div><StatusBadge tone={r.read ? 'neutral' : 'info'}>{r.read ? 'خوانده‌شده' : 'جدید'}</StatusBadge>{!r.read && <Button size="sm" variant="ghost" onClick={() => read(r.id)}>خواندم</Button>}<Link to="/my-reviews">نظرهای من</Link></li>)}</ul></>}</ContentPage>;
}