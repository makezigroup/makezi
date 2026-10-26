import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/mk/content-page";
import { Icon, btn, DecisionTag } from "@/components/mk/core";
import { seo } from "@/lib/seo";

const STEPS = [
  { i: "search" as const, t: "جست‌وجو", b: "خدمت، محله، بازه‌ی قیمت و زمان دلخواه را انتخاب کنید. می‌توانید فقط سالن‌های دارای مدارک تأییدشده را ببینید." },
  { i: "sort" as const, t: "مقایسه", b: "نتایج «مرتب‌شده بر اساس …» هستند و معیار مرتب‌سازی همیشه نوشته می‌شود. برای سالن‌های کم‌نظر، امتیاز ساختگی نمایش داده نمی‌شود." },
  { i: "salon" as const, t: "بررسی پروفایل", b: "فهرست قیمت با تاریخ به‌روزرسانی، متخصصان، مدارک، نمونه‌کار و نظرهای تأییدشده با پاسخ سالن." },
  { i: "calendar" as const, t: "رزرو", b: "خدمت، متخصص و ساعت را انتخاب کنید. جمع قیمت پیش از ثبت نمایش داده می‌شود." },
  { i: "bell" as const, t: "تأیید سالن", b: "در این نسخه رزرو درخواستی است: نوبت تا تأیید سالن «در انتظار تأیید» می‌ماند." },
  { i: "review" as const, t: "نظر", b: "پس از انجام نوبت، می‌توانید درباره‌ی همان رزرو نظر بنویسید." },
];

export const Route = createFileRoute("/how-it-works")({
  head: () => seo("میکزی چطور کار می‌کند", "از جست‌وجو تا نظر: شش قدم رزرو آگاهانه‌ی نوبت زیبایی در میکزی."),
  component: () => (
    <ContentPage title="میکزی چطور کار می‌کند" body="از جست‌وجو تا نظر، در شش قدم روشن.">
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, n) => (
          <li key={s.t} className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-card">
            <span className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-muted"><Icon name={s.i} /></span>
              <span className="font-mono text-caption text-muted-foreground">قدم {"۱۲۳۴۵۶"[n]}</span>
            </span>
            <h2 className="text-h3">{s.t}</h2>
            <p className="text-muted-foreground">{s.b}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <DecisionTag id="BK-1" />
        <span className="text-caption text-muted-foreground">رزرو فوری یا درخواستی هنوز تصمیم‌گیری نشده است.</span>
      </div>
      <Link to="/discover" className={btn({ size: "lg" }) + " mt-8"}>شروع جست‌وجو</Link>
    </ContentPage>
  ),
});
