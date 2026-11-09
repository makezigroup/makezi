import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Icon, SectionHead, btn, Dot, inputCls } from "@/components/mk/core";
import { SalonCard, SafeImg } from "@/components/mk/marketplace";
import { CATEGORIES, CITIES, FAQ, IMAGES, galleryOf } from "@/lib/data";
import { usePublicSalons } from "@/lib/app-store";
import { track } from "@/lib/analytics";
import { seo } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => seo("انتخاب آگاهانه در زیبایی", "سالن‌های زیبایی را با خدمات، قیمت اعلام‌شده، نمونه‌کار و نظرهای بررسی‌شده پیدا و مقایسه کنید.", { path: "/" }),
  component: Home,
});

function HeroSearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [area, setArea] = useState("");
  const city = CITIES[0]!;
  return (
    <form
      role="search"
      aria-label="جست‌وجوی سالن"
      onSubmit={(e) => {
        e.preventDefault();
        track("search_submitted", { source: "home" });
        const c = CATEGORIES.find((x) => x.id === cat);
        nav({ to: "/salons", search: { q: q.trim() || undefined, cat: c?.id, city: area ? city.slug : undefined, area: area || undefined } });
      }}
      className="grid gap-3 rounded-card bg-card p-4 shadow-modal sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto]"
    >
      <label className="flex flex-col gap-1 text-caption font-semibold sm:col-span-2 lg:col-span-1">
        نام سالن یا خدمت
        <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="مثلاً کاشت ناخن" />
      </label>
      <label className="flex flex-col gap-1 text-caption font-semibold">
        خدمت
        <select className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">همه‌ی خدمات</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-caption font-semibold">
        محله ({city.name})
        <select className={inputCls} value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">همه‌ی محله‌ها</option>
          {city.areas.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
        </select>
      </label>
      <button type="submit" className={cn(btn({ size: "md" }), "self-end sm:col-span-2 lg:col-span-1")}>
        <Icon name="search" size={20} /> جست‌وجو
      </button>
    </form>
  );
}

function Home() {
  const salons = usePublicSalons();
  const featured = [...salons].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt)).slice(0, 4);
  const gallery = galleryOf(salons).slice(0, 4);
  return (
    <SiteLayout>
      <section className="container-mk grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2 text-caption font-semibold text-muted-foreground"><Dot /> انتخاب آگاهانه در زیبایی</p>
          <h1 className="text-display">
            سالن را با <span className="bg-lime px-2 text-brand-ink [box-decoration-break:clone]">اطلاعات روشن</span> پیدا و مقایسه کنید
          </h1>
          <p className="max-w-xl text-body-l text-muted-foreground">
            خدمات و قیمت اعلام‌شده، نمونه‌کار، مدارک و نظرهای بررسی‌شده‌ی سالن‌ها را کنار هم ببینید؛ بعد مستقیم با سالن تماس بگیرید.
          </p>
          <HeroSearch />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to="/categories/$cat" params={{ cat: c.id }} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-caption font-semibold text-foreground no-underline hover:bg-muted">
                <Icon name={c.icon} size={18} /> {c.label}
              </Link>
            ))}
          </div>
        </div>
        <SafeImg src={IMAGES.heroNails} alt="ژلیش صورتی روی دست؛ تصویر نمونه" eager className="aspect-[4/5] w-full rounded-sheet lg:aspect-[4/4.6]" />
      </section>

      <section className="container-mk py-16">
        <SectionHead eyebrow="سه قدم" title="پیدا کنید، مقایسه کنید، تماس بگیرید" />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { i: "search" as const, t: "پیدا کنید", b: "بر اساس خدمت، محله، قیمت، امتیاز و ویژگی‌ها جست‌وجو کنید." },
            { i: "sort" as const, t: "مقایسه کنید", b: "تا سه سالن را کنار هم ببینید. معیار ترتیب نتایج همیشه نوشته می‌شود." },
            { i: "call" as const, t: "تماس بگیرید", b: "با خود سالن تماس بگیرید یا مسیر را در نقشه باز کنید." },
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

      <section className="container-mk py-16">
        <SectionHead eyebrow="تازه بررسی‌شده" title="چند سالن برای شروع" body="مرتب‌شده بر اساس تاریخ آخرین بررسی تیم میکزی. داده‌های این نسخه نمونه‌اند." action={<Link to="/salons" className={btn({ variant: "outline", size: "sm" })}>همه‌ی سالن‌ها</Link>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((s) => <SalonCard key={s.id} salon={s} />)}</div>
      </section>

      <section className="bg-inverse py-20 text-inverse-foreground">
        <div className="container-mk">
          <h2 className="text-h2">به‌جای ادعا، شواهد</h2>
          <p className="mt-2 max-w-2xl text-body-l opacity-80">هر چه نمایش می‌دهیم، منبع و تاریخ دارد.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { i: "payment" as const, t: "قیمت با تاریخ", b: "قیمت هر خدمت با تاریخ آخرین بررسی تیم میکزی نمایش داده می‌شود." },
              { i: "verified" as const, t: "مدارک بررسی‌شده", b: "برچسب «تأییدشده» درباره‌ی مدارک است، نه تضمین کیفیت." },
              { i: "review" as const, t: "نظرهای بررسی‌شده", b: "هر نظر پیش از انتشار بررسی می‌شود؛ نظرهای دارای مدرک مراجعه جدا برچسب می‌خورند." },
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

      {gallery.length > 0 && (
        <section className="container-mk py-16">
          <SectionHead eyebrow="نمونه‌کار" title="کار سالن‌ها را ببینید" body="هر تصویر به پروفایل سالن سازنده وصل است." action={<Link to="/gallery" className={btn({ variant: "outline", size: "sm" })}>همه‌ی نمونه‌کارها</Link>} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((g) => {
              const s = salons.find((x) => x.id === g.salonId)!;
              return (
                <Link key={g.salonId + g.id} to="/salons/$slug" params={{ slug: s.slug }} className="group block overflow-hidden rounded-card no-underline">
                  <SafeImg src={g.image} alt={`${g.title} — ${s.name}`} className="aspect-[4/5] w-full transition-transform ease-mk group-hover:scale-[1.02]" />
                  <p className="mt-2 text-caption font-semibold text-foreground">{g.title}</p>
                  <p className="text-label text-muted-foreground">{s.name}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="container-mk py-16">
        <div className="flex flex-col items-start gap-4 rounded-sheet bg-muted p-8 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="text-h2">سالن دارید؟</h2>
            <p className="mt-2 text-muted-foreground">درخواست ثبت بفرستید؛ تیم میکزی اطلاعات شما را بررسی و منتشر می‌کند.</p>
          </div>
          <Link to="/for-salons" className={btn({ variant: "ink", size: "lg" })}>درخواست ثبت سالن</Link>
        </div>
      </section>

      <section className="container-mk max-w-3xl py-16">
        <SectionHead title="پرسش‌های رایج" />
        <Accordion type="single" collapsible>
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={String(i)}>
              <AccordionTrigger className="text-start text-body font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-body text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
