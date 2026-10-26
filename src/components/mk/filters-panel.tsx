import { AREAS, CATEGORIES } from "@/lib/data";
import type { DiscoverSearch } from "@/lib/filters";
import { useFmt } from "@/lib/app-store";
import { Chip, inputCls } from "./core";
import { Switch } from "@/components/ui/switch";

const PRICE_STEPS = [300000, 500000, 700000, 900000, 1200000];

export function FiltersPanel({ s, set }: { s: DiscoverSearch; set: (p: Partial<DiscoverSearch>) => void }) {
  const fmt = useFmt();
  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">دسته‌ی خدمت</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!s.cat} onClick={() => set({ cat: undefined })}>همه</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} icon={c.icon} active={s.cat === c.id} onClick={() => set({ cat: s.cat === c.id ? undefined : c.id })}>
              {c.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2 text-caption font-semibold">
        محله
        <select className={inputCls} value={s.area ?? ""} onChange={(e) => set({ area: e.target.value || undefined })}>
          <option value="">همه‌ی محله‌ها</option>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">حداکثر قیمت شروع</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!s.max} onClick={() => set({ max: undefined })}>بدون محدودیت</Chip>
          {PRICE_STEPS.map((p) => (
            <Chip key={p} active={s.max === p} onClick={() => set({ max: p })}>
              تا {fmt.num(p / 1000)} هزار
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-caption font-semibold">نوبت خالی</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!s.date} onClick={() => set({ date: undefined })}>هر زمان</Chip>
          <Chip icon="clock" active={s.date === "today"} onClick={() => set({ date: "today" })}>امروز</Chip>
          <Chip icon="calendar" active={s.date === "tomorrow"} onClick={() => set({ date: "tomorrow" })}>فردا</Chip>
        </div>
      </fieldset>
      <label className="flex min-h-11 items-center justify-between gap-3 rounded-input bg-muted px-3 text-caption font-semibold">
        فقط سالن‌های دارای مدارک تأییدشده
        <Switch checked={!!s.verified} onCheckedChange={(v) => set({ verified: v || undefined })} />
      </label>
    </div>
  );
}
