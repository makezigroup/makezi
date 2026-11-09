import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Button, DemoNote, Field, inputCls } from "@/components/mk/core";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";
import { MediaUpload } from '@/components/mk/media-upload';

export const Route = createFileRoute("/settings")({
  head: () => seo("تنظیمات", "تنظیمات نمایش و نام نمایشی در نظرها.", { noindex: true }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme, faDigits, setFaDigits, displayName, setDisplayName, phone } = useApp();
  const [notifications,setNotifications]=useState(false);
  const [privateAccount,setPrivate]=useState(true);
  const [avatar,setAvatar]=useState("");
  useEffect(()=>{if(phone)void supabase.from("profiles").select("*").eq("id",phone).maybeSingle().then(({data})=>{if(data){setNotifications(data.notifications);setPrivate(data.private_account);setAvatar(data.avatar_url ?? "");}});},[phone]);
  const save=async()=>{if(!phone)return;const {error}=await supabase.from("profiles").upsert({id:phone,display_name:displayName,notifications,private_account:privateAccount,avatar_url:avatar||null});error?toast.error("تنظیمات ذخیره نشد."):toast.success("تنظیمات ذخیره شد.");};
  return (
    <SiteLayout>
      <PageIntro title="تنظیمات" />
      <div className="container-mk flex max-w-2xl flex-col gap-6">
        {phone && (
          <section className="rounded-card bg-card p-5 shadow-card">
            <Field label="نام نمایشی در نظرها" htmlFor="dn" hint="اگر خالی بماند «کاربر میکزی» نمایش داده می‌شود. شماره‌ی موبایل هرگز عمومی نمی‌شود.">
              <input id="dn" className={inputCls} value={displayName} maxLength={30} onChange={(e) => setDisplayName(e.target.value)} />
            </Field>
          </section>
        )}
        <section className="flex flex-col gap-2 rounded-card bg-card p-5 shadow-card">
          <h2 className="text-h3">نمایش</h2>
          <label className="flex min-h-12 items-center justify-between">تم تیره <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} /></label>
          <label className="flex min-h-12 items-center justify-between">ارقام فارسی <Switch checked={faDigits} onCheckedChange={setFaDigits} /></label>
        </section>
        {phone && <section className="flex flex-col gap-4"><MediaUpload onUploaded={setAvatar}/><label className="flex justify-between">اعلان‌های بررسی نظرها<Switch checked={notifications} onCheckedChange={setNotifications}/></label><DemoNote>اطلاعات خصوصی حساب و مدارک شما عمومی نیستند؛ نام نمایشی همراه نظر منتشر می‌شود.</DemoNote><Button onClick={save}>ذخیره‌ی تنظیمات حساب</Button><form className="flex flex-col gap-3" onSubmit={async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const {error}=await supabase.auth.updateUser({password:String(f.get('password')),current_password:String(f.get('current'))});error?toast.error('رمز تغییر نکرد؛ رمز فعلی را بررسی کنید.'):toast.success('رمز تغییر کرد.');}}><h2 className="text-h3">تغییر رمز</h2><input name="current" aria-label="رمز فعلی" type="password" required autoComplete="current-password" className={inputCls}/><input name="password" aria-label="رمز جدید" type="password" minLength={8} required autoComplete="new-password" className={inputCls}/><Button variant="outline">تغییر رمز</Button></form><Link to="/delete-account" className="text-error-text">درخواست حذف حساب</Link></section>}
        <DemoNote>تم و نوع ارقام روی این دستگاه ذخیره می‌شوند؛ تنظیمات حساب به حساب شما متصل‌اند.</DemoNote>
      </div>
    </SiteLayout>
  );
}
