import { Link } from "@tanstack/react-router";
import { Smartphone, Share, SquarePlus, Check, Download, Globe } from "lucide-react";
import type { ReactNode } from "react";
import { Dot, Icon, btn } from "./core";
import { useFmt } from "@/lib/app-store";
import { APP_LINKS, isLinkReady } from "@/lib/app-links";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import iphoneScreenLight from "@/assets/iphone-screen-light.png.asset.json";
import iphoneScreenDark from "@/assets/iphone-screen-dark.png.asset.json";
import iphoneFrame from "@/assets/iphone-frame-clean.png.asset.json";

/** Official iPhone mockup showing the real MAKEZI discovery screen. Single phone, no caption. */
export function AppPhoneMockup({ className }: { className?: string | undefined }) {
  return (
    <div className={cn("app-phone relative aspect-[527/1025] w-56 sm:w-72", className)}>
      <div className="app-phone-screen absolute overflow-hidden bg-background">
      <img
        src={iphoneScreenLight.url}
        alt="نمای اپلیکیشن میکزی روی آیفون؛ فهرست سالن‌ها با جست‌وجو و فیلتر"
        className="app-phone-capture dark:hidden"
        loading="lazy"
      />
      <img
        src={iphoneScreenDark.url}
        alt="نمای تیرهٔ اپلیکیشن میکزی روی آیفون؛ فهرست سالن‌ها با جست‌وجو و فیلتر"
        className="app-phone-capture hidden dark:block"
        loading="lazy"
      />
      </div>
      <img src={iphoneFrame.url} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" loading="lazy" />
    </div>
  );
}

type Store = "cafeBazaar" | "myket" | "googlePlay";

const STORE_META: Record<Store, { label: string; event: "cafe_bazaar_clicked" | "myket_clicked" | "google_play_clicked" }> = {
  cafeBazaar: { label: "دریافت از کافه‌بازار", event: "cafe_bazaar_clicked" },
  myket: { label: "دریافت از مایکت", event: "myket_clicked" },
  googlePlay: { label: "دریافت از Google Play", event: "google_play_clicked" },
};

/** Marketplace button. Until the official URL is configured it renders a disabled «به‌زودی» state — never a fake link. */
export function StoreButton({ store, size = "md" }: { store: Store; size?: "sm" | "md" | "lg" | undefined }) {
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

/** Web app (PWA) pill — always available, points to the /app download page. */
export function WebAppButton({ size = "md" }: { size?: "sm" | "md" | "lg" | undefined }) {
  return (
    <Link to="/app" className={btn({ variant: "outline", size })}>
      <Globe className="size-4" /> استفاده از وب‌اپ
    </Link>
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
        </div>
        <div className="flex justify-center">
          <AppPhoneMockup />
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
