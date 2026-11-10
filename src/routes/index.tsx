import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Icon, SectionHead, StatePanel, btn, Dot, inputCls } from "@/components/mk/core";
import { HeroSearch } from "@/components/mk/hero-search";
import { ReviewCard, SalonCard, SafeImg } from "@/components/mk/marketplace";
import { CITIES, FAQ, IMAGES, galleryOf } from "@/lib/data";
import { useApp, usePublicSalons } from "@/lib/app-store";
import { seo } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getProductData } from '@/lib/product.functions';
import { ServiceCard } from '@/components/mk/service-discovery';
import { AppPromoSection } from '@/components/mk/app-promo';
import { useProduct } from '@/lib/product-context';

export const Route = createFileRoute("/")({
  loader: () => getProductData(),
  head: () => seo("انتخاب آگاهانه در زیبایی", "سالن‌های زیبایی را با خدمات، قیمت اعلام‌شده، نمونه‌کار و نظرهای بررسی‌شده پیدا و مقایسه کنید.", { path: "/" }),
  component: Home,
});

function Home() {
  const product = Route.useLoaderData();
  const config = product.content.find(c=>c.id==='homepage')?.data;
  const selected = config && typeof config==='object' && !Array.isArray(config) && Array.isArray(config['featured']) ? config['featured'] : [];
  const selectedServices = config && typeof config==='object' && !Array.isArray(config) && Array.isArray(config['services']) ? config['services'] : [];
  const { reviews } = useApp();
  const salons = usePublicSalons();
  const featured = selected.length ? salons.filter(s=>selected.includes(s.id)) : [...salons].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt)).slice(0, 4);
  const [selectedCity,setSelectedCity] = useState("tehran");
  const recent = [...salons].sort((a,b)=>b.addedAt.localeCompare(a.addedAt)).slice(0,4);
  const nearby = salons.filter(s=>s.city===selectedCity).slice(0,4);
  const gallery = galleryOf(salons).slice(0, 4);
  return (
    <SiteLayout>
      <section className="container-mk pb-14 pt-8 md:pt-12 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col gap-6">
            <h1 className="text-display">
              سالن‌های اطرافتان را یک‌جا <span className="text-pink-text">مقایسه</span> کنید<Dot className="ms-1" />
            </h1>
            <p className="max-w-xl text-body-l text-muted-foreground">
              خدمات و قیمت اعلام‌شده، نمونه‌کار، مدارک و نظرهای بررسی‌شده‌ی سالن‌ها را کنار هم ببینید؛ بعد مستقیم با سالن تماس بگیرید.
            </p>
          </div>
          <div className="grid grid-cols-[1.35fr_1fr] gap-3">
            <SafeImg src={IMAGES.heroNails} alt="ژلیش صورتی روی دست؛ تصویر نمونه" eager className="row-span-2 aspect-[4/5] h-full w-full rounded-card" />
            <Link to="/gallery" className="flex flex-col justify-between gap-3 rounded-card bg-primary p-5 text-primary-foreground no-underline">
              <span className="text-label">گالری مدل</span><span className="text-h3">مدلی را که پسندیدید پیدا کنید</span><span className="text-caption">دیدن گالری مدل</span>
            </Link>
            <SafeImg src={IMAGES.heroNails} alt="جزئیات نمونه‌کار ناخن؛ تصویر نمونه" className="aspect-square h-full w-full rounded-card" />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-5">
          <HeroSearch />
        </div>
      </section>

      <AppPromoSection />

      <section className="container-mk py-14">
        <SectionHead eyebrow={selected.length?'انتخاب کارکنان':'تازه بررسی‌شده'} title="چند سالن برای شروع" body={selected.length?'انتخاب تیم میکزی برای شروع بررسی.':'مرتب‌شده بر اساس تاریخ آخرین بررسی تیم میکزی.'} action={<Link to="/salons" className={btn({ variant: "outline", size: "sm" })}>همه‌ی سالن‌ها</Link>} />
        {featured.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((s) => <SalonCard key={s.id} salon={s} />)}</div> : <StatePanel icon="salon" title="هنوز سالنی منتشر نشده است" body="اطلاعات سالن‌ها پس از بررسی تیم میکزی اینجا منتشر می‌شود." action={<Link to="/for-salons" className={btn({ variant: "outline" })}>افزودن سالن به میکزی</Link>} />}
      </section>

      <section className="container-mk py-14"><SectionHead title="تازه‌اضافه‌شده" body="مرتب‌شده بر اساس تاریخ انتشار پروفایل."/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{recent.map(s=><SalonCard key={s.id} salon={s}/>)}</div></section>
      <section className="container-mk py-14"><SectionHead title="خدمات زیبایی" action={<Link to="/services" className={btn({variant:'outline'})}>همهٔ خدمات</Link>}/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{(selectedServices.length?product.services.filter(s=>selectedServices.includes(s.id)):product.services.slice(0,4)).map(s=><ServiceCard key={s.id} service={s}/>)}</div></section>
      <section className="container-mk py-14"><SectionHead title="سالن‌های شهر شما"/><label className="mb-6 flex max-w-xs flex-col gap-2 text-caption">شهر<select className={inputCls} value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>{CITIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{nearby.map(s=><SalonCard key={s.id} salon={s}/>)}</div></section>
      <section className="container-mk py-16">
        <SectionHead eyebrow="سه قدم" title="پیدا کنید، مقایسه کنید، تماس بگیرید" />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { i: "search" as const, t: "پیدا کنید", b: "بر اساس خدمت، محله، قیمت، امتیاز و ویژگی‌ها جست‌وجو کنید." },
            { i: "sort" as const, t: "مقایسه کنید", b: "تا سه سالن را کنار هم ببینید. معیار ترتیب نتایج همیشه نوشته می‌شود." },
            { i: "call" as const, t: "تماس بگیرید", b: "با خود سالن تماس بگیرید یا مسیر را در نقشه باز کنید." },
          ].map((s) => (
            <li key={s.t} className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-card">
              <span className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-full bg-pink-soft text-pink-text"><Icon name={s.i} /></span>
              </span>
              <h3 className="text-h3">{s.t}</h3>
              <p className="text-muted-foreground">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      {gallery.length > 0 && (
        <section className="container-mk py-16">
          <SectionHead eyebrow="نمونه‌کار" title="کار سالن‌ها را ببینید" body="هر تصویر به پروفایل سالن سازنده وصل است." action={<Link to="/gallery" className={btn({ variant: "outline", size: "sm" })}>همه‌ی نمونه‌کارها</Link>} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((g) => {
               const s = salons.find((x) => x.id === g.salonId);
               if (!s) return null;
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
        <div className="flex flex-col items-start gap-4 border-y border-border py-8 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="text-h2">سالن دارید؟</h2>
            <p className="mt-2 text-muted-foreground">درخواست ثبت بفرستید؛ تیم میکزی اطلاعات شما را بررسی و منتشر می‌کند.</p>
          </div>
          <Link to="/for-salons" className={btn({ variant: "ink", size: "lg" })}>درخواست ثبت سالن</Link>
        </div>
      </section>

      <section className="container-mk py-14">
        <SectionHead title="آخرین نظرهای بررسی‌شده" />
        {reviews.some(r=>r.status==='approved') ? <div className="grid gap-4 md:grid-cols-3">{reviews.filter((r) => r.status === "approved").slice(0, 3).map((r) => <ReviewCard key={r.id} r={r} showSalon />)}</div> : <p className="text-muted-foreground">هنوز نظری منتشر نشده است.</p>}
      </section>

      <section className="container-mk py-14">
        <SectionHead title="پرسش‌های رایج" action={<Link to="/help" className={btn({ variant: "outline", size: "sm" })}>همه‌ی پرسش‌ها</Link>} />
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
