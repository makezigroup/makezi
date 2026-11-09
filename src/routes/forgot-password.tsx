import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ContentPage } from '@/components/mk/content-page';
import { Button, Field, inputCls } from '@/components/mk/core';
import { supabase } from '@/integrations/supabase/client';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/forgot-password')({ head: () => seo('بازیابی رمز', 'درخواست پیوند بازیابی رمز حساب میکزی.', { noindex: true }), component: ForgotPassword });
function ForgotPassword() { const [busy, setBusy] = useState(false), [message, setMessage] = useState(''); return <ContentPage title="بازیابی رمز"><form className="flex max-w-md flex-col gap-4" onSubmit={async e => { e.preventDefault(); const email = String(new FormData(e.currentTarget).get('email') ?? ''); setBusy(true); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); setMessage(error ? 'ارسال درخواست ممکن نشد.' : 'اگر حسابی با این ایمیل وجود داشته باشد، پیوند بازیابی ارسال می‌شود.'); setBusy(false); }}><Field label="ایمیل" htmlFor="reset-email"><input name="email" id="reset-email" type="email" required className={inputCls} /></Field><Button disabled={busy}>{busy ? 'در حال ارسال…' : 'ارسال پیوند'}</Button>{message && <p role="status">{message}</p>}</form></ContentPage>; }