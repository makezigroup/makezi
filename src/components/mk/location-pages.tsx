import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteLayout } from "./layout";
import { Icon, SectionHead, StatePanel, btn } from "./core";
import { SalonCard } from "./marketplace";
import { CATEGORIES, getArea, getCity } from "@/lib/data";
import { usePublicSalons, useFmt } from "@/lib/app-store";

export function Crumbs({ items }: { items: { label: string; link?: ReactNode | undefined }[] }) {
  return (
    <nav aria-label="مسیر" className="mb-4 text-caption text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link to="/" className="text-muted-foreground">میکزی</Link></li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-1">
            <span aria-hidden>/</span>
            {it.link ?? <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CityPage({ city: citySlug }: { city: string }) {
  const city = getCity(citySlug)!;
  const fmt = useFmt();
  const list = usePublicSalons().filter((s) => s.city === city.slug);
  return (
    <SiteLayout>
      <div className="container-mk pt-8">
        <Crumbs items={[{ label: "سالن‌ها", link: <Link to="/salons" className="text-muted-foreground">سالن‌ها</Link> }, { label: city.name }]} />
        <h1 className="text-h1">سالن‌های زیبایی {city.name}</h1>
        <p className="mt-2 max-w-2xl text-body-l text-muted-foreground">{fmt.num(list.length)} سالن در {city.name} با فهرست خدمات، قیمت اعلام‌شده، نمونه‌کار و نظر کاربران. داده‌ها نمونه هستند.</p>
        <section className="mt-8">
          <h2 className="mb-3 text-h3">محله‌ها</h2>
          <ul className="flex flex-wrap gap-2">
            {city.areas.map((a) => {
              const n = list.filter((s) => s.area === a.slug).length;
              return (
                <li key={a.slug}>
                  <Link to="/salons/$slug/$area" params={{ slug: city.slug, area: a.slug }} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-caption font-semibold text-foreground no-underline hover:bg-muted">
                    <Icon name="location" size={16} /> {a.name} <span className="text-muted-foreground">({fmt.num(n)})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="mt-10">
          <SectionHead title={`همه‌ی سالن‌های ${city.name}`} action={<Link to="/salons" search={{ city: city.slug }} className={btn({ variant: "outline", size: "sm" })}>فیلتر و مرتب‌سازی</Link>} />
          {list.length === 0 ? <StatePanel title="هنوز سالنی در این شهر منتشر نشده" /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((s) => <SalonCard key={s.id} salon={s} />)}</div>}
        </section>
      </div>
    </SiteLayout>
  );
}

export function AreaPage({ city: citySlug, area: areaSlug }: { city: string; area: string }) {
  const city = getCity(citySlug);
  const area = getArea(citySlug, areaSlug);
  const list = usePublicSalons().filter((s) => s.city === citySlug && s.area === areaSlug);
  if (!city || !area)
    return (
      <SiteLayout>
        <div className="container-mk py-16"><StatePanel icon="location" title="این محله پیدا نشد" action={<Link to="/salons" className={btn()}>همه‌ی سالن‌ها</Link>} /></div>
      </SiteLayout>
    );
  const cats = CATEGORIES.filter((c) => list.some((s) => s.categories.includes(c.id)));
  return (
    <SiteLayout>
      <div className="container-mk pt-8">
        <Crumbs items={[{ label: "سالن‌ها", link: <Link to="/salons" className="text-muted-foreground">سالن‌ها</Link> }, { label: city.name, link: <Link to="/salons/$slug" params={{ slug: city.slug }} className="text-muted-foreground">{city.name}</Link> }, { label: area.name }]} />
        <h1 className="text-h1">سالن‌های زیبایی {area.name}، {city.name}</h1>
        <p className="mt-2 max-w-2xl text-body-l text-muted-foreground">خدمات، قیمت اعلام‌شده و نظرهای سالن‌های این محله را کنار هم ببینید.</p>
        {cats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {cats.map((c) => (
              <Link key={c.id} to="/salons" search={{ city: city.slug, area: area.slug, cat: c.id }} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 text-caption font-semibold text-foreground no-underline hover:bg-muted">
                <Icon name={c.icon} size={16} /> {c.label}
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8">
          {list.length === 0 ? <StatePanel icon="location" title="هنوز سالنی در این محله منتشر نشده" action={<Link to="/salons/$slug" params={{ slug: city.slug }} className={btn({ variant: "outline" })}>محله‌های دیگر</Link>} /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((s) => <SalonCard key={s.id} salon={s} />)}</div>}
        </div>
      </div>
    </SiteLayout>
  );
}
