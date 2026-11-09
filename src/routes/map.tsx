import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Icon, StatusBadge, VerifyBadge, btn, DemoNote, StatePanel } from "@/components/mk/core";
import { RatingInline, SafeImg } from "@/components/mk/marketplace";
import { priceFrom } from "@/lib/data";
import { directorySearch, filterSalons } from "@/lib/filters";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  validateSearch: directorySearch,
  head: () => seo("سالن‌ها روی نقشه", "سالن‌های زیبایی را روی نقشه ببینید و قیمت شروع اعلام‌شده را مقایسه کنید.", { path: "/map" }),
  component: MapPage,
});

function MapPage() {
  const s = Route.useSearch();
  const fmt = useFmt();
  const { salons, reviews } = useApp();
  const list = filterSalons(salons.filter((x) => x.published), reviews, { ...s, open: undefined });
  const [sel, setSel] = useState<string | null>(list[0]?.id ?? null);
  const cur = list.find((x) => x.id === sel);
  return (
    <SiteLayout footer={false}>
      <div className="container-mk py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-h1">نقشه‌ی سالن‌ها</h1>
          <Link to="/salons" search={s} className={btn({ variant: "outline", size: "sm" })}><Icon name="filter" size={18} /> فهرست و فیلترها</Link>
        </div>
        <DemoNote className="mb-4">نقشه‌ی واقعی هنوز متصل نیست؛ این نمای ساده موقعیت نسبی سالن‌های نمونه را نشان می‌دهد.</DemoNote>
        {list.length === 0 ? <StatePanel icon="map" title="سالنی در این محدوده نیست" body="فیلترها را تغییر دهید." /> : (
          <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
            <ul className="order-2 flex max-h-[70vh] flex-col gap-2 overflow-y-auto lg:order-1">
              {list.map((x) => (
                <li key={x.id}>
                  <button onClick={() => setSel(x.id)} className={cn("flex w-full items-center gap-3 rounded-card bg-card p-3 text-start shadow-card", sel === x.id && "ring-2 ring-foreground")}>
                    <SafeImg src={x.image} alt="" className="size-16 rounded-sm" />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-semibold">{x.name}</span>
                      <span className="text-caption text-muted-foreground">از {fmt.price(priceFrom(x))}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-card bg-muted pattern-medium lg:order-2 lg:aspect-auto lg:min-h-[70vh]" role="region" aria-label="نقشه">
              <div className="absolute inset-0 bg-background/80" aria-hidden />
              {list.map((x) => (
                <button key={x.id} onClick={() => setSel(x.id)} style={{ insetInlineStart: `${x.map.x}%`, top: `${x.map.y}%` }}
                  className={cn("absolute -translate-y-1/2 rounded-full px-3 py-1.5 text-caption font-semibold shadow-card transition-colors ease-mk", sel === x.id ? "z-10 bg-ink text-ink-foreground" : "bg-lime text-brand-ink")}
                  aria-label={`${x.name}، از ${fmt.price(priceFrom(x))}`}>
                  {fmt.num(priceFrom(x) / 1000)} هزار
                </button>
              ))}
              {cur && (
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-card bg-card p-3 shadow-modal md:inset-x-auto md:end-3 md:w-96">
                  <SafeImg src={cur.image} alt="" className="size-20 rounded-sm" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-semibold">{cur.name}</span>
                    {cur.isDemo ? <StatusBadge tone="neutral">اطلاعات نمونه</StatusBadge> : <VerifyBadge status={cur.status} className="self-start" />}
                    <RatingInline salonId={cur.id} />
                  </div>
                  <Link to="/salons/$slug" params={{ slug: cur.slug }} className={btn({ size: "sm" })}>پروفایل</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
