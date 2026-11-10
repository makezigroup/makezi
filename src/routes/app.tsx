import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Smartphone, Download, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/mk/layout";
import { Dot, btn } from "@/components/mk/core";
import { InstallStep, INSTALL_STEPS, AppPhoneMockup, StoreButton, IconBadge } from "@/components/mk/app-promo";
import { APP_LINKS, detectPlatform, type Platform } from "@/lib/app-links";
import { track } from "@/lib/analytics";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/app")({
  head: () =>
    seo("دانلود اپلیکیشن میکزی | نسخه اندروید و آیفون", "اپلیکیشن میکزی را برای اندروید از کافه‌بازار و مایکت دریافت کن یا نسخه PWA را روی آیفون نصب کن. سالن‌های زیبایی را کشف و مقایسه کن.", { path: "/app" }),
  component: AppPage,
});

const FEATURES = [
  { icon: "salon" as const, t: "کشف سالن‌های زیبایی", b: "سالن‌های اطرافت را بر اساس خدمت، محله و ویژگی پیدا کن." },
  { icon: "package" as const, t: "بررسی خدمات", b: "فهرست خدمات هر سالن را با جزئیات ببین." },
  { icon: "sort" as const, t: "مقایسه‌ی سالن‌ها", b: "تا سه سالن را کنار هم مقایسه کن." },
  { icon: "payment" as const, t: "قیمت‌های اعلام‌شده", b: "قیمت خدمات را پیش از مراجعه ببین." },
  { icon: "review" as const, t: "نظرهای مشتریان", b: "نظرهای بررسی‌شده و امتیازهای ابعاد مختلف را بخوان." },
  { icon: "save" as const, t: "علاقه‌مندی‌ها", b: "سالن‌های موردعلاقه‌ات را ذخیره کن." },
  { icon: "location" as const, t: "مکان سالن‌ها", b: "آدرس و محله‌ی هر سالن را پیدا کن." },
  { icon: "call" as const, t: "تماس مستقیم", b: "مستقیم با خود سالن تماس بگیر." },
];

const APP_FAQ = [
  { q: "چطور میکزی را روی اندروید دانلود کنم؟", a: "نسخه‌ی اندروید میکزی از کافه‌بازار و مایکت توزیع می‌شود. به‌محض انتشار پیوند رسمی، دکمه‌های دانلود در همین صفحه فعال می‌شوند." },
  { q: "آیا میکزی را می‌توان روی آیفون نصب کرد؟", a: "بله. نسخه‌ی آیفون میکزی یک وب‌اپلیکیشن (PWA) است که با مرورگر Safari و گزینه‌ی Add to Home Screen به صفحه‌ی اصلی گوشی اضافه می‌شود." },
  { q: "آیا نسخه‌ی آیفون در App Store موجود است؟", a: "خیر. میکزی در App Store منتشر نشده است؛ تجربه‌ی آیفون از طریق وب‌اپلیکیشن و نصب از Safari ارائه می‌شود." },
  { q: "چطور میکزی را به صفحه‌ی اصلی آیفون اضافه کنم؟", a: "سایت میکزی را در Safari باز کن، دکمه‌ی Share را بزن، گزینه‌ی Add to Home Screen را انتخاب کن و در پایان روی Add بزن. راهنمای تصویری همین صفحه را ببین." },
  { q: "آیا باید چیزی از App Store نصب کنم؟", a: "خیر. برای استفاده از میکزی در آیفون هیچ نصبی از App Store لازم نیست؛ همه‌چیز از طریق مرورگر Safari انجام می‌شود." },
  { q: "آیا بدون نصب هم می‌توان از میکزی استفاده کرد؟", a: "بله. وب‌سایت میکزی همیشه و بدون هیچ نصبی در مرورگر گوشی و رایانه در دسترس است." },
];

function PlatformCard({ id, recommended, title, body, children }: { id: string; recommended: boolean; title: string; body: string; children: React.ReactNode }) {
  return (
    <div id={id} className={cn("relative flex flex-col gap-4 rounded-card bg-card p-6 shadow-card md:p-8", recommended && "ring-2 ring-pink")}>
      {recommended && (
        <span className="absolute -top-3 start-6 rounded-full bg-pink-soft px-3 py-1 text-label font-bold text-pink-text">پیشنهاد برای دستگاه شما</span>
      )}
      <h2 className="text-h2">{title}</h2>
      <p className="text-muted-foreground">{body}</p>
      <div className="mt-auto flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function AppPage() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const guideRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setPlatform(detectPlatform(navigator.userAgent));
    track("app_download_page_viewed");
  }, []);
  const scrollToGuide = () => {
    track("ios_pwa_guide_viewed", { source: "app_page" });
    guideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="container-mk grid items-center gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-1.5 text-label font-bold text-pink-text">
            <Dot className="size-1.5" /> اپلیکیشن میکزی
          </p>
          <h1 className="text-display">میکزی، همیشه <span className="text-pink-text">همراه تو</span></h1>
          <p className="max-w-xl text-body-l text-muted-foreground">
            برای کشف سالن‌های زیبایی، بررسی خدمات، مقایسه‌ی قیمت‌ها و پیدا کردن انتخاب‌های موردعلاقه‌ات، میکزی را روی گوشی خودت داشته باش.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#platforms" className={btn({ variant: "primary", size: "lg" })}>
              <Download className="size-4" /> دانلود برای اندروید
            </a>
            <button type="button" onClick={scrollToGuide} className={btn({ variant: "outline", size: "lg" })}>
              <Smartphone className="size-4" /> نصب در آیفون
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <AppPhoneMockup />
        </div>
      </section>

      {/* Platform selection */}
      <section id="platforms" className="container-mk scroll-mt-24 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <PlatformCard id="android" recommended={platform === "android"} title="دانلود برای اندروید" body="نسخه‌ی اندروید میکزی را از مارکت موردعلاقه‌ات دریافت کن.">
            <StoreButton store="cafeBazaar" size="lg" />
            <StoreButton store="myket" size="lg" />
          </PlatformCard>
          <PlatformCard id="ios" recommended={platform === "ios"} title="استفاده از میکزی در آیفون" body="نسخه‌ی وب‌اپلیکیشن میکزی را به صفحه‌ی اصلی آیفونت اضافه کن و مثل یک اپلیکیشن از آن استفاده کن.">
            <button type="button" onClick={scrollToGuide} className={btn({ variant: "ink", size: "lg" })}>
              <ChevronDown className="size-4" /> راهنمای نصب در آیفون
            </button>
          </PlatformCard>
        </div>
        <p className="mt-4 text-caption text-muted-foreground">
          نشانی وب‌اپلیکیشن: <span dir="ltr" className="font-mono">{APP_LINKS.pwaUrl}</span> — همه‌ی گزینه‌ها برای همه‌ی دستگاه‌ها در دسترس است.
        </p>
      </section>

      {/* iPhone PWA installation guide */}
      <section ref={guideRef} aria-labelledby="ios-guide-title" className="scroll-mt-24 border-y border-border bg-pink-soft/40 py-16">
        <div className="container-mk">
          <h2 id="ios-guide-title" className="text-h2">چطور میکزی را روی آیفون نصب کنم؟</h2>
          <p className="mt-2 max-w-2xl text-body-l text-muted-foreground">با چند مرحله‌ی ساده، میکزی را به صفحه‌ی اصلی آیفونت اضافه کن.</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSTALL_STEPS.map((s, i) => (
              <InstallStep key={s.title} n={i + 1} icon={s.icon} title={s.title} body={s.body} />
            ))}
          </ol>
          <p className="mt-6 rounded-input border border-pink-border bg-pink-soft px-4 py-3 text-caption font-semibold text-pink-text">
            برای نصب صحیح نسخه‌ی PWA در آیفون، از مرورگر Safari استفاده کن.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container-mk py-16">
        <h2 className="text-h2">با میکزی چه کارهایی می‌توانی بکنی؟</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <li key={f.t} className="flex items-start gap-3 rounded-card bg-card p-5 shadow-card">
              <IconBadge name={f.icon} />
              <span>
                <span className="block font-bold">{f.t}</span>
                <span className="mt-1 block text-caption text-muted-foreground">{f.b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="container-mk py-14">
        <h2 className="text-h2">پرسش‌های رایج درباره‌ی اپلیکیشن</h2>
        <Accordion type="single" collapsible className="mt-6">
          {APP_FAQ.map((f, i) => (
            <AccordionItem key={i} value={String(i)}>
              <AccordionTrigger className="text-start text-body font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-body text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
