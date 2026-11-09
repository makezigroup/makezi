import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Icon } from "@/components/mk/core";
import { CATEGORIES } from "@/lib/data";
import { useFmt, usePublicSalons } from "@/lib/app-store";
import { seo } from "@/lib/seo";
import { useProduct } from '@/lib/product-context';

export const Route = createFileRoute("/categories/")({
  head: () => seo("دسته‌بندی خدمات زیبایی", "ناخن، مو، رنگ، میکاپ، مژه، ابرو، پوست و مراقبت؛ سالن‌های هر خدمت را ببینید و مقایسه کنید.", { path: "/categories" }),
  component: Categories,
});

function Categories() {
  const salons = usePublicSalons();
  const fmt = useFmt();
  const {categories}=useProduct();
  return (
    <SiteLayout>
      <PageIntro title="دسته‌بندی خدمات" body="خدمت مورد نظرتان را انتخاب کنید تا سالن‌هایی را ببینید که آن را ارائه می‌دهند." />
      <ul className="container-mk grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to="/categories/$cat" params={{ cat: c.id }} className="flex h-full flex-col gap-3 rounded-card bg-card p-5 text-foreground no-underline shadow-card transition-shadow ease-mk hover:shadow-modal">
              <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name={CATEGORIES.find(v=>v.id===c.id)?.icon ?? 'package'} /></span>
              <span className="text-h3">{c.label}</span>
              <span className="text-caption text-muted-foreground">{c.description || CATEGORIES.find(v=>v.id===c.id)?.body}</span>
              <span className="mt-auto text-caption font-semibold">{fmt.num(salons.filter((s) => s.services.some(v=>v.category===c.id)).length)} سالن</span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteLayout>
  );
}
