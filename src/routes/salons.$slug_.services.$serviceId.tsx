import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/mk/layout";
import { DemoNote, Icon, StatePanel, btn } from "@/components/mk/core";
import { Crumbs } from "@/components/mk/location-pages";
import { RatingInline } from "@/components/mk/marketplace";
import { getCategory, getStaticSalon } from "@/lib/data";
import { useFmt, usePublicSalons, useSalon } from "@/lib/app-store";
import { canContactSalon, servicePriceLabel } from "@/lib/cloud-data";
import { seo } from "@/lib/seo";
import { getPublicSalon } from "@/lib/directory.functions";

export const Route = createFileRoute("/salons/$slug_/services/$serviceId")({
  loader: ({ params }) => getPublicSalon({ data: params.slug }),
  head: ({ params, loaderData }) => {
    const s = loaderData;
    const v = s?.services.find((x) => x.id === params.serviceId);
    return s && v
      ? seo(`${v.name} در ${s.name}`, `قیمت اعلام‌شده، زمان تقریبی و مقایسه‌ی ${v.name} در ${s.name} با سالن‌های دیگر.`, { path: `/salons/${s.slug}/services/${v.id}`, noindex: !!s.isDemo })
      : seo("خدمت پیدا نشد", "این خدمت پیدا نشد.", { noindex: true });
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug, serviceId } = Route.useParams();
  const salon = Route.useLoaderData();
  const all = usePublicSalons();
  const fmt = useFmt();
  const v = salon?.services.find((x) => x.id === serviceId);
  if (!salon || !v)
    return <SiteLayout><div className="container-mk py-16"><StatePanel icon="package" title="این خدمت پیدا نشد" action={<Link to="/salons" className={btn()}>کاوش سالن‌ها</Link>} /></div></SiteLayout>;
  const cat = getCategory(v.category);
  const others = all
    .filter((s) => s.id !== salon.id)
    .flatMap((s) => s.services.filter((x) => x.id === v.id).map((x) => ({ s, x })))
    .sort((a, b) => a.x.price - b.x.price)
    .slice(0, 6);
  return (
    <SiteLayout>
      <div className="container-mk max-w-4xl pt-8">
        <Crumbs items={[{ label: "سالن‌ها", link: <Link to="/salons" className="text-muted-foreground">سالن‌ها</Link> }, { label: salon.name, link: <Link to="/salons/$slug" params={{ slug: salon.slug }} className="text-muted-foreground">{salon.name}</Link> }, { label: v.name }]} />
        {salon.isDemo && <DemoNote className="mb-4">اطلاعات نمونه — خدمت و قیمت ساختگی برای آزمایش محصول.</DemoNote>}
        <h1 className="text-h1">{v.name}</h1>
        <p className="mt-2 text-muted-foreground">در <Link to="/salons/$slug" params={{ slug: salon.slug }}>{salon.name}</Link> · {cat?.label}</p>
        <dl className="mt-6 grid gap-4 rounded-card bg-card p-5 shadow-card sm:grid-cols-3">
          <div><dt className="text-caption text-muted-foreground">قیمت اعلام‌شده</dt><dd className="text-h3">{v.priceFrom && !v.priceMax && "از "}{servicePriceLabel(v.price,fmt.price)}{v.priceMax ? ` تا ${fmt.price(v.priceMax)}` : ""}</dd></div>
          <div><dt className="text-caption text-muted-foreground">زمان تقریبی</dt><dd className="text-h3">{fmt.duration(v.durationMin)}</dd></div>
          <div><dt className="text-caption text-muted-foreground">آخرین بررسی</dt><dd className="text-h3">{fmt.date(v.updated, { day: "numeric", month: "long" })}</dd></div>
        </dl>
        {v.note && <p className="mt-3 text-caption">{v.note}</p>}
        <p className="mt-3 text-label text-muted-foreground">قیمت نهایی را سالن تعیین می‌کند؛ پیش از مراجعه با سالن تماس بگیرید.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {canContactSalon(salon) && <a href={`tel:${salon.phone}`} className={btn()}><Icon name="call" size={20} /> تماس با سالن</a>}
          <Link to="/salons/$slug" params={{ slug: salon.slug }} className={btn({ variant: "outline" })}>پروفایل سالن</Link>
        </div>
        <section className="mt-12">
          <h2 className="mb-1 text-h2">{v.name} در سالن‌های دیگر</h2>
          <p className="mb-4 text-caption text-muted-foreground">مرتب‌شده بر اساس کمترین قیمت اعلام‌شده.</p>
          {others.length === 0 ? <StatePanel title="سالن دیگری این خدمت را ثبت نکرده" /> : (
            <ul className="divide-y divide-border rounded-card bg-card shadow-card">
              {others.map(({ s, x }) => (
                <li key={s.id + x.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <Link to="/salons/$slug/services/$serviceId" params={{ slug: s.slug, serviceId: x.id }} className="font-semibold text-foreground">{x.name}</Link>
                    <p className="text-caption text-muted-foreground">{s.name}</p>
                    <RatingInline salonId={s.id} />
                  </div>
                  <span className="font-semibold">{servicePriceLabel(x.price,fmt.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
