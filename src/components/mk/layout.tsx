import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button, Dot, Icon, Logo, LogoMark, btn } from "./core";
import type { IconName } from "./icon-data";
import { useApp } from "@/lib/app-store";
import { CompareBar } from "./marketplace";
import { StoreButton, WebAppButton } from "./app-promo";
import appQr from "@/assets/app-qr.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "خانه" },
  { to: "/salons", label: "جست‌وجوی سالن" },
  { to: "/services", label: "خدمات" },
  { to: "/compare", label: "مقایسه" },
  { to: "/about", label: "درباره‌ی میکزی" },
] as const;

const ACCOUNT = [
  { to: "/account", label: "پروفایل من", icon: "profile" },
  { to: "/my-reviews", label: "نظرهای من", icon: "review" },
  { to: "/saved", label: "علاقه‌مندی‌ها", icon: "save" },
  { to: "/compare", label: "مقایسهٔ ذخیره‌شده", icon: "sort" },
  { to: "/notifications", label: "اعلان‌ها", icon: "support" },
  { to: "/settings", label: "تنظیمات", icon: "support" },
] as const;

function AccountMenu() {
  const { phone, signOut } = useApp();
  if (!phone)
    return (
      <Link to="/login" className={cn(btn({ variant: "ink", size: "sm" }), "hidden sm:inline-flex")}>
        <Icon name="profile" size={18} /> ورود
      </Link>
    );
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className={cn(btn({ variant: "ink", size: "sm" }), "hidden sm:inline-flex")}>
        <Icon name="profile" size={18} /> حساب من
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        {ACCOUNT.map((a) => (
          <DropdownMenuItem key={a.to} asChild>
            <Link to={a.to} className="flex min-h-10 items-center gap-2 no-underline text-foreground"><Icon name={a.icon} size={18} /> {a.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut} className="min-h-10">خروج</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggle({ className }: { className?: string | undefined }) {
  const { theme, setTheme } = useApp();
  const dark = theme === "dark";
  return (
    <Button variant="ghost"
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "تم روشن" : "تم تیره"}
      className={cn("size-11 min-h-11 rounded-full p-0", className)}
    >
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

export function DigitsToggle() {
  const { faDigits, setFaDigits } = useApp();
  return (
    <button
      type="button"
      onClick={() => setFaDigits(!faDigits)}
      className="grid h-11 min-w-11 place-items-center rounded-full px-2 font-mono text-caption hover:bg-muted"
      aria-label={faDigits ? "نمایش ارقام لاتین" : "نمایش ارقام فارسی"}
      title="ارقام فارسی / لاتین"
    >
      {faDigits ? "۱۲۳" : "123"}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { phone } = useApp();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="container-mk flex h-16 items-center gap-4">
        <Logo />
        <nav aria-label="اصلی" className="hidden flex-1 items-center gap-1 xl:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="whitespace-nowrap rounded-full px-3 py-2 text-caption font-semibold text-foreground no-underline hover:bg-muted" activeProps={{ className: "bg-pink-soft text-pink-text" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 xl:hidden" />
        <div className="flex items-center gap-1">
          <Link to="/app" className={cn(btn({ variant: "ghost", size: "sm" }), "hidden rounded-full bg-pink-soft font-bold text-pink-text hover:bg-pink-soft lg:inline-flex")}>
            <Icon name="add" size={18} /> دانلود اپ
          </Link>
          <ThemeToggle />
          <AccountMenu />
          <Button variant="ghost" className="size-11 min-h-11 rounded-full p-0 xl:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="منو">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav aria-label="منوی موبایل" className="container-mk flex flex-col gap-1 border-t border-border pb-4 pt-2 xl:hidden">
          {[...NAV, { to: "/for-salons", label: "افزودن سالن" }, ...(phone ? ACCOUNT : [{ to: "/login", label: "ورود" } as const])].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-input px-3 py-3 font-semibold text-foreground no-underline hover:bg-muted">
              {n.label}
            </Link>
          ))}
          <Link to="/app" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2 rounded-input bg-pink-soft px-3 py-3 font-bold text-pink-text no-underline">
            <Icon name="add" size={18} /> دانلود اپلیکیشن میکزی
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const cols: { title: string; links: { to: string; label: string }[] }[] = [
    { title: "مشتریان", links: [{ to: "/salons", label: "جست‌وجوی سالن" }, { to: "/services", label: "خدمات" }, { to: "/map", label: "نمای شماتیک مکان‌ها" }, { to: "/gallery", label: "گالری مدل" }, { to: "/compare", label: "مقایسه‌ی سالن‌ها" }] },
    { title: "سالن‌ها", links: [{ to: "/for-salons", label: "سالن خود را به میکزی اضافه کنید" }] },
    { title: "میکزی", links: [{ to: "/about", label: "درباره‌ی ما" }, { to: "/how-it-works", label: "میکزی چطور کار می‌کند" }, { to: "/help", label: "راهنما و پرسش‌ها" }, { to: "/contact", label: "تماس و پشتیبانی" }] },
    { title: "قوانین و پشتیبانی", links: [{ to: "/privacy", label: "حریم خصوصی (پیش‌نویس)" }, { to: "/terms", label: "شرایط استفاده (پیش‌نویس)" }, { to: "/review-guidelines", label: "راهنمای نظر" }, { to: "/review-verification", label: "تأیید مراجعه" }, { to: "/content-policy", label: "سیاست محتوا" }, { to: "/report-problem", label: "گزارش مشکل" }] },
  ];
  return (
    <footer className="mt-24 border-t border-border bg-background text-foreground">
      <div className="container-mk grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2">
            <LogoMark className="h-8 w-auto" />
            <span className="text-xl font-extrabold">میکزی</span>
          </span>
          <p className="max-w-xs text-caption text-muted-foreground">راهنمای خدمات زیبایی برای انتخاب آگاهانه؛ اطلاعات شفاف و مقایسه‌ی سالن‌ها.</p>
          <div className="mt-4 flex flex-col gap-3">
            <h2 className="flex items-center gap-1.5 text-caption font-semibold opacity-70"><Dot className="size-1.5" />دانلود اپلیکیشن</h2>
            <img src={appQr} alt="کد QR صفحه‌ی دانلود اپلیکیشن میکزی" className="w-24 rounded-input border border-border bg-card p-1.5" loading="lazy" />
            <div className="flex flex-col items-start gap-2">
              <StoreButton store="googlePlay" size="sm" />
              <StoreButton store="cafeBazaar" size="sm" />
              <WebAppButton size="sm" />
            </div>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="mb-3 flex items-center gap-1.5 text-caption font-semibold opacity-70"><Dot className="size-1.5" />{c.title}</h2>
            <ul className="flex flex-col gap-2">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-caption text-foreground no-underline decoration-pink underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-mk flex flex-wrap justify-between gap-2 border-t border-current/15 py-5 text-label opacity-70">
        <span>© MAKEZI · انتخاب آگاهانه در زیبایی</span>
        <span>اطلاعات تماس رسمی هنوز اعلام نشده است.</span>
      </div>
    </footer>
  );
}

const BOTTOM: { to: string; label: string; icon: IconName }[] = [
  { to: "/salons", label: "سالن‌ها", icon: "search" },
  { to: "/services", label: "خدمات", icon: "nail" },
  { to: "/compare", label: "مقایسه", icon: "sort" },
  { to: "/saved", label: "علاقه‌مندی", icon: "save" },
  { to: "/account", label: "حساب", icon: "profile" },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="پیمایش پایین" className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface md:hidden">
      <ul className="grid grid-cols-5">
        {BOTTOM.map((b) => {
          const active = path.startsWith(b.to);
          return (
            <li key={b.to}>
              <Link to={b.to} className={cn("flex min-h-16 flex-col items-center justify-center gap-0.5 text-label no-underline", active ? "text-foreground" : "text-muted-foreground")} aria-current={active ? "page" : undefined}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full", active && "bg-pink-soft text-pink-text")}>
                  <Icon name={b.icon} size={20} />
                </span>
                {b.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SiteLayout({ children, footer = true }: { children: ReactNode; footer?: boolean | undefined }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-lime focus:px-4 focus:py-2 focus:text-brand-ink">
        رفتن به محتوای اصلی
      </a>
      <SiteHeader />
      <main id="main">
        {children}
      </main>
      {footer && <SiteFooter />}
      <CompareBar />
    </div>
  );
}

export function PageIntro({ title, body, children }: { title: string; body?: string | undefined; children?: ReactNode | undefined }) {
  return (
    <section className="container-mk pb-8 pt-10 md:pt-14">
      <h1 className="text-h1">{title}</h1>
      {body && <p className="mt-3 max-w-2xl text-body-l text-muted-foreground">{body}</p>}
      {children}
    </section>
  );
}

/** Shared shell for salon portal and admin. */
export function DashShell({ title, badge, nav, children }: { title: string; badge: string; nav: { to: string; label: string; icon: IconName; exact?: boolean | undefined }[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4">
        <button className="grid size-11 place-items-center rounded-full hover:bg-muted lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="منو">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Logo />
        <span className="rounded-full bg-ink px-3 py-1 text-label text-ink-foreground">{badge}</span>
        <div className="flex-1" />
        <DigitsToggle />
        <ThemeToggle />
        <Link to="/" className="hidden text-caption sm:inline">سایت میکزی</Link>
      </header>
      <div className="flex">
        <aside className={cn("fixed inset-y-16 start-0 z-10 w-64 overflow-y-auto border-e border-border bg-surface p-3 transition-transform ease-mk lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0", open ? "translate-x-0" : "translate-x-full rtl:translate-x-full lg:!translate-x-0")}>
          <p className="px-3 pb-2 pt-1 text-label text-muted-foreground">{title}</p>
          <nav aria-label={title}>
            <ul className="flex flex-col gap-0.5">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    activeOptions={{ exact: !!n.exact }}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-button px-3 text-caption font-semibold text-foreground no-underline hover:bg-muted"
                    activeProps={{ className: "!bg-pink-soft !text-pink-text" }}
                  >
                    <Icon name={n.icon} size={20} />
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main id="main" className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function DashTitle({ title, body, action }: { title: string; body?: string | undefined; action?: ReactNode | undefined }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-h2">{title}</h1>
        {body && <p className="mt-1 text-muted-foreground">{body}</p>}
      </div>
      {action}
    </div>
  );
}
