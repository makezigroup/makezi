import { ATTRIBUTES, CATEGORIES, CITIES } from "@/lib/data";
import type { DirectorySearch } from "@/lib/filters";
import { useFmt, usePublicSalons } from "@/lib/app-store";
import { Chip, inputCls } from "./core";
import { Switch } from "@/components/ui/switch";
import { useProduct } from '@/lib/product-context';

const PRICE_STEPS = [300000, 500000, 700000, 1000000, 1500000];
const RATING_STEPS = [3, 4, 4.5];

export function FiltersPanel({ s, set, hideLocation }: { s: DirectorySearch; set: (p: Partial<DirectorySearch>) => void; hideLocation?: boolean | undefined }) {
  const fmt = useFmt();
  const {categories,locations}=useProduct();
  const services = [...new Set(usePublicSalons().flatMap(x=>x.services.map(v=>v.name)))];
  const city = CITIES.find((c) => c.slug === (s.city ?? "tehran"));
  const toggle = (label: string, key: "verified" | "open" | "reviewed" | "portfolio") => (
    <label className="flex min-h-11 items-center justify-between gap-3 rounded-input bg-muted px-3 text-caption font-semibold">
      {label}
      <Switch checked={!!s[key]} onCheckedChange={(v) => set({ [key]: v || undefined })} />
    </label>
  );
  return (
    <div className="flex flex-col gap-6">
      {!hideLocation && (
        <div className="grid gap-3">
          <label className="flex flex-col gap-2 text-caption font-semibold">
            شهر
            <select className={inputCls} value={s.city ?? ""} onChange={(e) => set({ city: e.target.value || undefined, area: undefined })}>
              <option value="">همه‌ی شهرها</option>
              {locations.filter(l=>!l.area).map((c) => <option key={c.id} value={c.city}>{c.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-caption font-semibold">
            محله
            <select className={inputCls} value={s.area ?? ""} onChange={(e) => set({ area: e.target.value || undefined, city: e.target.value ? (s.city ?? "tehran") : s.city })}>
              <option value="">همه‌ی محله‌ها</option>
              {locations.filter(l=>l.area&&l.city===(s.city??'tehran')).map((a) => <option key={a.id} value={a.area}>{a.label}</option>)}
            </select>
          </label>
        </div>
      )}
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">خدمت</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!s.cat} onClick={() => set({ cat: undefined })}>همه</Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={s.cat === c.id} onClick={() => set({ cat: s.cat === c.id ? undefined : c.id })}>{c.label}</Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">حداکثر قیمت شروع</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!s.max} onClick={() => set({ max: undefined })}>بدون محدودیت</Chip>
          {PRICE_STEPS.map((p) => (
            <Chip key={p} active={s.max === p} onClick={() => set({ max: p })}>تا {fmt.num(p / 1000)} هزار</Chip>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2 text-caption font-semibold">خدمت مشخص<select className={inputCls} value={s.service ?? ''} onChange={e=>set({service:e.target.value || undefined})}><option value="">همه‌ی خدمات</option>{services.map(v=><option key={v}>{v}</option>)}</select></label>
      <label className="flex flex-col gap-2 text-caption font-semibold">حداقل قیمت شروع<input className={inputCls} type="number" min={0} value={s.min ?? ''} onChange={e=>set({min:e.target.value ? Number(e.target.value) : undefined})}/></label>
      <label className="flex flex-col gap-2 text-caption font-semibold">حداقل تعداد نظر<input className={inputCls} type="number" min={0} value={s.minReviews ?? ''} onChange={e=>set({minReviews:e.target.value ? Number(e.target.value) : undefined})}/></label>
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">حداقل امتیاز</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!s.rating} onClick={() => set({ rating: undefined })}>همه</Chip>
          {RATING_STEPS.map((r) => (
            <Chip key={r} icon="rating" active={s.rating === r} onClick={() => set({ rating: r })}>{fmt.rating(r)}+</Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">ویژگی‌ها</legend>
        <div className="flex flex-wrap gap-2">
          {ATTRIBUTES.map((a) => {
            const on = !!s.attrs?.includes(a.id);
            return (
              <Chip key={a.id} active={on} onClick={() => { const next = on ? (s.attrs ?? []).filter((x) => x !== a.id) : [...(s.attrs ?? []), a.id]; set({ attrs: next.length ? next : undefined }); }}>{a.label}</Chip>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-2">
        {toggle("اکنون باز است", "open")}
        {toggle("فقط سالن‌های دارای مدارک تأییدشده", "verified")}
        {toggle("دارای نظر منتشرشده", "reviewed")}
        {toggle("دارای نمونه‌کار", "portfolio")}
      </div>
    </div>
  );
}
