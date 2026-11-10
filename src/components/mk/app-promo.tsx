import { Link } from "@tanstack/react-router";
import { Smartphone, Share, SquarePlus, Check, Download, Star, MapPin, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Dot, Icon, LogoMark, btn } from "./core";
import { usePublicSalons, useFmt, useScore } from "@/lib/app-store";
import { areaName, type Salon } from "@/lib/data";
import { APP_LINKS, isLinkReady } from "@/lib/app-links";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** CSS smartphone frame used for representative mockups of the real MAKEZI UI. */
export function PhoneFrame({ children, label, className }: { children: ReactNode; label: string; className?: string | undefined }) {
  return (
    <figure className={cn("flex flex-col items-center gap-3", className)}>
      <div className="w-56 overflow-hidden rounded-[2.2rem] border-[6px] border-ink bg-background shadow-modal sm:w-64">
        <div className="flex items-center justify-center bg-ink py-1.5">
          <span className="h-1.5 w-16 rounded-full bg-ink-foreground/40" />
        </div>
        <div className="flex h-96 flex-col gap-2 overflow-hidden p-3 sm:h-[26rem]">{children}</div>
      </div>
      <figcaption className="text-label text-muted-foreground">{label}</figcaption>
    </figure>
  );
}

function MiniSalonRow({ salon }: { salon: Salon }) {
  const fmt = useFmt();
  const s = useScore(salon.id);
  return (
    <div className="rounded-input border border-border bg-card p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-label font-bold">{salon.name}</span>
        {s.avg != null && (
          <span className="flex items-center gap-0.5 text-label font-bold text-pink-text">
            <Star className="size-3 fill-current" /> {fmt.rating(s.avg)}
          </span>
        )}
      </div>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
        <MapPin className="size-3" /> {areaName(salon.city, salon.area)}
      </p>
    </div>
  );
}

/** Representative mockup of the discovery screen, built from live directory data. */
export function MockDiscoveryScreen() {
  const salons = usePublicSalons().slice(0, 3);
  return (
    <>
      <div className="flex items-center gap-2">
        <LogoMark className="h-5 w-auto" />
        <span className="text-caption font-extrabold">میکزی</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-2 text-label text-muted-foreground">
        <Search className="size-3.5" /> سالن، خدمت یا آدرس…
      </div>
      {salons.map((s) => <MiniSalonRow key={s.id} salon={s} />)}
    </>
  );
}

/** Representative mockup of a salon profile / reviews screen. */
export function MockProfileScreen() {
  const salon = usePublicSalons()[0];
  const fmt = useFmt();
  const s = useScore(salon?.id ?? "");
  if (!salon) return null;
  return (
    <>
      <div className="rounded-input bg-pink-soft p-3">
        <p className="text-caption font-extrabold">{salon.name}</p>
        <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-3" /> {areaName(salon.city, salon.area)}
        </p>
        {s.avg != null && (
          <p className="mt-2 flex items-center gap-1 text-label font-bold text-pink-text">
            <Star className="size-3.5 fill-current" /> {fmt.rating(s.avg)}
            <span className="font-normal text-muted-foreground">از {fmt.num(s.count)} نظر بررسی‌شده</span>
          </p>
        )}
      </div>
      <p className="text-label font-bold">خدمات و قیمت اعلام‌شده</p>
      {salon.services.slice(0, 3).map((sv) => (
        <div key={sv.id} className="flex items-center justify-between rounded-input border border-border bg-card px-2.5 py-2 text-label">
          <span className="truncate">{sv.name}</span>
          <span className="font-bold">{sv.price ? fmt.price(sv.price) : "—"}</span>
        </div>
      ))}
      <span className="mt-auto rounded-full bg-primary py-2 text-center text-label font-bold text-primary-foreground">دیدن پروفایل سالن</span>
    </>
  );
}

type Store = "cafeBazaar" | "myket";

const STORE_META: Record<Store, { label: string; event: "cafe_bazaar_clicked" | "myket_clicked" }> = {
  cafeBazaar: { label: "دریافت از کافه‌بازار", event: "cafe_bazaar_clicked" },
  myket: { label: "دریافت از مایکت", event: "myket_clicked" },
};

/** Marketplace button. Until the official URL is configured it renders a disabled «به‌زودی» state — never a fake link. */
export function StoreButton({ store, size = "md" }: { store: Store; size?: "md" | "lg" | undefined }) {
  const url = APP_LINKS[store];
  const meta = STORE_META[store];
  const ready = isLinkReady(url);
  const cls = cn(btn({ variant: ready ? "ink" : "outline", size }), !ready && "cursor-not-allowed opacity-70");
  if (!ready)
    return (
      <span className={cls} aria-disabled="true" title="پیوند رسمی هنوز اعلام نشده است">
        <Download className="size-4" /> {meta.label}
        <span className="rounded-full bg-pink-soft px-2 py-0.5 text-label font-bold text-pink-text">به‌زودی</span>
      </span>
    );
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls} onClick={() => track(meta.event)}>
      <Download className="size-4" /> {meta.label}
    </a>
  );
}

/** Homepage promotion section, placed right after the hero. */
export function AppPromoSection() {
  return (
    <section aria-labelledby="app-promo-title" className="border-y border-border bg-pink-soft/40 py-14 md:py-16">
      <div className="container-mk grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-1.5 text-label font-bold text-pink-text">
            <Dot className="size-1.5" /> اپلیکیشن میکزی
          </p>
          <h2 id="app-promo-title" className="text-h1">
            دنیای زیبایی، همیشه <span className="text-pink-text">همراهت</span>
          </h2>
          <p className="max-w-xl text-body-l text-muted-foreground">
            سالن‌های زیبایی رو کشف کن، خدمات و قیمت‌ها رو مقایسه کن و انتخاب‌هات رو همیشه همراه خودت داشته باش.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <StoreButton store="cafeBazaar" />
            <StoreButton store="myket" />
            <Link to="/app" className={btn({ variant: "ghost" })} onClick={() => track("ios_pwa_guide_viewed", { source: "home" })}>
              <Smartphone className="size-4" /> استفاده در آیفون
            </Link>
          </div>
          <p className="text-caption text-muted-foreground">نسخه‌ی آیفون میکزی یک وب‌اپلیکیشن است که از طریق Safari به صفحه‌ی اصلی اضافه می‌شود.</p>
        </div>
        <div className="flex items-start justify-center gap-4">
          <PhoneFrame label="نمای نمونه از جست‌وجوی سالن‌ها">
            <MockDiscoveryScreen />
          </PhoneFrame>
          <PhoneFrame label="نمای نمونه از پروفایل سالن" className="mt-10 hidden sm:flex">
            <MockProfileScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

/** One illustrated step of the iPhone PWA installation guide. */
export function InstallStep({ n, icon, title, body }: { n: number; icon: ReactNode; title: string; body: string }) {
  const fmt = useFmt();
  return (
    <li
      className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-card"
      onMouseEnter={() => track("ios_install_guide_step_viewed", { step: n })}
    >
      <span className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-full bg-pink-soft text-pink-text">{icon}</span>
        <span className="font-mono text-h2 text-pink-text">{fmt.digits(n)}</span>
      </span>
      <h3 className="text-h3">{title}</h3>
      <p className="text-muted-foreground">{body}</p>
    </li>
  );
}

export const INSTALL_STEPS = [
  { icon: <Smartphone className="size-5" />, title: "سایت میکزی را در Safari باز کن", body: "ابتدا سایت میکزی را با مرورگر Safari آیفون باز کن." },
  { icon: <Share className="size-5" />, title: "دکمه‌ی Share را بزن", body: "از نوار پایین Safari روی دکمه‌ی Share بزن." },
  { icon: <SquarePlus className="size-5" />, title: "Add to Home Screen را انتخاب کن", body: "در فهرست بازشده گزینه‌ی Add to Home Screen را انتخاب کن." },
  { icon: <Check className="size-5" />, title: "روی Add بزن", body: "در مرحله‌ی آخر روی Add بزن تا آیکون میکزی به صفحه‌ی اصلی گوشی اضافه شود." },
] as const;

export function IconBadge({ name }: { name: "salon" | "package" | "sort" | "payment" | "review" | "save" | "location" | "call" }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-pink-soft text-pink-text">
      <Icon name={name} size={20} />
    </span>
  );
}
