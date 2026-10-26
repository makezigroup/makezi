import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Icon, Logo, LogoMark, btn } from "./core";
import type { IconName } from "./icon-data";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/discover", label: "جست‌وجوی سالن" },
  { to: "/map", label: "نقشه" },
  { to: "/gallery", label: "گالری مدل" },
  { to: "/how-it-works", label: "میکزی چطور کار می‌کند" },
  { to: "/for-salons", label: "برای سالن‌ها" },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useApp();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "تم روشن" : "تم تیره"}
      className={cn("grid size-11 place-items-center rounded-full text-foreground hover:bg-muted", className)}
    >
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
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

function HeaderSearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        nav({ to: "/discover", search: { q: q || undefined } });
      }}
      className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 lg:flex lg:max-w-xs"
    >
      <Icon name="search" size={20} className="text-muted-foreground" />
      <label htmlFor="hq" className="sr-only">جست‌وجوی خدمت یا سالن</label>
      <input id="hq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="خدمت یا سالن…" className="h-11 min-w-0 flex-1 bg-transparent text-caption outline-none" />
    </form>
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
            <Link key={n.to} to={n.to} className="rounded-full px-3 py-2 text-caption font-semibold text-foreground no-underline hover:bg-muted" activeProps={{ className: "bg-muted" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 xl:hidden" />
        <HeaderSearch />
        <div className="flex items-center gap-1">
          <DigitsToggle />
          <ThemeToggle />
          <Link to={phone ? "/account" : "/login"} className={cn(btn({ variant: "ink", size: "sm" }), "hidden sm:inline-flex")}>
            <Icon name="profile" size={18} />
            {phone ? "حساب من" : "ورود"}
          </Link>
          <button className="grid size-11 place-items-center rounded-full hover:bg-muted xl:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="منو">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="منوی موبایل" className="container-mk flex flex-col gap-1 border-t border-border pb-4 pt-2 xl:hidden">
          {[...NAV, { to: "/my-bookings", label: "نوبت‌های من" } as const, { to: phone ? "/account" : "/login", label: phone ? "حساب من" : "ورود" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-input px-3 py-3 font-semibold text-foreground no-underline hover:bg-muted">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const cols: { title: string; links: { to: string; label: string }[] }[] = [
    { title: "مشتریان", links: [{ to: "/discover", label: "جست‌وجوی سالن" }, { to: "/map", label: "نقشه" }, { to: "/gallery", label: "گالری مدل" }, { to: "/my-bookings", label: "نوبت‌های من" }] },
    { title: "سالن‌ها", links: [{ to: "/for-salons", label: "همکاری با میکزی" }, { to: "/salon/onboarding", label: "ثبت سالن" }, { to: "/salon", label: "پنل سالن" }] },
    { title: "میکزی", links: [{ to: "/about", label: "درباره‌ی ما" }, { to: "/how-it-works", label: "میکزی چطور کار می‌کند" }, { to: "/help", label: "راهنما و پرسش‌ها" }, { to: "/contact", label: "تماس و پشتیبانی" }] },
    { title: "قوانین", links: [{ to: "/privacy", label: "حریم خصوصی (پیش‌نویس)" }, { to: "/terms", label: "شرایط استفاده (پیش‌نویس)" }] },
  ];
  return (
    <footer className="mt-24 bg-inverse text-inverse-foreground">
      <div className="container-mk grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2">
            <LogoMark className="h-8 w-auto" />
            <span className="font-lat text-xl font-extrabold" dir="ltr">makezi</span>
          </span>
          <p className="max-w-xs text-caption opacity-80">بازار خدمات زیبایی برای انتخاب آگاهانه: قیمت ثبت‌شده، مدارک بررسی‌شده و نظرهای تأییدشده.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="mb-3 text-caption font-semibold opacity-70">{c.title}</h2>
            <ul className="flex flex-col gap-2">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-caption text-inverse-foreground no-underline hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-mk flex flex-wrap justify-between gap-2 border-t border-current/15 py-5 text-label opacity-70">
        <span>© MAKEZI · نسخه‌ی نمایشی با داده‌های نمونه</span>
        <span>اطلاعات تماس رسمی هنوز اعلام نشده است.</span>
      </div>
    </footer>
  );
}

const BOTTOM: { to: string; label: string; icon: IconName }[] = [
  { to: "/discover", label: "جست‌وجو", icon: "search" },
  { to: "/map", label: "نقشه", icon: "map" },
  { to: "/gallery", label: "گالری", icon: "gallery" },
  { to: "/my-bookings", label: "نوبت‌ها", icon: "calendar" },
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
                <span className={cn("grid h-7 w-12 place-items-center rounded-full", active && "bg-lime text-brand-ink")}>
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

export function SiteLayout({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-lime focus:px-4 focus:py-2 focus:text-brand-ink">
        رفتن به محتوای اصلی
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer && <SiteFooter />}
      <BottomNav />
    </div>
  );
}

export function PageIntro({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <section className="container-mk pb-8 pt-10 md:pt-14">
      <h1 className="text-h1">{title}</h1>
      {body && <p className="mt-3 max-w-2xl text-body-l text-muted-foreground">{body}</p>}
      {children}
    </section>
  );
}

/** Shared shell for salon portal and admin. */
export function DashShell({ title, badge, nav, children }: { title: string; badge: string; nav: { to: string; label: string; icon: IconName; exact?: boolean }[]; children: ReactNode }) {
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
                    activeOptions={{ exact: n.exact }}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-button px-3 text-caption font-semibold text-foreground no-underline hover:bg-muted"
                    activeProps={{ className: "!bg-selected !text-selected-foreground" }}
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

export function DashTitle({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
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
