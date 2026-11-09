import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ContentPage } from "@/components/mk/content-page";
import { Button, Chip, DemoNote, Field, Icon, btn, inputCls } from "@/components/mk/core";
import { CATEGORIES, CITIES } from "@/lib/data";
import { validateInquiry, type InquiryErrors } from "@/lib/rules";
import { useApp } from "@/lib/app-store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const FEATURES = [
  { i: "salon" as const, t: "اطلاعات را تیم میکزی ثبت می‌کند", b: "پس از تماس، تیم ما اطلاعات، خدمات و قیمت‌ها را با شما بررسی و منتشر می‌کند." },
  { i: "payment" as const, t: "قیمت روشن", b: "قیمت هر خدمت با تاریخ آخرین بررسی نمایش داده می‌شود." },
  { i: "gallery" as const, t: "نمونه‌کار واقعی", b: "تصویرهای کار خودتان با برچسب خدمت، کنار پروفایل." },
  { i: "verified" as const, t: "تأیید مدارک", b: "پس از بررسی مدارک، برچسب «مدارک تأییدشده» روی پروفایل می‌آید." },
  { i: "review" as const, t: "پاسخ به نظرها", b: "پاسخ رسمی به نظرها را برای بررسی تیم میکزی ارسال کنید. سالن نمی‌تواند نظری را حذف کند." },
  { i: "sort" as const, t: "جایگاه فروشی نیست", b: "ترتیب نتایج بر اساس معیارهای اعلام‌شده است، نه پرداخت." },
];

export const Route = createFileRoute("/for-salons")({
  head: () => seo("ثبت سالن در میکزی", "درخواست ثبت سالن بفرستید؛ تیم میکزی اطلاعات، قیمت‌ها و نمونه‌کار شما را بررسی و منتشر می‌کند.", { path: "/for-salons" }),
  component: ForSalons,
});

function ForSalons() {
  const { addInquiry } = useApp();
  const [v, setV] = useState({ business: "", name: "", phone: "", city: "tehran", area: "", message: "", instagram: "", website: "" });
  const [cats, setCats] = useState<string[]>([]);
  const [err, setErr] = useState<InquiryErrors>({});
  const [sent, setSent] = useState(false);
  const [busy,setBusy]=useState(false);
  const up = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });
  return (
    <ContentPage title="سالن خود را به میکزی اضافه کنید" body="فرم را پر کنید؛ تیم میکزی برای بررسی اطلاعات با شما تماس می‌گیرد.">
      <div className="mb-14 grid overflow-hidden rounded-sheet bg-card shadow-card md:grid-cols-2">
        <div className="min-h-48 bg-muted pattern-medium md:min-h-80" aria-hidden />
        <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
          <h2 className="text-h2">با کیفیت کار و کامل‌بودن اطلاعاتتان دیده شوید</h2>
          <p className="text-muted-foreground">اطلاعات، خدمات، قیمت‌ها، نمونه‌کار و مدارک سالن شما را تیم میکزی بررسی می‌کند.</p>
          <div className="flex flex-wrap gap-3"><a href="#listing-request" className={btn({ variant: "ink" })}>شروع ثبت سالن</a><Link to="/how-it-works" className={btn({ variant: "outline" })}>میکزی چطور کار می‌کند</Link></div>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.t} className="flex flex-col gap-2 rounded-card bg-card p-5 shadow-card">
              <span className="grid size-10 place-items-center rounded-full bg-muted"><Icon name={f.i} size={20} /></span>
              <h2 className="text-h3">{f.t}</h2>
              <p className="text-caption text-muted-foreground">{f.b}</p>
            </div>
          ))}
        </div>
        {sent ? (
          <div className="rounded-card bg-success-soft p-6 text-success-text">درخواست شما ثبت شد. تیم میکزی برای هماهنگی تماس می‌گیرد.</div>
        ) : (
          <form
            noValidate
            id="listing-request"
            className="flex max-w-2xl scroll-mt-24 flex-col gap-4 rounded-card bg-card p-6 shadow-card"
            onSubmit={async (e) => {
              e.preventDefault();
              const er = validateInquiry({ ...v, city: v.city });
              setErr(er);
              if (Object.keys(er).length) return;
              setBusy(true);try { await addInquiry({ ...v, categories: cats }); setSent(true); toast.success("درخواست ثبت شد."); } catch { toast.error("درخواست ذخیره نشد؛ دوباره تلاش کنید."); }finally{setBusy(false);}
            }}
          >
            <h2 className="text-h2">درخواست ثبت سالن</h2>
            <Field label="نام سالن" htmlFor="b" error={err.business}><input id="b" className={inputCls} value={v.business} onChange={up("business")} aria-invalid={!!err.business} /></Field>
            <Field label="نام شما" htmlFor="n" error={err.name}><input id="n" className={inputCls} value={v.name} onChange={up("name")} aria-invalid={!!err.name} /></Field>
            <Field label="شماره‌ی تماس" htmlFor="p" error={err.phone}><input id="p" dir="ltr" inputMode="tel" className={inputCls + " text-start font-mono"} value={v.phone} onChange={up("phone")} aria-invalid={!!err.phone} placeholder="09xxxxxxxxx" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="شهر" htmlFor="c" error={err.city}><select id="c" className={inputCls} value={v.city} onChange={up("city")}>{CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></Field>
              <Field label="محله" htmlFor="a"><input id="a" className={inputCls} value={v.area} onChange={up("area")} /></Field>
            </div>
            <fieldset><legend className="mb-2 text-caption font-semibold">خدمات</legend>
              <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => <Chip key={c.id} active={cats.includes(c.id)} onClick={() => setCats(cats.includes(c.id) ? cats.filter((x) => x !== c.id) : [...cats, c.id])}>{c.label}</Chip>)}</div>
            </fieldset>
            <Field label="اینستاگرام (اختیاری)" htmlFor="ig"><input id="ig" dir="ltr" className={inputCls} value={v.instagram} onChange={up("instagram")} /></Field>
            <Field label="وب‌سایت (اختیاری)" htmlFor="web"><input id="web" type="url" dir="ltr" className={inputCls} value={v.website} onChange={up("website")} /></Field>
            <Field label="توضیح" htmlFor="m" error={err.message}><textarea id="m" rows={3} className={cn(inputCls, "py-3")} value={v.message} onChange={up("message")} /></Field>
            <Button type="submit" disabled={busy}>{busy?'در حال ثبت…':'ارسال درخواست'}</Button>
            <DemoNote>هزینه و شرایط همکاری هنوز اعلام نشده است. این درخواست به‌معنای انتشار خودکار سالن نیست.</DemoNote>
          </form>
        )}
      </div>
    </ContentPage>
  );
}
