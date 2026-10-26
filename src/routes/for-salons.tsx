import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/mk/content-page";
import { Icon, btn, DemoNote } from "@/components/mk/core";
import { SafeImg } from "@/components/mk/marketplace";
import { IMAGES } from "@/lib/data";
import { seo } from "@/lib/seo";

const FEATURES = [
  { i: "salon" as const, t: "پروفایل ساختاریافته", b: "هویت، آدرس، ساعت کاری و متخصصان در قالبی که مشتری می‌تواند مقایسه کند." },
  { i: "payment" as const, t: "فهرست قیمت شفاف", b: "قیمت هر خدمت با مدت زمان و تاریخ به‌روزرسانی؛ با امکان «از» و دلیل آن." },
  { i: "gallery" as const, t: "نمونه‌کار واقعی", b: "تصویرهای کار خودتان با برچسب خدمت؛ هر مدل در گالری به پروفایل شما برمی‌گردد." },
  { i: "verified" as const, t: "تأیید مدارک", b: "مدارک را بارگذاری کنید؛ پس از بررسی، برچسب «مدارک تأییدشده» روی پروفایل نمایش داده می‌شود." },
  { i: "calendar" as const, t: "مدیریت نوبت", b: "درخواست‌های رزرو را تأیید یا رد کنید و زمان‌های خالی را تنظیم کنید." },
  { i: "review" as const, t: "پاسخ به نظرها", b: "به نظرهای تأییدشده پاسخ دهید؛ پاسخ شما کنار نظر نمایش داده می‌شود." },
];

export const Route = createFileRoute("/for-salons")({
  head: () => seo("همکاری سالن‌ها با میکزی", "پروفایل ساختاریافته، فهرست قیمت شفاف، نمونه‌کار و مدیریت نوبت برای سالن‌های زیبایی."),
  component: () => (
    <ContentPage title="سالن خود را در میکزی ثبت کنید" body="با کیفیت کار و کامل‌بودن اطلاعاتتان دیده شوید.">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <SafeImg src={IMAGES.nailArt} alt="متخصص ناخن در حال کار؛ تصویر نمونه" className="aspect-[4/5] w-full rounded-sheet lg:aspect-square" />
        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-3">
            {["ثبت حساب و هویت سالن", "تعریف خدمات و قیمت‌ها", "بارگذاری نمونه‌کار", "ارسال مدارک برای بررسی", "تنظیم زمان‌های کاری", "پیش‌نمایش و انتشار پروفایل"].map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-card bg-card p-4 shadow-card">
                <span className="grid size-8 place-items-center rounded-full bg-muted font-mono text-caption">{"۱۲۳۴۵۶"[i]}</span>
                {s}
              </li>
            ))}
          </ol>
          <DemoNote>هزینه، کارمزد و شرایط قرارداد سالن‌ها هنوز اعلام نشده است. در این صفحه هیچ تعهد مالی یا حقوقی ذکر نمی‌شود.</DemoNote>
          <div className="flex flex-wrap gap-3">
            <Link to="/salon/onboarding" className={btn({ size: "lg" })}>شروع ثبت سالن</Link>
            <Link to="/salon" className={btn({ variant: "outline", size: "lg" })}>دیدن پنل نمونه</Link>
          </div>
        </div>
      </div>
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.t} className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-card">
            <span className="grid size-11 place-items-center rounded-full bg-muted"><Icon name={f.i} /></span>
            <h2 className="text-h3">{f.t}</h2>
            <p className="text-muted-foreground">{f.b}</p>
          </div>
        ))}
      </div>
    </ContentPage>
  ),
});
