import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Button, DemoNote, Field, StatePanel, inputCls } from './core';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/lib/app-store';
import { supportSchema } from '@/lib/product-schemas';
import { requestAccountDeletion } from '@/lib/product.functions';

export function SupportForm({ kind = 'contact' }: { kind?: 'contact' | 'problem' | 'account-deletion' }) {
  const { phone, email } = useApp();
  const requestDeletion = useServerFn(requestAccountDeletion);
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [error, setError] = useState('');
  if (done) return <StatePanel icon="verified" title="درخواست شما ثبت شد" body="تیم میکزی درخواست را بررسی می‌کند." action={<Button variant="outline" onClick={() => setDone(false)}>درخواست دیگر</Button>} />;
  return <form className="flex max-w-xl flex-col gap-4" onSubmit={async e => {
    e.preventDefault(); setError('');
    const f = new FormData(e.currentTarget);
    const parsed = supportSchema.safeParse({ kind, category: f.get('category'), name: f.get('name'), contact: f.get('contact'), message: f.get('message'), related_path: f.get('path') ?? '' });
    if (!parsed.success) { setError('اطلاعات تماس و پیام دست‌کم ۱۰ نویسه‌ای را بررسی کنید.'); return; }
    if (kind === 'account-deletion' && !phone) { setError('ابتدا وارد حساب شوید.'); return; }
    setBusy(true);
    try {
      if (kind === 'account-deletion') await requestDeletion({ data: parsed.data });
      else { const { error } = await supabase.from('support_submissions').insert({ ...parsed.data, user_id: phone }); if (error) throw error; }
      setDone(true);
    } catch { setError('درخواست ذخیره نشد؛ دوباره تلاش کنید.'); } finally { setBusy(false); }
  }}>
    <Field label="نام" htmlFor="support-name"><input id="support-name" name="name" maxLength={100} className={inputCls} /></Field>
    <Field label="ایمیل یا شمارهٔ تماس" htmlFor="support-contact"><input id="support-contact" name="contact" required maxLength={255} defaultValue={email} className={inputCls} /></Field>
    <Field label="موضوع" htmlFor="support-category"><select id="support-category" name="category" className={inputCls}>{(kind === 'account-deletion' ? ['حذف حساب'] : kind === 'problem' ? ['اطلاعات سالن', 'قیمت', 'نظر یا محتوا', 'پیوند خراب', 'سایر'] : ['پشتیبانی حساب', 'اطلاعات سالن', 'همکاری', 'سایر']).map(v => <option key={v}>{v}</option>)}</select></Field>
    {kind === 'problem' && <Field label="نشانی صفحهٔ مربوط (اختیاری)" htmlFor="support-path"><input id="support-path" name="path" maxLength={300} placeholder="/salons/…" className={inputCls} /></Field>}
    <Field label="پیام" htmlFor="support-message"><textarea id="support-message" name="message" required minLength={10} maxLength={2000} rows={5} className={inputCls + ' py-3'} /></Field>
    {kind === 'account-deletion' && <><DemoNote>این درخواست برای بررسی کارکنان است؛ حساب، نظرها و مدارک اکنون خودکار حذف نمی‌شوند. سیاست نگهداری نهایی هنوز تأیید نشده است.</DemoNote><label className="flex gap-2"><input type="checkbox" required /> درخواست بررسی حذف حساب را تأیید می‌کنم.</label></>}
    {error && <p role="alert" className="text-error-text">{error}</p>}
    <Button type="submit" disabled={busy}>{busy ? 'در حال ثبت…' : 'ثبت درخواست'}</Button>
  </form>;
}