import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Icon, SectionHead, btn, Dot, inputCls } from "@/components/mk/core";
import { SalonCard, SafeImg } from "@/components/mk/marketplace";
import { AREAS, CATEGORIES, FAQ, GALLERY, IMAGES, SALONS } from "@/lib/data";
import { seo } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => seo("انتخاب آگاهانه در زیبایی", "سالن زیبایی را با قیمت ثبت‌شده، مدارک بررسی‌شده و نظرهای تأییدشده پیدا کنید، مقایسه کنید و نوبت بگیرید."),
  component: Home,
});

function HeroSearch() {
  const nav = useNavigate();
  const [cat, setCat] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  return (
    <form
      role="search"
      aria-label="جست‌وجوی سالن"
      onSubmit={(e) => {
        e.preventDefault();
        nav({ to: "/discover", search: { cat: cat || undefined, area: area || undefined, date: date || undefined } });
      }}
      className="grid gap-3 rounded-card bg-card p-4 shadow-modal sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <label className="flex flex-col gap-1 text-caption font-semibold">
        خدمت
        <select className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">همه‌ی خدمات</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-caption font-semibold">
        محله
        <select className={inputCls} value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">همه‌ی محله‌ها</option>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-caption font-semibold">
        تاریخ (اختیاری)
        <select className={inputCls} value={date} onChange={(e) => setDate(e.target.value)}>
          <option value="">هر زمان</option>
          <option value="today">امروز</option>
          <option value="tomorrow">فردا</option>
        </select>
      </label>
      <button type="submit" className={cn(btn({ size: "md" }), "self-end sm:col-span-2 lg:col-span-1")}>
        <Icon name="search" size={20} /> جست‌وجو
      </button>
    </form>
  );
}

function Home() {
  const featured = SALONS.filter((s) => s.status === "verified").slice(0, 4);
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="container-mk grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2 text-caption font-semibold text-muted-foreground">
            <Dot /> انتخاب آگاهانه در زیبایی
          </p>
          <h1 className="text-display">
            سالن را با <span className="bg-lime px-2 text-brand-ink">قیمت و نمونه‌کار واقعی</span> انتخاب کنید
          </h1>
          <p className="max-w-xl text-body-l text-muted-foreground">
            قیمت ثبت‌شده‌ی هر خدمت، مدارک بررسی‌شده و نظر کسانی که واقعاً نوبت گرفته‌اند را کنار هم ببینید و بدون تماس و پیام، نوبت رزرو کنید.
          </p>
          <HeroSearch />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to="/discover" search={{ cat: c.id }} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-caption font-semibold text-foreground no-underline hover:bg-muted">
                <Icon name={c.icon} size={18} /> {c.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative">
          <SafeImg src={IMAGES.heroNails} alt="ژلیش صورتی روی دست؛ نمونه‌ی تصویر" eager className="aspect-[4/5] w-full rounded-sheet lg:aspect-[4/4.6]" />
          <div className="absolute -bottom-6 start-6 flex max-w-64 flex-col gap-1 rounded-card bg-card p-4 shadow-modal">
            <span className="text-label text-muted-foreground">ژلیش دست · سالن [نام ۲]</span>
            <span className="font-semibold">۴۵۰٬۰۰۰ تومان</span>
            <span className="flex items-center gap-1 text-label text-success-text"><Icon name="verified" size={14} /> قیمت ثبت‌شده · به‌روزرسانی ۱۲ مهر</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-mk py-16">
        <SectionHead eyebrow="سه قدم" title="پیدا کنید، مقایسه کنید، رزرو کنید" />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { i: "search" as const, t: "پیدا کنید", b: "بر اساس خدمت، محله، قیمت و زمان خالی جست‌وجو کنید." },
            { i: "sort" as const, t: "مقایسه کنید", b: "قیمت ثبت‌شده، نمونه‌کار، مدارک و نظرهای تأییدشده را کنار هم ببینید. ترتیب نتایج همیشه توضیح داده می‌شود." },
            { i: "calendar" as const, t: "رزرو کنید", b: "خدمت، متخصص و ساعت را انتخاب کنید و وضعیت نوبت را در «نوبت‌های من» دنبال کنید." },
          ].map((s, n) => (
            <li key={s.t} className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-card">
              <span className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name={s.i} /></span>
                <span className="font-mono text-h2 text-muted-foreground">{"۱۲۳"[n]}</span>
              </span>
              <h3 className="text-h3">{s.t}</h3>
              <p className="text-muted-foreground">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Featured */}
      <section className="container-mk py-16">
        <SectionHead
          eyebrow="سالن‌های دارای مدارک تأییدشده"
          title="چند سالن برای شروع"
          body="مرتب‌شده بر اساس کامل‌بودن پروفایل. همه‌ی داده‌ها در این نسخه نمونه هستند."
          action={<Link to="/discover" className={btn({ variant: "outline", size: "sm" })}>همه‌ی سالن‌ها</Link>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <SalonCard key={s.id} salon={s} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-inverse py-20 text-inverse-foreground">
        <div className="container-mk">
          <h2 className="text-h2">به‌جای ادعا، شواهد</h2>
          <p className="mt-2 max-w-2xl text-body-l opacity-80">هرجا ممکن است «بهترین» بگوییم، یک عدد یا مدرک نشان می‌دهیم.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { i: "payment" as const, t: "قیمت ثبت‌شده", b: "هر سالن قیمت خدماتش را با تاریخ به‌روزرسانی ثبت می‌کند. اگر قیمت «از» باشد، دلیلش هم نوشته می‌شود." },
              { i: "verified" as const, t: "مدارک بررسی‌شده", b: "مدرک فنی و مجوز بهداشت سالن بررسی می‌شود. این برچسب درباره‌ی مدارک است، نه تضمین کیفیت." },
              { i: "review" as const, t: "نظر پس از رزرو", b: "فقط کسی که نوبتش انجام شده می‌تواند نظر بنویسد؛ و سالن می‌تواند پاسخ دهد." },
            ].map((f) => (
              <div key={f.t} className="flex flex-col gap-3 rounded-card border border-current/15 p-6">
                <span className="grid size-12 place-items-center rounded-full bg-lime text-brand-ink"><Icon name={f.i} /></span>
                <h3 className="text-h3">{f.t}</h3>
                <p className="opacity-80">{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="container-mk py-16">
        <SectionHead
          eyebrow="گالری مدل"
          title="ایده بگیرید، همان را رزرو کنید"
          body="هر مدل به سالن سازنده و خدمت مربوطش وصل است."
          action={<Link to="/gallery" className={btn({ variant: "outline", size: "sm" })}>دیدن گالری</Link>}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {GALLERY.slice(0, 4).map((g) => (
            <Link key={g.id} to="/gallery" className="group block overflow-hidden rounded-card no-underline">
              <SafeImg src={g.image} alt={g.title} className="aspect-[4/5] w-full transition-transform ease-mk group-hover:scale-[1.02]" />
              <p className="mt-2 text-caption font-semibold text-foreground">{g.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* For salons */}
      <section className="container-mk py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-sheet bg-card shadow-card md:grid-cols-2">
          <SafeImg src={IMAGES.interior} alt="فضای داخلی یک سالن ناخن؛ تصویر نمونه" className="aspect-[3/2] size-full" />
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <p className="flex items-center gap-2 text-caption font-semibold text-muted-foreground"><Dot /> برای سالن‌ها</p>
            <h2 className="text-h2">با کیفیت کارتان دیده شوید، نه با بودجه‌ی تبلیغات</h2>
            <p className="text-muted-foreground">پروفایل ساختاریافته با قیمت، نمونه‌کار و مدارک؛ و پنلی برای مدیریت نوبت‌ها و پاسخ به نظرها.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/salon/onboarding" className={btn()}>ثبت سالن</Link>
              <Link to="/for-salons" className={btn({ variant: "outline" })}>بیشتر بدانید</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-mk py-16">
        <SectionHead title="پرسش‌های رایج" action={<Link to="/help" className={btn({ variant: "ghost", size: "sm" })}>همه‌ی پرسش‌ها</Link>} />
        <Accordion type="single" collapsible className="rounded-card bg-card px-5 shadow-card">
          {FAQ.slice(0, 4).map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-start text-body font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-body text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
