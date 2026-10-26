import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashTitle } from "./layout";
import { BookingBadge, Button, Card, DemoNote, Icon, StatePanel, StatusBadge, VerifyBadge, inputCls } from "./core";
import { CATEGORIES, SALONS, avgRating, type VerifyStatus } from "@/lib/data";
import { OPEN_DECISIONS } from "@/lib/decisions";
import { useApp, useFmt } from "@/lib/app-store";

export const ADMIN_NAV = [
  { to: "/admin", label: "پیشخوان", icon: "salon" as const, exact: true },
  { to: "/admin/verifications", label: "صف تأیید", icon: "verified" as const },
  { to: "/admin/salons", label: "سالن‌ها", icon: "location" as const },
  { to: "/admin/reviews", label: "بررسی نظرها", icon: "review" as const },
  { to: "/admin/bookings", label: "رزروها", icon: "calendar" as const },
  { to: "/admin/disputes", label: "اختلاف‌ها", icon: "support" as const },
  { to: "/admin/service-categories", label: "دسته‌بندی خدمات", icon: "package" as const },
  { to: "/admin/analytics", label: "شاخص‌ها", icon: "sort" as const },
];

const Note = () => <DemoNote className="mt-6">ابزار داخلی نمایشی است. در نسخه‌ی نهایی فقط کارکنان با نقش مدیر و پس از احراز هویت در سرور دسترسی دارند؛ مدارک و اطلاعات مشتری هرگز در مسیر عمومی نیست.</DemoNote>;

export function AdminHome() {
  const fmt = useFmt();
  const { bookings } = useApp();
  const pending = SALONS.filter((s) => s.status !== "verified").length;
  return (
    <>
      <DashTitle title="پیشخوان مدیریت" body="شاخص‌های بازار بر پایه‌ی داده‌های نمونه" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["سالن‌های فعال", SALONS.length, "salon"],
          ["در انتظار تأیید", pending, "verified"],
          ["رزروهای ثبت‌شده", bookings.length, "calendar"],
          ["نظرهای در صف", 3, "review"],
        ].map(([l, v, i]) => (
          <Card key={l as string} className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name={i as "salon"} /></span>
            <div><p className="text-caption text-muted-foreground">{l}</p><p className="text-h2">{fmt.num(v as number)}</p></div>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="mb-3 text-h3">تصمیم‌های باز محصول</h2>
        <ul className="divide-y divide-border">
          {OPEN_DECISIONS.map((d) => (
            <li key={d.id} className="grid gap-1 py-3 md:grid-cols-[6rem_12rem_1fr]">
              <bdi dir="ltr" className="font-mono text-caption">{d.id}</bdi>
              <span className="font-semibold">{d.title}</span>
              <span className="text-caption text-muted-foreground">{d.current}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Note />
    </>
  );
}

export function AdminVerifications() {
  const [queue, setQueue] = useState(
    SALONS.filter((s) => s.status !== "verified").flatMap((s) => s.credentials.map((c) => ({ key: s.id + c.label, salon: s.name, label: c.label, date: c.date, status: "pending" as VerifyStatus | "rejected" }))),
  );
  const act = (key: string, status: VerifyStatus | "rejected") => {
    setQueue((q) => q.map((x) => (x.key === key ? { ...x, status } : x)));
    toast.success(status === "verified" ? "مدرک تأیید شد." : "مدرک رد شد و به سالن اطلاع داده می‌شود.");
  };
  return (
    <>
      <DashTitle title="صف تأیید مدارک" body="هر مدرک را جداگانه بررسی کنید. تأیید مدارک یعنی بررسی مدرک، نه تضمین کیفیت." />
      <Card className="p-0">
        {queue.length === 0 ? <StatePanel icon="verified" title="صف خالی است" /> : (
          <ul className="divide-y divide-border">
            {queue.map((q) => (
              <li key={q.key} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-48 flex-1"><p className="font-semibold">{q.label}</p><p className="text-caption text-muted-foreground">{q.salon} · ارسال {q.date}</p></div>
                {q.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => toast("نمایش فایل پس از اتصال فضای خصوصی فعال می‌شود.")}>دیدن فایل</Button>
                    <Button size="sm" onClick={() => act(q.key, "verified")}>تأیید</Button>
                    <Button size="sm" variant="danger" onClick={() => act(q.key, "rejected")}>رد</Button>
                  </div>
                ) : q.status === "rejected" ? <StatusBadge tone="error">ردشده</StatusBadge> : <VerifyBadge status="verified" />}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Note />
    </>
  );
}

export function AdminSalons() {
  const fmt = useFmt();
  const [q, setQ] = useState("");
  const list = SALONS.filter((s) => s.name.includes(q) || s.area.includes(q));
  return (
    <>
      <DashTitle title="سالن‌ها" />
      <label className="mb-4 block max-w-sm"><span className="sr-only">جست‌وجو</span><input className={inputCls} placeholder="جست‌وجوی نام یا محله" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-start text-caption">
          <thead className="bg-muted text-start"><tr>{["سالن", "محله", "وضعیت", "کامل‌بودن", "نظر", "امتیاز", ""].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">
            {list.map((s) => (
              <tr key={s.id}>
                <td className="p-3 font-semibold">{s.name}</td>
                <td className="p-3">{s.area}</td>
                <td className="p-3"><VerifyBadge status={s.status} /></td>
                <td className="p-3">{fmt.num(s.profileCompleteness)}٪</td>
                <td className="p-3">{fmt.num(s.reviews.length)}</td>
                <td className="p-3">{s.reviews.length ? fmt.rating(avgRating(s)) : "—"}</td>
                <td className="p-3"><Link to="/salons/$slug" params={{ slug: s.slug }}>پروفایل</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Note />
    </>
  );
}

export function AdminReviews() {
  const [items, setItems] = useState(SALONS.flatMap((s) => s.reviews.slice(0, 1).map((r) => ({ ...r, salon: s.name, state: "queue" as "queue" | "published" | "hidden" }))));
  return (
    <>
      <DashTitle title="بررسی نظرها" body="فقط نظرهای مرتبط با رزرو انجام‌شده وارد صف می‌شوند. معیارهای نهایی بررسی محتوا هنوز تعیین نشده است." />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((r) => (
          <Card key={r.id} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{r.author} · {r.salon}</span>
              <StatusBadge tone={r.state === "queue" ? "warning" : r.state === "published" ? "success" : "neutral"}>{r.state === "queue" ? "در صف" : r.state === "published" ? "منتشرشده" : "پنهان"}</StatusBadge>
            </div>
            <p className="text-muted-foreground">{r.text}</p>
            {r.state === "queue" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setItems((x) => x.map((y) => (y.id === r.id ? { ...y, state: "published" } : y)))}>انتشار</Button>
                <Button size="sm" variant="outline" onClick={() => setItems((x) => x.map((y) => (y.id === r.id ? { ...y, state: "hidden" } : y)))}>پنهان‌کردن</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
      <Note />
    </>
  );
}

export function AdminBookings() {
  const fmt = useFmt();
  const { bookings } = useApp();
  return (
    <>
      <DashTitle title="رزروها" />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-caption">
          <thead className="bg-muted"><tr>{["کد", "سالن", "تاریخ", "مبلغ", "وضعیت"].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="p-3"><bdi dir="ltr" className="font-mono">{b.id}</bdi></td>
                <td className="p-3">{SALONS.find((s) => s.id === b.salonId)?.name}</td>
                <td className="p-3">{fmt.date(b.date, { day: "numeric", month: "long" })} · {fmt.digits(b.time)}</td>
                <td className="p-3">{fmt.price(b.total)}</td>
                <td className="p-3"><BookingBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-2 text-label text-muted-foreground">نام و شماره‌ی مشتری در این فهرست نمایش داده نمی‌شود.</p>
      <Note />
    </>
  );
}

export function AdminDisputes() {
  const [list, setList] = useState([
    { id: "DSP-104", booking: "MKZ-4602", topic: "اختلاف قیمت نهایی با قیمت ثبت‌شده", state: "open" },
    { id: "DSP-101", booking: "MKZ-4511", topic: "تأخیر در شروع نوبت", state: "open" },
  ]);
  return (
    <>
      <DashTitle title="اختلاف‌ها" body="روند رسیدگی و سیاست بازپرداخت هنوز تعیین نشده است؛ این صفحه فقط ثبت و پیگیری را نشان می‌دهد." />
      <div className="flex flex-col gap-3">
        {list.map((d) => (
          <Card key={d.id} className="flex flex-wrap items-center gap-3">
            <div className="flex-1"><p className="font-semibold">{d.topic}</p><p className="text-caption text-muted-foreground"><bdi dir="ltr" className="font-mono">{d.id} · {d.booking}</bdi></p></div>
            <StatusBadge tone={d.state === "open" ? "warning" : "success"}>{d.state === "open" ? "باز" : "بسته‌شده"}</StatusBadge>
            {d.state === "open" && <Button size="sm" variant="outline" onClick={() => setList((x) => x.map((y) => (y.id === d.id ? { ...y, state: "closed" } : y)))}>بستن پرونده</Button>}
          </Card>
        ))}
      </div>
      <Note />
    </>
  );
}

export function AdminCategories() {
  const [cats, setCats] = useState(CATEGORIES.map((c) => ({ ...c, active: c.id === "nail" })));
  const [n, setN] = useState("");
  return (
    <>
      <DashTitle title="دسته‌بندی خدمات" body="تمرکز اولیه ناخن است؛ دسته‌های دیگر قابل فعال‌سازی‌اند." />
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {cats.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3 p-4">
              <Icon name={c.icon} /> <span className="flex-1 font-semibold">{c.label}</span>
              <StatusBadge tone={c.active ? "success" : "neutral"}>{c.active ? "فعال در راه‌اندازی" : "آماده، غیرفعال"}</StatusBadge>
              <Button size="sm" variant="ghost" onClick={() => setCats((x) => x.map((y, j) => (j === i ? { ...y, active: !y.active } : y)))}>{c.active ? "غیرفعال" : "فعال"}</Button>
            </li>
          ))}
        </ul>
      </Card>
      <form className="mt-4 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); if (!n.trim()) return; setCats((x) => [...x, { id: `c${x.length}` as "nail", label: n, icon: "package", active: false }]); setN(""); }}>
        <label className="sr-only" htmlFor="nc">دسته‌ی جدید</label>
        <input id="nc" className={inputCls} placeholder="دسته‌ی جدید" value={n} onChange={(e) => setN(e.target.value)} />
        <Button type="submit" variant="ink">افزودن</Button>
      </form>
      <Note />
    </>
  );
}

export function AdminAnalytics() {
  const fmt = useFmt();
  const funnel = [["جست‌وجو", 1000], ["دیدن پروفایل", 420], ["شروع رزرو", 140], ["ثبت رزرو", 88], ["تأیید سالن", 76]] as const;
  return (
    <>
      <DashTitle title="شاخص‌های بازار" body="قیف نمونه — شاخص‌های نهایی KPI پس از اتصال تحلیل‌گر جایگزین می‌شود." />
      <Card>
        <ul className="flex flex-col gap-3">
          {funnel.map(([l, v]) => (
            <li key={l} className="grid grid-cols-[8rem_1fr_4rem] items-center gap-3 text-caption">
              <span>{l}</span>
              <span className="h-3 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-ink" style={{ width: `${v / 10}%` }} /></span>
              <span className="font-mono">{fmt.num(v)}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Note />
    </>
  );
}
