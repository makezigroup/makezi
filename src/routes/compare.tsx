import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Button, Icon, StatePanel, StatusBadge, VerifyBadge, btn } from "@/components/mk/core";
import { OpenBadge, SafeImg } from "@/components/mk/marketplace";
import { ATTRIBUTES, CATEGORIES, areaName, priceFrom, priceTop, type Salon } from "@/lib/data";
import { DECISIONS } from "@/lib/decisions";
import { publicReviews, scoreOf } from "@/lib/rules";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";
import type { ReactNode } from "react";
import { canContactSalon } from "@/lib/cloud-data";

export const Route = createFileRoute("/compare")({
  head: () => seo("مقایسه‌ی سالن‌ها", `تا ${DECISIONS.compareMax} سالن را کنار هم مقایسه کنید: قیمت، امتیاز، خدمات، ویژگی‌ها و مدارک.`, { noindex: true }),
  component: Compare,
});

function Compare() {
  const { compare, toggleCompare, clearCompare, salons, reviews } = useApp();
  const fmt = useFmt();
  const list = compare.map((id) => salons.find((s) => s.id === id)).filter((s): s is Salon => !!s && s.published);
  const row = (label: string, cell: (s: Salon) => ReactNode) => (
    <tr className="border-t border-border">
      <th scope="row" className="sticky start-0 bg-background p-3 text-start text-caption font-semibold text-muted-foreground">{label}</th>
      {list.map((s) => <td key={s.id} className="min-w-48 p-3 align-top">{cell(s)}</td>)}
    </tr>
  );
  return (
    <SiteLayout>
      <PageIntro title="مقایسه‌ی سالن‌ها" body={`تا ${fmt.num(DECISIONS.compareMax)} سالن را کنار هم ببینید. ترتیب ستون‌ها همان ترتیب انتخاب شماست.`} />
      <div className="container-mk">
        {list.length === 0 ? (
          <StatePanel icon="sort" title="هنوز سالنی برای مقایسه انتخاب نکرده‌اید" body="روی «مقایسه» در کارت یا پروفایل سالن بزنید." action={<Link to="/salons" className={btn()}>کاوش سالن‌ها</Link>} />
        ) : (
          <>
            <div className="overflow-x-auto rounded-card bg-card shadow-card">
              <table className="w-full border-collapse text-body">
                <thead>
                  <tr>
                    <th className="sticky start-0 bg-background p-3" />
                    {list.map((s) => (
                      <th key={s.id} scope="col" className="p-3 text-start align-top">
                        <SafeImg src={s.image} alt="" className="mb-2 aspect-[4/3] w-full rounded-input" />
                        <Link to="/salons/$slug" params={{ slug: s.slug }} className="text-h3 text-foreground">{s.name}</Link>
                        <button className="mt-1 block text-caption text-muted-foreground" onClick={() => toggleCompare(s.id)}>حذف از مقایسه</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {row("محله", (s) => areaName(s.city, s.area))}
                  {row("وضعیت مدارک", (s) => s.isDemo ? <StatusBadge tone="neutral">اطلاعات نمونه</StatusBadge> : <VerifyBadge status={s.status} />)}
                  {row("امتیاز کلی", (s) => { const sc = scoreOf(publicReviews(reviews, s.id)); return sc.avg == null ? <span className="text-muted-foreground">نظر کافی نیست ({fmt.num(sc.count)})</span> : <span><b>{fmt.rating(sc.avg)}</b> از ۵ · {fmt.num(sc.count)} نظر</span>; })}
                  {DECISIONS.ratingDimensions.map((d, i) => row(d, (s) => { const sc = scoreOf(publicReviews(reviews, s.id)); return sc.count ? fmt.rating(sc.dims[i] ?? 0) : "—"; }))}
                  {row("بازه‌ی قیمت", (s) => priceFrom(s)>0 ? `${fmt.price(priceFrom(s))} تا ${fmt.price(priceTop(s))}` : "قیمت اعلام نشده")}
                  {row("خدمات", (s) => s.categories.map((c) => CATEGORIES.find((x) => x.id === c)?.label).join("، "))}
                  {row("ساعت کاری", (s) => <span className="flex flex-col gap-1">{s.hours}<OpenBadge salon={s} /></span>)}
                  {row("ویژگی‌ها", (s) => s.attributes.length ? s.attributes.map((a) => ATTRIBUTES.find((x) => x.id === a)?.label).join("، ") : "—")}
                  {row("نمونه‌کار", (s) => fmt.num(s.portfolio.length))}
                  {row("تماس", (s) => canContactSalon(s) ? <a href={`tel:${s.phone}`} className={btn({ variant: "outline", size: "sm" })}><Icon name="call" size={16} /> تماس</a> : "اطلاعات تماس موجود نیست")}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {list.length < DECISIONS.compareMax && <Link to="/salons" className={btn({ variant: "outline" })}>افزودن سالن</Link>}
              <Button variant="ghost" onClick={clearCompare}>پاک کردن مقایسه</Button>
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
