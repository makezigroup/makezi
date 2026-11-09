import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { SiteLayout } from '@/components/mk/layout';
import { Button, Field, StatePanel, btn, inputCls } from '@/components/mk/core';
import { supabase } from '@/integrations/supabase/client';
import { safeReturnPath } from '@/lib/cloud-data';
import { seo } from '@/lib/seo';
export const Route=createFileRoute('/verify')({head:()=>seo('تأیید حساب میکزی','تکمیل ورود یا بازیابی رمز حساب میکزی.',{noindex:true}),component:Verify});
function Verify(){const router=useRouter();const [recovery,setRecovery]=useState(false);const [password,setPassword]=useState('');const [error,setError]=useState('');
useEffect(()=>{const hash=window.location.hash;const recovering=hash.includes('type=recovery');setRecovery(recovering);const {data}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setRecovery(true);else if(event==='SIGNED_IN'&&!recovering)router.history.push(safeReturnPath(sessionStorage.getItem('mkz-return')));});void supabase.auth.getSession().then(({data})=>{if(data.session&&!recovering)router.history.push(safeReturnPath(sessionStorage.getItem('mkz-return')));});return()=>data.subscription.unsubscribe();},[router]);
return <SiteLayout footer={false}><div className="container-mk py-16">{recovery?<form className="mx-auto flex max-w-md flex-col gap-4" onSubmit={async e=>{e.preventDefault();const {error}=await supabase.auth.updateUser({password});if(error)setError('تغییر رمز ممکن نشد.');else router.history.push('/account');}}><h1 className="text-h2">رمز جدید</h1><Field label="رمز عبور جدید" htmlFor="new-pass"><input id="new-pass" type="password" minLength={8} required className={inputCls} value={password} onChange={e=>setPassword(e.target.value)}/></Field>{error&&<p role="alert">{error}</p>}<Button type="submit">ذخیره‌ی رمز</Button></form>:<StatePanel icon="profile" title="تأیید حساب" body="پیوند تأیید ایمیل را باز کنید یا وارد حساب شوید." action={<Link to="/login" className={btn()}>ورود</Link>}/>}</div></SiteLayout>;
}
