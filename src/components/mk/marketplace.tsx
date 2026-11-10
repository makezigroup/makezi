import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Icon, VerifyBadge, StatusBadge, Dot, btn } from "./core";
import { useApp, useFmt, useScore } from "@/lib/app-store";
import { DECISIONS } from "@/lib/decisions";
import { IMAGES, areaName, isOpenAt, priceFrom, reviewOverall, type ImageKey, type Review, type Salon } from "@/lib/data";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const imgSrc = (k: ImageKey | string) => (k in IMAGES ? IMAGES[k as ImageKey] : k);

export function SafeImg({ src, alt, className, eager }: { src: string; alt: string; className?: string | undefined; eager?: boolean | undefined }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className={cn("grid place-items-center bg-placeholder text-caption text-muted-foreground", className)} role="img" aria-label={alt}>
        تصویر بارگذاری نشد
      </div>
    );
  return <img src={imgSrc(src)} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setErr(true)} className={cn("object-cover", className)} />;
}

/** Open-now is computed after hydration only (server time ≠ visitor time). */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  return now;
}

export function OpenBadge({ salon }: { salon: Salon }) {
  const now = useNow();
  if (!now || salon.isDemo) return null;
  return isOpenAt(salon, now) ? (
    <span className="inline-flex items-center gap-1.5 text-caption"><Dot className="size-2" /> اکنون باز است</span>
  ) : (
    <span className="text-caption text-muted-foreground">اکنون بسته است</span>
  );
}

export function RatingInline({ salonId }: { salonId: string }) {
  const fmt = useFmt();
  const s = useScore(salonId);
  if (s.count === 0) return <span className="text-caption text-muted-foreground">هنوز نظری منتشر نشده</span>;
  if (s.avg == null)
    return <span className="text-caption text-muted-foreground">{fmt.num(s.count)} نظر · برای امتیاز کافی نیست</span>;
  return (
    <span className="inline-flex items-center gap-1 text-caption">
      <Icon name="rating" size={16} className="text-pink" />
      <span className="font-semibold">{fmt.rating(s.avg)}</span>
      <span className="text-muted-foreground">از {fmt.digits(5)} · {fmt.num(s.count)} نظر</span>
    </span>
  );
}

export function SaveButton({ id, className, label }: { id: string; className?: string | undefined; label?: boolean | undefined }) {
  const { saved, toggleSaved } = useApp();
  const on = saved.includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleSaved(id)}
      aria-pressed={on}
      aria-label={on ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={cn(label ? btn({ variant: "outline", size: "lg" }) : "grid size-11 place-items-center rounded-full bg-surface text-foreground shadow-card", on && "bg-pink-soft text-pink-text", className)}
    >
      <Icon name="save" size={20} />
      {label && (on ? "در علاقه‌مندی‌ها" : "علاقه‌مندی")}
    </button>
  );
}

export function CompareToggle({ id, size = "sm" }: { id: string; size?: "sm" | "lg" }) {
  const { compare, toggleCompare } = useApp();
  const on = compare.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        if (!toggleCompare(id)) toast.error(`حداکثر ${DECISIONS.compareMax === 3 ? "سه" : DECISIONS.compareMax} سالن را می‌توانید مقایسه کنید.`);
      }}
      className={cn(btn({ variant: on ? "pink" : "outline", size }), "relative z-[1]")}
    >
      <Icon name="sort" size={18} /> {on ? "در مقایسه" : "مقایسه"}
    </button>
  );
}

export function SalonCard({ salon, compact }: { salon: Salon; compact?: boolean | undefined }) {
  const fmt = useFmt();
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card bg-card shadow-card transition-shadow ease-mk hover:shadow-modal">
      <div className={cn("relative overflow-hidden", compact ? "aspect-[4/3]" : "aspect-[4/5] max-sm:aspect-[4/3]")}>
        <SafeImg src={salon.image} alt={`تصویر ${salon.name}`} className="size-full transition-transform ease-mk group-hover:scale-[1.02]" />
        {salon.services.length > 0 && (
          <span className="absolute bottom-3 start-3 rounded-full bg-surface px-3 py-1 text-caption font-semibold text-foreground shadow-card">
            {priceFrom(salon)>0 ? `از ${fmt.price(priceFrom(salon))}` : "قیمت اعلام نشده"}
          </span>
        )}
        <SaveButton id={salon.id} className="absolute end-3 top-3 z-[1]" />
        {salon.isDemo && <span className="absolute start-3 top-3 rounded-full bg-surface px-3 py-1 text-label text-foreground">اطلاعات نمونه</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-h3 leading-snug">
          <Link to="/salons/$slug" params={{ slug: salon.slug }} onClick={()=>track("search_result_clicked",{salon:salon.id})} className="text-foreground no-underline after:absolute after:inset-0">
            {salon.name}
          </Link>
        </h3>
        {salon.isDemo ? <StatusBadge tone="neutral">اطلاعات نمونه</StatusBadge> : <VerifyBadge status={salon.status} className="self-start" />}
        <RatingInline salonId={salon.id} />
        <p className="flex items-center gap-1 text-caption text-muted-foreground">
          <Icon name="location" size={16} /> {areaName(salon.city, salon.area)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <OpenBadge salon={salon} />
          <CompareToggle id={salon.id} />
        </div>
      </div>
    </article>
  );
}

export function RatingSummary({ salonId }: { salonId: string }) {
  const fmt = useFmt();
  const s = useScore(salonId);
  return (
    <div className="grid gap-6 rounded-card bg-card p-5 shadow-card md:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-start gap-1 md:min-w-48">
        {s.avg != null ? (
          <>
            <span className="font-mono text-display leading-none">{fmt.rating(s.avg)}</span>
            <span className="text-caption text-muted-foreground">از {fmt.digits(5)}، میانگین {fmt.num(s.count)} نظر منتشرشده</span>
          </>
        ) : (
          <p className="max-w-56 text-caption text-muted-foreground">
            {s.count === 0 ? "هنوز نظری منتشر نشده است." : `${fmt.num(s.count)} نظر منتشر شده؛ امتیاز کلی از ${fmt.num(DECISIONS.minReviewsForScore)} نظر به بعد نمایش داده می‌شود.`}
          </p>
        )}
        {s.verifiedCount > 0 && <span className="mt-2 text-label text-muted-foreground">{fmt.num(s.verifiedCount)} مورد با مراجعه‌ی تأییدشده</span>}
      </div>
      {s.count > 0 && (
        <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-8">
          {DECISIONS.ratingDimensions.map((d, i) => (
            <li key={d} className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3 text-caption">
              <span>{d}</span>
              <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="block h-full rounded-full bg-pink" style={{ width: `${((s.dims[i] ?? 0) / 5) * 100}%` }} />
              </span>
              <span className="font-semibold">{fmt.rating(s.dims[i] ?? 0)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReviewKindBadge({ r }: { r: Review }) {
  if (r.isDemo) return <StatusBadge tone="neutral">اطلاعات نمونه — نظر ساختگی</StatusBadge>;
  return r.kind === "verified-visit" ? (
    <StatusBadge tone="success">مراجعه‌ی تأییدشده</StatusBadge>
  ) : (
    <StatusBadge tone="neutral">نظر کاربر</StatusBadge>
  );
}

const REPORT_REASONS = ["محتوای توهین‌آمیز", "تبلیغ یا هرزنامه", "اطلاعات شخصی", "محتوای نامرتبط", "احتمال نظر جعلی"];

export function ReviewCard({ r, report = true, showSalon = false }: { r: Review; report?: boolean | undefined; showSalon?: boolean | undefined }) {
  const fmt = useFmt();
  const { reportReview, salons } = useApp();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const salon = showSalon ? salons.find((s) => s.id === r.salonId) : undefined;
  return (
    <article className="flex flex-col gap-3 rounded-card bg-card p-5 shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{r.author}</p>
          <p className="text-caption text-muted-foreground">{r.service} · {fmt.date(r.date, { day: "numeric", month: "long", year: "numeric" })}</p>
          {salon && (
            <Link to="/salons/$slug" params={{ slug: salon.slug }} className="text-caption font-semibold text-pink-text underline underline-offset-4">
              درباره‌ی {salon.name}
            </Link>
          )}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-pink-soft px-2.5 py-0.5 text-caption text-pink-text">
          <Icon name="rating" size={14} /> {fmt.rating(reviewOverall(r))}
        </span>
      </header>
      <ReviewKindBadge r={r} />
      {r.title && <h3 className="text-caption font-semibold">{r.title}</h3>}
      <p>{r.text}</p>
      {r.reply && (
        <div className="rounded-input border-s-2 border-foreground bg-muted px-3 py-2 text-caption">
          <span className="font-semibold">پاسخ سالن: </span>
          {r.reply}
        </div>
      )}
      {report && (
        <div className="flex flex-wrap items-center gap-2">
          {done ? (
            <span className="text-label text-muted-foreground">گزارش شما برای بررسی ثبت شد.</span>
          ) : open ? (
            <>
              {REPORT_REASONS.map((x) => (
                <button key={x} type="button" className="min-h-9 rounded-full border border-border-strong px-3 text-label hover:bg-muted" onClick={async () => { try { await reportReview(r.id, x); setDone(true); } catch { toast.error("برای گزارش نظر وارد حساب شوید."); } }}>{x}</button>
              ))}
              <button type="button" className="text-label underline" onClick={() => setOpen(false)}>انصراف</button>
            </>
          ) : (
            <button type="button" className="min-h-9 text-label text-muted-foreground underline" onClick={() => setOpen(true)}>گزارش این نظر</button>
          )}
        </div>
      )}
    </article>
  );
}

export function StarsInput({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number) => void }) {
  const fmt = useFmt();
  return (
    <fieldset className="flex flex-wrap items-center justify-between gap-2">
      <legend className="sr-only">{label}</legend>
      <span className="text-caption font-semibold" aria-hidden>{label}</span>
      <span className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${label}: ${n} از ۵`}
            aria-pressed={value === n}
            onClick={() => onChange(n)}
            className={cn("grid size-10 place-items-center rounded-full border text-caption font-semibold", value != null && n <= value ? "border-pink-border bg-pink-soft text-pink-text" : "border-border-strong bg-surface")}
          >
            {fmt.digits(n)}
          </button>
        ))}
      </span>
    </fieldset>
  );
}

export function CompareBar() {
  const { compare, salons, toggleCompare, clearCompare } = useApp();
  const fmt = useFmt();
  const pathname = useLocation({ select: (location) => location.pathname });
  if (compare.length === 0 || pathname.replace(/\/$/, "") === "/compare") return null;
  const items = compare.map((id) => salons.find((s) => s.id === id)).filter(Boolean) as Salon[];
  return (
    <div className="fixed inset-x-0 bottom-4 z-20 px-3">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 rounded-card bg-inverse p-3 text-inverse-foreground shadow-modal">
        <span className="text-caption font-semibold">مقایسه ({fmt.num(items.length)} از {fmt.num(DECISIONS.compareMax)})</span>
        <ul className="flex flex-1 flex-wrap gap-1">
          {items.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => toggleCompare(s.id)} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-current/25 px-3 text-label" aria-label={`حذف ${s.name} از مقایسه`}>
                {s.name} ×
              </button>
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" className="text-inverse-foreground" onClick={clearCompare}>پاک کردن</Button>
        <Link to="/compare" className={btn({ size: "sm" })}>دیدن مقایسه</Link>
      </div>
    </div>
  );
}
