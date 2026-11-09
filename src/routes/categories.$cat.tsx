import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/mk/layout";
import { StatePanel, btn } from "@/components/mk/core";
import { Crumbs } from "@/components/mk/location-pages";
import { SalonCard } from "@/components/mk/marketplace";
import { CITIES, getCategory, priceFrom } from "@/lib/data";
import { useApp, useFmt, usePublicSalons } from "@/lib/app-store";
import { seo } from "@/lib/seo";
import { getProductData } from '@/lib/product.functions';
import { useState } from 'react';
import { FiltersPanel } from '@/components/mk/filters-panel';
import { filterSalons, type DirectorySearch } from '@/lib/filters';
import { ServiceCard } from '@/components/mk/service-discovery';

export const Route = createFileRoute("/categories/$cat")({
  loader: () => getProductData(),
  head: ({ params,loaderData }) => {
    const c = loaderData?.categories.find(v=>v.id===params.cat);
    return c ? seo(`سالن‌های ${c.label}`, `${c.description} سالن‌های ارائه‌دهنده را با قیمت اعلام‌شده و نظر کاربران مقایسه کنید.`, { path: `/categories/${c.id}`,noindex:c.is_demo }) : seo("دسته پیدا نشد", "این دسته پیدا نشد.", { noindex: true });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useParams();
  const product=Route.useLoaderData();
  const c = product.categories.find(v=>v.id===cat);
  const [filters,setFilters]=useState<DirectorySearch>({});
  const {reviews}=useApp();
  const fmt = useFmt();
  const list = filterSalons(usePublicSalons(),reviews,{...filters,cat});
  if (!c) return <SiteLayout><div className="container-mk py-16"><StatePanel title="این دسته پیدا نشد" action={<Link to="/categories" className={btn()}>همه‌ی دسته‌ها</Link>} /></div></SiteLayout>;
  const prices = list.flatMap((s) => s.services.filter((v) => v.category === c.id).map((v) => v.price));
  return (
    <SiteLayout>
      <div className="container-mk pt-8">
        <Crumbs items={[{ label: "دسته‌ها", link: <Link to="/categories" className="text-muted-foreground">دسته‌ها</Link> }, { label: c.label }]} />
        <h1 className="text-h1">سالن‌های {c.label}</h1>
        <p className="mt-2 max-w-2xl text-body-l text-muted-foreground">{c.description || getCategory(c.id)?.body}</p>
        {prices.length > 0 && <p className="mt-2 text-caption">بازه‌ی قیمت اعلام‌شده: {fmt.price(Math.min(...prices))} تا {fmt.price(Math.max(...prices))}</p>}
        <h2 className="mb-4 mt-8 text-h2">خدمات مرتبط</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{product.services.filter(v=>v.category_id===cat).map(v=><ServiceCard key={v.id} service={v}/>)}</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]"><aside><FiltersPanel s={filters} set={p=>setFilters(v=>({...v,...p}))}/></aside>
        <div className="mt-8">
          {list.length === 0 ? <StatePanel title={`هنوز سالنی برای ${c.label} منتشر نشده`} /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[...list].sort((a, b) => priceFrom(a) - priceFrom(b)).map((s) => <SalonCard key={s.id} salon={s} />)}</div>
          )}
        </div>
        </div>
      </div>
    </SiteLayout>
  );
}
