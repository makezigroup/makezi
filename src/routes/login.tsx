import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import { SiteLayout } from '@/components/mk/layout';
import { Button, Field, LogoMark, inputCls } from '@/components/mk/core';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { safeReturnPath } from '@/lib/cloud-data';
import { seo } from '@/lib/seo';
import '@lovable.dev/cloud-auth-js/styles.css';
export const Route = createFileRoute('/login')({ validateSearch:z.object({redirect:z.string().optional()}), head:()=>seo('ورود به میکزی','ورود امن برای ثبت نظر و ذخیره‌ی سالن‌ها.',{noindex:true}),component:Login });
function Login(){
 const router=useRouter(); const nav=useNavigate(); const {redirect}=Route.useSearch();
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [signup,setSignup]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState('');
 const finish=()=>router.history.push(safeReturnPath(redirect ?? sessionStorage.getItem('mkz-return')));
 const social=async(provider:'google'|'lovable')=>{setError('');sessionStorage.setItem('mkz-return',safeReturnPath(redirect));const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:`${window.location.origin}/verify`});if(result.error)setError(result.error.message);else if(!result.redirected)finish();};
 return <SiteLayout footer={false}><div className="container-mk grid min-h-[70vh] place-items-center py-10"><form className="flex w-full max-w-md flex-col gap-4 rounded-sheet bg-card p-6 shadow-modal md:p-8" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');setMessage('');try{if(signup){const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${window.location.origin}/verify`}});if(error)throw error;if(data.session)finish();else setMessage('پیوند تأیید به ایمیل شما فرستاده شد. پوشه‌ی هرزنامه را هم بررسی کنید.');}else{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;finish();}}catch{setError('ورود ممکن نشد؛ ایمیل، رمز و تأیید حساب را بررسی کنید.');}finally{setBusy(false);}}}>
 <LogoMark className="h-8 w-auto self-start"/><h1 className="text-h2">{signup?'ساخت حساب میکزی':'ورود به میکزی'}</h1>
 <Field label="ایمیل" htmlFor="auth-email"><input id="auth-email" type="email" dir="ltr" autoComplete="email" required className={inputCls} value={email} onChange={e=>setEmail(e.target.value)}/></Field>
 <Field label="رمز عبور" htmlFor="auth-pass"><input id="auth-pass" type="password" minLength={8} autoComplete={signup?'new-password':'current-password'} required className={inputCls} value={password} onChange={e=>setPassword(e.target.value)}/></Field>
 {error&&<p role="alert" className="text-caption text-error-text">{error}</p>}{message&&<p role="status" className="text-caption text-success-text">{message}</p>}
 <Button type="submit" disabled={busy}>{busy?'لطفاً صبر کنید…':signup?'ساخت حساب':'ورود'}</Button>
 <Button type="button" variant="ghost" onClick={()=>setSignup(!signup)}>{signup?'حساب دارید؟ ورود':'حساب ندارید؟ ثبت‌نام'}</Button>
 <Button type="button" variant="outline" onClick={()=>social('google')}><svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg> ادامه با Google</Button>
 <Button type="button" className="lovable-auth-button" onClick={()=>social('lovable')}>Continue with Lovable</Button>
  <Link to="/forgot-password">رمز را فراموش کرده‌اید؟</Link>
 </form></div></SiteLayout>;
}
