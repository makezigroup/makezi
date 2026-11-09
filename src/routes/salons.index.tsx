import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Button, Icon, StatePanel, inputCls } from "@/components/mk/core";
import { SalonCard, useNow } from "@/components/mk/marketplace";
import { FiltersPanel } from "@/components/mk/filters-panel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { directorySearch, filterSalons, activeFilterCount, SORT_LABEL, type DirectorySearch, type SortKey } from "@/lib/filters";
import { useApp, useFmt } from "@/lib/app-store";
import { track } from "@/lib/analytics";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salons/")({
  validateSearch: directorySearch,
  head: () => seo("کاوش سالن‌های زیبایی", "سالن‌های زیبایی را بر اساس خدمت، محله، قیمت، امتیاز نظرها و ویژگی‌ها پیدا و مقایسه کنید.", { path: "/salons" }),
  component: Directory,
});

function Directory() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/salons/" });
  const fmt = useFmt();
  const { salons, reviews } = useApp();
  const now = useNow();
  const set = (p: Partial<DirectorySearch>) => {
    track("filter_applied", { keys: Object.keys(p).join(",") });
    nav({ search: (prev) => ({ ...prev, ...p }), replace: true });
  };
  const results = filterSalons(salons, reviews, now ? s : { ...s, open: undefined }, now ?? new Date());
  const [q, setQ] = useState(s.q ?? "");
  const count = activeFilterCount(s);
  const sort: SortKey = s.sort ?? "distance";
  useEffect(() => { track("search_results_viewed", { count: results.length }); }, [results.length]);

  return (
    <SiteLayout>
      <div className="container-mk pb-6 pt-8">
        <h1 className="text-h1">جست‌وجوی سالن</h1>
        <p className="mt-2 text-muted-foreground">همه‌ی اطلاعات را تیم میکزی ثبت و بررسی می‌کند. داده‌های این نسخه نمونه هستند.</p>
        <form
          role="search"
          className="mt-5 flex max-w-2xl gap-2"
          onSubmit={(e) => { e.preventDefault(); track("search_submitted", { source: "directory" }); set({ q: q.trim() || undefined }); }}
        >
          <label htmlFor="dq" className="sr-only">جست‌وجوی سالن، خدمت یا آدرس</label>
          <input id="dq" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="سالن، خدمت یا آدرس…" />
          <Button type="submit"><Icon name="search" size={20} /> <span className="hidden sm:inline">جست‌وجو</span></Button>
        </form>
      </div>
      <div className="container-mk grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="فیلترها">
          <div className="sticky top-20 rounded-sheet bg-card p-5 shadow-card">
            <FiltersPanel s={s} set={set} />
          </div>
        </aside>
        <section aria-live="polite">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden"><Icon name="filter" size={18} /> فیلترها{count > 0 && ` (${fmt.num(count)})`}</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-sheet" dir="rtl">
                <SheetHeader><SheetTitle>فیلترها</SheetTitle></SheetHeader>
                <div className="p-4"><FiltersPanel s={s} set={set} /></div>
              </SheetContent>
            </Sheet>
            <p className="flex-1 text-caption text-muted-foreground">{fmt.num(results.length)} سالن</p>
            <label className="flex items-center gap-2 text-caption">
              ترتیب:
              <select className={inputCls + " min-h-10 w-auto py-1"} value={sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
                {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => <option key={k} value={k}>{SORT_LABEL[k].label}</option>)}
              </select>
            </label>
            {count > 0 && <Button variant="ghost" size="sm" onClick={() => nav({ search: { q: s.q, sort: s.sort }, replace: true })}>پاک کردن فیلترها</Button>}
          </div>
          <p className="mb-5 flex items-center gap-2 rounded-input bg-muted px-3 py-2 text-caption"><Icon name="sort" size={16} /> ترتیب نتایج: {SORT_LABEL[sort].how} جایگاه نتایج فروخته نمی‌شود.</p>
          {results.length === 0 ? (
            <StatePanel title="سالنی با این فیلترها پیدا نشد" body="چند فیلتر را بردارید یا محله‌ی دیگری را امتحان کنید." action={<Button variant="outline" onClick={() => nav({ search: {}, replace: true })}>پاک کردن همه</Button>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((x) => <SalonCard key={x.id} salon={x} />)}</div>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
