import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/mk/layout";
import { StatePanel, btn } from "@/components/mk/core";
import { Crumbs } from "@/components/mk/location-pages";
import { SalonCard } from "@/components/mk/marketplace";
import { CITIES, getCategory, priceFrom } from "@/lib/data";
import { useFmt, usePublicSalons } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/categories/$cat")({
  head: ({ params }) => {
    const c = getCategory(params.cat);
    return c ? seo(`سالن‌های ${c.label}`, `${c.body} سالن‌های ارائه‌دهنده را با قیمت اعلام‌شده و نظر کاربران مقایسه کنید.`, { path: `/categories/${c.id}` }) : seo("دسته پیدا نشد", "این دسته پیدا نشد.", { noindex: true });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useParams();
  const c = getCategory(cat);
  const fmt = useFmt();
  const list = usePublicSalons().filter((s) => c && s.categories.includes(c.id));
  if (!c) return <SiteLayout><div className="container-mk py-16"><StatePanel title="این دسته پیدا نشد" action={<Link to="/categories" className={btn()}>همه‌ی دسته‌ها</Link>} /></div></SiteLayout>;
  const prices = list.flatMap((s) => s.services.filter((v) => v.category === c.id).map((v) => v.price));
  return (
    <SiteLayout>
      <div className="container-mk pt-8">
        <Crumbs items={[{ label: "دسته‌ها", link: <Link to="/categories" className="text-muted-foreground">دسته‌ها</Link> }, { label: c.label }]} />
        <h1 className="text-h1">سالن‌های {c.label}</h1>
        <p className="mt-2 max-w-2xl text-body-l text-muted-foreground">{c.body}</p>
        {prices.length > 0 && <p className="mt-2 text-caption">بازه‌ی قیمت اعلام‌شده: {fmt.price(Math.min(...prices))} تا {fmt.price(Math.max(...prices))}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {CITIES.map((ct) => <Link key={ct.slug} to="/salons" search={{ city: ct.slug, cat: c.id }} className={btn({ variant: "outline", size: "sm" })}>{c.label} در {ct.name}</Link>)}
        </div>
        <div className="mt-8">
          {list.length === 0 ? <StatePanel title={`هنوز سالنی برای ${c.label} منتشر نشده`} /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[...list].sort((a, b) => priceFrom(a) - priceFrom(b)).map((s) => <SalonCard key={s.id} salon={s} />)}</div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
