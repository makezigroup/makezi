import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Button, Icon, StatePanel, btn, inputCls } from "@/components/mk/core";
import { SalonCard } from "@/components/mk/marketplace";
import { FiltersPanel } from "@/components/mk/filters-panel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SALONS } from "@/lib/data";
import { discoverSearch, filterSalons, SORT_LABEL, type DiscoverSearch } from "@/lib/filters";
import { useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/discover")({
  validateSearch: discoverSearch,
  head: () => seo("جست‌وجوی سالن", "سالن‌های زیبایی را بر اساس خدمت، محله، قیمت، تأیید مدارک و زمان خالی فیلتر و مقایسه کنید."),
  component: Discover,
});

function Discover() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/discover" });
  const fmt = useFmt();
  const set = (p: Partial<DiscoverSearch>) => nav({ search: (prev) => ({ ...prev, ...p }), replace: true });
  const results = filterSalons(SALONS, s);
  const [q, setQ] = useState(s.q ?? "");
  const activeCount = [s.cat, s.area, s.date, s.verified, s.max].filter(Boolean).length;

  return (
    <SiteLayout>
      <div className="container-mk pt-8">
        <h1 className="text-h1">جست‌وجوی سالن</h1>
        <form
          role="search"
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: q || undefined });
          }}
        >
          <label htmlFor="dq" className="sr-only">نام خدمت یا سالن</label>
          <input id="dq" className={inputCls} placeholder="مثلاً ژلیش یا نام سالن" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button type="submit" aria-label="جست‌وجو"><Icon name="search" size={20} /><span className="hidden sm:inline">جست‌وجو</span></Button>
        </form>
      </div>
      <div className="container-mk mt-6 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <aside className="hidden lg:block" aria-label="فیلترها">
          <div className="sticky top-24 rounded-card bg-card p-5 shadow-card">
            <FiltersPanel s={s} set={set} />
          </div>
        </aside>
        <section aria-live="polite">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-caption text-muted-foreground">
              {fmt.num(results.length)} سالن · مرتب‌شده بر اساس {SORT_LABEL[s.sort ?? "distance"]}
            </p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <button className={btn({ variant: "outline", size: "sm" }) + " lg:hidden"}>
                    <Icon name="filter" size={18} /> فیلترها {activeCount > 0 && `(${fmt.num(activeCount)})`}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-sheet">
                  <SheetHeader><SheetTitle>فیلترها</SheetTitle></SheetHeader>
                  <div className="p-4"><FiltersPanel s={s} set={set} /></div>
                </SheetContent>
              </Sheet>
              <label className="flex items-center gap-2 text-caption">
                <Icon name="sort" size={18} />
                <span className="sr-only">مرتب‌سازی</span>
                <select className={inputCls + " min-h-10 py-0"} value={s.sort ?? "distance"} onChange={(e) => set({ sort: e.target.value as DiscoverSearch["sort"] })}>
                  {Object.entries(SORT_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <Link to="/map" search={s} className={btn({ variant: "ghost", size: "sm" })}><Icon name="map" size={18} /> نقشه</Link>
            </div>
          </div>
          {results.length === 0 ? (
            <StatePanel
              title="سالنی با این فیلترها پیدا نشد"
              body="محله یا بازه‌ی قیمت را تغییر دهید یا فیلترها را حذف کنید."
              action={<Button variant="outline" onClick={() => nav({ search: {} })}>حذف فیلترها</Button>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((x) => (
                <SalonCard key={x.id} salon={x} />
              ))}
            </div>
          )}
          <p className="mt-6 text-label text-muted-foreground">همه‌ی سالن‌ها، قیمت‌ها و نظرها در این نسخه نمونه هستند. سالن‌های تأییدنشده با برچسب مشخص نمایش داده می‌شوند (تصمیم باز VR-1).</p>
        </section>
      </div>
    </SiteLayout>
  );
}
