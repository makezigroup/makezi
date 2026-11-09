import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/mk/content-page";
import { Icon, btn } from "@/components/mk/core";
import { DECISIONS } from "@/lib/decisions";
import { seo } from "@/lib/seo";

const STEPS = [
  { i: "search" as const, t: "جست‌وجو", b: "خدمت، محله، بازه‌ی قیمت، امتیاز و ویژگی‌های لازم را انتخاب کنید." },
  { i: "salon" as const, t: "بررسی پروفایل", b: "خدمات و قیمت با تاریخ بررسی، نمونه‌کار، مدارک، ساعت کاری و نظرها." },
  { i: "sort" as const, t: `مقایسه تا ${DECISIONS.compareMax} سالن`, b: "قیمت، امتیاز هر بخش، ویژگی‌ها و مدارک را کنار هم ببینید." },
  { i: "call" as const, t: "تماس یا مسیریابی", b: "مستقیم با سالن تماس بگیرید یا مسیر را در نقشه باز کنید. هماهنگی با خود سالن است." },
  { i: "review" as const, t: "نوشتن نظر", b: `تجربه‌تان را در ${DECISIONS.ratingDimensions.length} بخش امتیاز دهید. هر نظر پیش از انتشار بررسی می‌شود.` },
  { i: "verified" as const, t: "مراجعه‌ی تأییدشده", b: "اگر مدرک مراجعه بفرستید و تیم آن را تأیید کند، نظرتان برچسب «مراجعه‌ی تأییدشده» می‌گیرد." },
];

export const Route = createFileRoute("/how-it-works")({
  head: () => seo("میکزی چطور کار می‌کند", "از جست‌وجو تا نظر: پیدا کردن، مقایسه و بررسی سالن‌های زیبایی در میکزی.", { path: "/how-it-works" }),
  component: () => (
    <ContentPage title="میکزی چطور کار می‌کند" body="میکزی راهنمای پیدا کردن و مقایسه‌ی سالن‌هاست. اطلاعات سالن‌ها را تیم میکزی ثبت و بررسی می‌کند.">
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, n) => (
          <li key={s.t} className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-card">
            <span className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-muted"><Icon name={s.i} /></span>
              <span className="font-mono text-caption text-muted-foreground">قدم {"۱۲۳۴۵۶"[n]}</span>
            </span>
            <h2 className="text-h3">{s.t}</h2>
            <p className="text-muted-foreground">{s.b}</p>
          </li>
        ))}
      </ol>
      <Link to="/salons" className={btn({ size: "lg" }) + " mt-8"}>شروع کاوش</Link>
    </ContentPage>
  ),
});
