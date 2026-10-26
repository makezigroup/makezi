import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Icon, VerifyBadge, Dot } from "./core";
import { useApp, useFmt } from "@/lib/app-store";
import { DECISIONS } from "@/lib/decisions";
import { avgRating, dimAverages, openSlotsToday, priceFrom, type Review, type Salon } from "@/lib/data";
import { isoDay } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SafeImg({ src, alt, className, eager }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className={cn("grid place-items-center bg-placeholder text-caption text-muted-foreground", className)} role="img" aria-label={alt}>
        تصویر بارگذاری نشد
      </div>
    );
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setErr(true)} className={cn("object-cover", className)} />;
}

export function RatingInline({ salon }: { salon: Salon }) {
  const fmt = useFmt();
  const n = salon.reviews.length;
  if (n === 0) return <span className="text-caption text-muted-foreground">این سالن هنوز نظری ندارد</span>;
  if (n < DECISIONS.minReviewsForScore)
    return (
      <span className="text-caption text-muted-foreground">
        {fmt.num(n)} نظر تأییدشده · نظرها برای امتیاز کافی نیست
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-caption">
      <Icon name="rating" size={16} />
      <span className="font-semibold">{fmt.rating(avgRating(salon))}</span>
      <span className="text-muted-foreground">از {fmt.digits(5)} · {fmt.num(n)} نظر تأییدشده</span>
    </span>
  );
}

export function SalonCard({ salon, compact }: { salon: Salon; compact?: boolean }) {
  const fmt = useFmt();
  const { saved, toggleSaved } = useApp();
  const slots = openSlotsToday(salon, isoDay(0));
  const isSaved = saved.includes(salon.id);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card bg-card shadow-card transition-shadow ease-mk hover:shadow-modal">
      <div className={cn("relative overflow-hidden", compact ? "aspect-[4/3]" : "aspect-[4/5]")}>
        <SafeImg src={salon.image} alt={`نمونه‌کار ${salon.name}`} className="size-full" />
        <span className="absolute bottom-3 start-3 rounded-full bg-lime px-3 py-1 text-caption font-semibold text-brand-ink">
          از {fmt.price(priceFrom(salon))}
        </span>
        <button
          type="button"
          onClick={() => toggleSaved(salon.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "حذف از ذخیره‌شده‌ها" : "ذخیره‌ی سالن"}
          className={cn("absolute end-3 top-3 grid size-11 place-items-center rounded-full bg-surface text-foreground shadow-card", isSaved && "bg-ink text-ink-foreground")}
        >
          <Icon name="save" size={20} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-h3 leading-snug">
            <Link to="/salons/$slug" params={{ slug: salon.slug }} className="text-foreground no-underline after:absolute after:inset-0">
              {salon.name}
            </Link>
          </h3>
        </div>
        <VerifyBadge status={salon.status} className="self-start" />
        <RatingInline salon={salon} />
        <p className="flex items-center gap-1 text-caption text-muted-foreground">
          <Icon name="location" size={16} /> {salon.area} · {fmt.rating(salon.distanceKm)} کیلومتر
        </p>
        <p className="mt-auto flex items-center gap-1.5 text-caption">
          {slots > 0 ? (
            <>
              <Dot /> {fmt.num(slots)} نوبت خالی امروز
            </>
          ) : (
            <span className="text-muted-foreground">امروز نوبت خالی ندارد</span>
          )}
        </p>
      </div>
    </article>
  );
}

export function RatingSummary({ salon }: { salon: Salon }) {
  const fmt = useFmt();
  const n = salon.reviews.length;
  const dims = dimAverages(salon);
  const enough = n >= DECISIONS.minReviewsForScore;
  return (
    <div className="grid gap-6 rounded-card bg-card p-5 shadow-card sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-start gap-1">
        {enough ? (
          <>
            <span className="font-mono text-display leading-none">{fmt.rating(avgRating(salon))}</span>
            <span className="text-caption text-muted-foreground">از {fmt.digits(5)}، بر پایه‌ی {fmt.num(n)} رزرو تأییدشده</span>
          </>
        ) : (
          <p className="max-w-56 text-caption text-muted-foreground">
            {n === 0 ? "این سالن هنوز نظری ندارد." : `${fmt.num(n)} نظر تأییدشده ثبت شده؛ برای نمایش امتیاز دست‌کم ${fmt.num(DECISIONS.minReviewsForScore)} نظر لازم است.`}
          </p>
        )}
      </div>
      {n > 0 && (
        <ul className="flex flex-col gap-2.5">
          {DECISIONS.ratingDimensions.map((d, i) => (
            <li key={d} className="grid grid-cols-[5rem_1fr_2.5rem] items-center gap-3 text-caption">
              <span>{d}</span>
              <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="block h-full rounded-full bg-ink" style={{ width: `${(dims[i] / 5) * 100}%` }} />
              </span>
              <span className="font-semibold">{fmt.rating(dims[i])}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  const fmt = useFmt();
  return (
    <article className="flex flex-col gap-3 rounded-card bg-card p-5 shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{r.author}</p>
          <p className="text-caption text-muted-foreground">
            {r.service} · {r.date}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-caption">
          <Icon name="rating" size={14} /> {fmt.rating(r.overall)}
        </span>
      </header>
      <p className="flex items-center gap-1 text-label text-success-text">
        <Icon name="verified" size={14} /> نظر تأییدشده · پس از رزرو انجام‌شده
      </p>
      <p>{r.text}</p>
      {r.reply && (
        <div className="rounded-input border-s-2 border-foreground bg-muted px-3 py-2 text-caption">
          <span className="font-semibold">پاسخ سالن: </span>
          {r.reply}
        </div>
      )}
    </article>
  );
}

export function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="مراحل">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2" aria-current={i === current ? "step" : undefined}>
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full text-caption font-semibold",
              i < current ? "bg-ink text-ink-foreground" : i === current ? "bg-lime text-brand-ink" : "bg-muted text-muted-foreground",
            )}
          >
            {i + 1 <= 9 ? "۱۲۳۴۵۶۷۸۹"[i] : i + 1}
          </span>
          <span className={cn("hidden text-caption md:inline", i === current ? "font-semibold" : "text-muted-foreground")}>{s}</span>
          {i < steps.length - 1 && <span className="h-px flex-1 bg-border-strong" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}
