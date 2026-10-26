import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashTitle } from "./layout";
import { BookingBadge, Button, Card, DecisionTag, DemoNote, Field, Icon, StatePanel, StatusBadge, VerifyBadge, btn, inputCls } from "./core";
import { ReviewCard, RatingSummary, SafeImg, StepBar } from "./marketplace";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES, GALLERY, SALONS, type Service } from "@/lib/data";
import { useApp, useFmt } from "@/lib/app-store";
import { isoDay } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The signed-in salon in this demo. */
export const ME = SALONS[0];

export const SALON_NAV = [
  { to: "/salon", label: "پیشخوان", icon: "salon" as const, exact: true },
  { to: "/salon/onboarding", label: "راه‌اندازی پروفایل", icon: "add" as const },
  { to: "/salon/bookings", label: "نوبت‌ها", icon: "calendar" as const },
  { to: "/salon/availability", label: "زمان‌های کاری", icon: "clock" as const },
  { to: "/salon/services", label: "خدمات و قیمت", icon: "payment" as const },
  { to: "/salon/portfolio", label: "نمونه‌کار", icon: "gallery" as const },
  { to: "/salon/credentials", label: "مدارک", icon: "verified" as const },
  { to: "/salon/profile", label: "پروفایل سالن", icon: "profile" as const },
  { to: "/salon/reviews", label: "نظرها", icon: "review" as const },
  { to: "/salon/analytics", label: "آمار", icon: "sort" as const },
  { to: "/salon/settings", label: "تنظیمات", icon: "support" as const },
];

export function SalonHome() {
  const fmt = useFmt();
  const { bookings } = useApp();
  const mine = bookings.filter((b) => b.salonId === ME.id);
  const pending = mine.filter((b) => b.status === "pending" || b.status.endsWith("requested"));
  const checklist = [
    { t: "هویت و تماس", done: true, to: "/salon/profile" },
    { t: "خدمات و قیمت", done: true, to: "/salon/services" },
    { t: "نمونه‌کار", done: true, to: "/salon/portfolio" },
    { t: "مدارک", done: ME.status === "verified", to: "/salon/credentials" },
    { t: "زمان‌های کاری", done: false, to: "/salon/availability" },
  ];
  return (
    <>
      <DashTitle title={`سلام، ${ME.name}`} body="خلاصه‌ی امروز سالن شما" action={<Link to="/salons/$slug" params={{ slug: ME.slug }} className={btn({ variant: "outline", size: "sm" })}>دیدن پروفایل عمومی</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: "درخواست‌های در انتظار", v: pending.length, i: "bell" as const },
          { l: "نوبت‌های پیش‌رو", v: mine.filter((b) => b.date >= isoDay(0) && b.status === "confirmed").length, i: "calendar" as const },
          { l: "نظرهای تأییدشده", v: ME.reviews.length, i: "review" as const },
          { l: "کامل‌بودن پروفایل", v: `${fmt.num(ME.profileCompleteness)}٪`, i: "verified" as const },
        ].map((k) => (
          <Card key={k.l} className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name={k.i} /></span>
            <div><p className="text-caption text-muted-foreground">{k.l}</p><p className="text-h2">{typeof k.v === "number" ? fmt.num(k.v) : k.v}</p></div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <h2 className="mb-4 text-h3">درخواست‌های تازه</h2>
          {pending.length === 0 ? <p className="text-muted-foreground">درخواست در انتظاری ندارید.</p> : <BookingTable list={pending} />}
        </Card>
        <Card>
          <h2 className="mb-3 text-h3">فهرست راه‌اندازی</h2>
          <ul className="flex flex-col gap-2">
            {checklist.map((c) => (
              <li key={c.t}>
                <Link to={c.to} className="flex min-h-11 items-center gap-2 rounded-input px-2 text-foreground no-underline hover:bg-muted">
                  <StatusBadge tone={c.done ? "success" : "warning"}>{c.done ? "انجام شد" : "مانده"}</StatusBadge>
                  {c.t}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <DemoNote className="mt-6">پنل سالن در این نسخه نمایشی است؛ ورود سالن و ذخیره‌سازی سرور هنوز متصل نیست.</DemoNote>
    </>
  );
}

function BookingTable({ list }: { list: ReturnType<typeof useApp>["bookings"] }) {
  const fmt = useFmt();
  const { setStatus } = useApp();
  return (
    <ul className="divide-y divide-border">
      {list.map((b) => {
        const svc = ME.services.filter((s) => b.serviceIds.includes(s.id)).map((s) => s.name).join("، ");
        return (
          <li key={b.id} className="flex flex-wrap items-center gap-3 py-3">
            <div className="min-w-48 flex-1">
              <p className="font-semibold">{svc}</p>
              <p className="text-caption text-muted-foreground">{fmt.date(b.date)} · {fmt.digits(b.time)} · {b.customerName} · <bdi dir="ltr" className="font-mono">{b.id}</bdi></p>
            </div>
            <BookingBadge status={b.status} />
            {(b.status === "pending" || b.status === "change-requested") && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setStatus(b.id, "confirmed"); toast.success("نوبت تأیید شد."); }}>تأیید</Button>
                <Button size="sm" variant="danger" onClick={() => { setStatus(b.id, "cancelled"); toast("نوبت رد شد."); }}>رد</Button>
              </div>
            )}
            {b.status === "cancel-requested" && <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "cancelled")}>پذیرش لغو</Button>}
            {b.status === "confirmed" && b.date <= isoDay(0) && <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "completed")}>انجام شد</Button>}
          </li>
        );
      })}
    </ul>
  );
}

export function SalonBookings() {
  const { bookings } = useApp();
  const [f, setF] = useState<"all" | "pending" | "confirmed" | "done">("all");
  const mine = bookings.filter((b) => b.salonId === ME.id).filter((b) =>
    f === "all" ? true : f === "pending" ? b.status === "pending" || b.status.endsWith("requested") : f === "confirmed" ? b.status === "confirmed" : b.status === "completed" || b.status === "cancelled",
  );
  return (
    <>
      <DashTitle title="نوبت‌ها" body="درخواست‌ها را تأیید یا رد کنید." />
      <div className="mb-4 flex flex-wrap gap-2">
        {([["all", "همه"], ["pending", "در انتظار"], ["confirmed", "تأییدشده"], ["done", "پایان‌یافته"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setF(k)} aria-pressed={f === k} className={cn("min-h-10 rounded-full border px-4 text-caption font-semibold", f === k ? "border-selected bg-selected text-selected-foreground" : "border-border-strong")}>{l}</button>
        ))}
      </div>
      <Card>{mine.length === 0 ? <StatePanel icon="calendar" title="نوبتی در این دسته نیست" /> : <BookingTable list={mine} />}</Card>
    </>
  );
}

export function SalonServices() {
  const fmt = useFmt();
  const [list, setList] = useState<Service[]>(ME.services);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [dur, setDur] = useState("60");
  return (
    <>
      <DashTitle title="خدمات و قیمت" body="قیمت ثبت‌شده با تاریخ به‌روزرسانی به مشتری نمایش داده می‌شود." />
      <Card className="mb-6">
        <form
          className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const p = Number(price.replace(/\D/g, ""));
            if (!name.trim() || !p) return toast.error("نام خدمت و قیمت را وارد کنید.");
            setList((l) => [...l, { id: `x${l.length}`, name, category: "nail", durationMin: Number(dur) || 60, price: p, updated: "امروز" }]);
            setName(""); setPrice("");
            toast.success("خدمت افزوده شد.");
          }}
        >
          <Field label="نام خدمت" htmlFor="sn"><input id="sn" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="قیمت (تومان)" htmlFor="sp"><input id="sp" inputMode="numeric" dir="ltr" className={inputCls + " text-start font-mono"} value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          <Field label="مدت (دقیقه)" htmlFor="sd"><input id="sd" inputMode="numeric" dir="ltr" className={inputCls + " text-start font-mono"} value={dur} onChange={(e) => setDur(e.target.value)} /></Field>
          <Button type="submit"><Icon name="add" size={20} /> افزودن</Button>
        </form>
      </Card>
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {list.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div><p className="font-semibold">{s.name}</p><p className="text-caption text-muted-foreground">{fmt.duration(s.durationMin)} · به‌روزرسانی {s.updated}</p></div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{s.priceFrom && "از "}{fmt.price(s.price)}</span>
                <Button size="sm" variant="ghost" onClick={() => setList((l) => l.filter((x) => x.id !== s.id))}>حذف</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

export function SalonPortfolio() {
  const [items, setItems] = useState(GALLERY.filter((g) => g.salonSlug === ME.slug).map((g) => ({ id: g.id, src: g.image, title: g.title })));
  return (
    <>
      <DashTitle title="نمونه‌کار" body="تصویرهای کار خودتان؛ بدون فیلتر تغییر رنگ و روتوش سنگین." />
      <label className="mb-6 flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-border-strong bg-surface p-8 text-center hover:bg-muted">
        <Icon name="upload" size={32} />
        <span className="font-semibold">بارگذاری تصویر</span>
        <span className="text-caption text-muted-foreground">پیش‌نمایش فقط در همین مرورگر؛ ذخیره‌ی فایل هنوز متصل نیست.</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            setItems((x) => [...files.map((f, i) => ({ id: `u${Date.now()}${i}`, src: URL.createObjectURL(f), title: f.name })), ...x]);
          }}
        />
      </label>
      <p className="mb-4 flex flex-wrap items-center gap-2 text-caption text-muted-foreground"><DecisionTag id="BB-5" /> متن رضایت استفاده از تصویر هنوز تأیید نشده است.</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => (
          <figure key={p.id} className="overflow-hidden rounded-card bg-card shadow-card">
            <SafeImg src={p.src} alt={p.title} className="aspect-square w-full" />
            <figcaption className="flex items-center justify-between p-2 text-caption">
              <span className="truncate">{p.title}</span>
              <button onClick={() => setItems((x) => x.filter((i) => i.id !== p.id))} className="text-error-text">حذف</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

export function SalonCredentials() {
  const [files, setFiles] = useState<{ label: string; name: string }[]>([]);
  return (
    <>
      <DashTitle title="مدارک" body="مدارک فقط برای بررسی تیم میکزی است و عمومی نمی‌شود." />
      <Card className="mb-6">
        <ul className="flex flex-col gap-2">
          {ME.credentials.map((c) => (
            <li key={c.label} className="flex flex-wrap items-center justify-between gap-2 py-1">
              <span>{c.label} <span className="text-caption text-muted-foreground">· {c.date}</span></span>
              <VerifyBadge status={c.status} />
            </li>
          ))}
          {files.map((f) => (
            <li key={f.name} className="flex flex-wrap items-center justify-between gap-2 py-1">
              <span>{f.label} <span className="text-caption text-muted-foreground">· {f.name}</span></span>
              <VerifyBadge status="pending" />
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="mb-3 text-h3">ارسال مدرک جدید</h2>
        <CredentialUpload onAdd={(f) => setFiles((x) => [...x, f])} />
      </Card>
      <DemoNote className="mt-4">فایل‌ها در این نسخه آپلود نمی‌شوند. در نسخه‌ی نهایی باید در فضای خصوصی و فقط با دسترسی تیم بررسی نگهداری شوند.</DemoNote>
    </>
  );
}

function CredentialUpload({ onAdd }: { onAdd: (f: { label: string; name: string }) => void }) {
  const [label, setLabel] = useState("مدرک فنی");
  const [file, setFile] = useState<File | null>(null);
  return (
    <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={(e) => { e.preventDefault(); if (!file) return toast.error("فایل را انتخاب کنید."); onAdd({ label, name: file.name }); setFile(null); toast.success("مدرک برای بررسی ثبت شد."); }}>
      <Field label="نوع مدرک" htmlFor="cl">
        <select id="cl" className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)}>
          <option>مدرک فنی</option><option>مجوز بهداشت محل کار</option><option>پروانه‌ی کسب</option><option>گواهی تجهیزات استریل</option>
        </select>
      </Field>
      <Field label="فایل (PDF یا تصویر)" htmlFor="cf"><input id="cf" type="file" accept="image/*,.pdf" className={inputCls + " py-2.5"} onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
      <Button type="submit"><Icon name="upload" size={20} /> ارسال</Button>
    </form>
  );
}

const WEEK = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
export function SalonAvailability() {
  const fmt = useFmt();
  const [days, setDays] = useState(WEEK.map((d, i) => ({ d, on: i < 6, from: "10:00", to: "20:00" })));
  return (
    <>
      <DashTitle title="زمان‌های کاری" body="ساعت‌های کاری هفتگی؛ نوبت‌های خالی از این ساعت‌ها ساخته می‌شوند." />
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {days.map((x, i) => (
            <li key={x.d} className="flex flex-wrap items-center gap-4 p-4">
              <span className="w-24 font-semibold">{x.d}</span>
              <Switch checked={x.on} onCheckedChange={(v) => setDays((a) => a.map((y, j) => (j === i ? { ...y, on: v } : y)))} aria-label={`${x.d} باز است`} />
              {x.on ? (
                <span className="flex items-center gap-2 text-caption">
                  از <input type="time" dir="ltr" value={x.from} onChange={(e) => setDays((a) => a.map((y, j) => (j === i ? { ...y, from: e.target.value } : y)))} className={inputCls + " min-h-10 w-32"} />
                  تا <input type="time" dir="ltr" value={x.to} onChange={(e) => setDays((a) => a.map((y, j) => (j === i ? { ...y, to: e.target.value } : y)))} className={inputCls + " min-h-10 w-32"} />
                </span>
              ) : (
                <span className="text-caption text-muted-foreground">تعطیل</span>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Button className="mt-4" onClick={() => toast.success("زمان‌های کاری ذخیره شد.", { description: `${fmt.num(days.filter((d) => d.on).length)} روز باز در هفته` })}>ذخیره</Button>
    </>
  );
}

export function SalonProfileEdit() {
  const [name, setName] = useState(ME.name);
  const [about, setAbout] = useState(ME.about);
  const [phone, setPhone] = useState("");
  return (
    <>
      <DashTitle title="پروفایل سالن" action={<Link to="/salons/$slug" params={{ slug: ME.slug }} className={btn({ variant: "outline", size: "sm" })}>پیش‌نمایش</Link>} />
      <Card className="grid max-w-3xl gap-4">
        <Field label="نام سالن" htmlFor="pn"><input id="pn" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="درباره‌ی سالن" htmlFor="pa" hint="از ادعاهایی مثل «بهترین» پرهیز کنید؛ درباره‌ی تخصص و روش کار بنویسید."><textarea id="pa" rows={4} className={inputCls + " py-3"} value={about} onChange={(e) => setAbout(e.target.value)} /></Field>
        <Field label="تلفن سالن" htmlFor="pp"><input id="pp" dir="ltr" className={inputCls + " text-start font-mono"} value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="آدرس" htmlFor="pd"><input id="pd" className={inputCls} defaultValue={ME.address} /></Field>
        <fieldset>
          <legend className="mb-2 text-caption font-semibold">دسته‌های خدمت</legend>
          <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => <label key={c.id} className="flex min-h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-caption"><input type="checkbox" defaultChecked={ME.categories.includes(c.id)} /> {c.label}</label>)}</div>
        </fieldset>
        <Button className="justify-self-start" onClick={() => toast.success("پروفایل ذخیره شد.")}>ذخیره‌ی تغییرات</Button>
      </Card>
    </>
  );
}

export function SalonReviews() {
  const [replies, setReplies] = useState<Record<string, string>>({});
  return (
    <>
      <DashTitle title="نظرها" body="به نظرهای تأییدشده پاسخ دهید. نظر را نمی‌توانید حذف یا ویرایش کنید." />
      <RatingSummary salon={ME} />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ME.reviews.map((r) => (
          <div key={r.id} className="flex flex-col gap-2">
            <ReviewCard r={{ ...r, reply: r.reply ?? replies[r.id] }} />
            {!r.reply && !replies[r.id] && <ReplyBox onSend={(t) => { setReplies((x) => ({ ...x, [r.id]: t })); toast.success("پاسخ ثبت شد."); }} />}
          </div>
        ))}
      </div>
    </>
  );
}
function ReplyBox({ onSend }: { onSend: (t: string) => void }) {
  const [t, setT] = useState("");
  return (
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (t.trim()) onSend(t.trim()); }}>
      <label className="sr-only" htmlFor={"rp" + t.length}>پاسخ سالن</label>
      <input className={inputCls} placeholder="پاسخ سالن…" value={t} onChange={(e) => setT(e.target.value)} />
      <Button type="submit" variant="ink">ارسال</Button>
    </form>
  );
}

export function SalonAnalytics() {
  const fmt = useFmt();
  const bars = [12, 18, 9, 22, 16, 25, 14];
  return (
    <>
      <DashTitle title="آمار" body="داده‌ها نمونه هستند؛ آمار واقعی پس از اتصال سرور نمایش داده می‌شود." />
      <div className="grid gap-4 md:grid-cols-3">
        {[["بازدید پروفایل (۷ روز)", 116], ["درخواست رزرو", 21], ["نرخ تأیید", "۸۶٪"]].map(([l, v]) => (
          <Card key={l as string}><p className="text-caption text-muted-foreground">{l}</p><p className="text-h1">{typeof v === "number" ? fmt.num(v) : v}</p><StatusBadge tone="neutral" icon={false}>نمونه</StatusBadge></Card>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="mb-4 text-h3">بازدید روزانه (نمونه)</h2>
        <div className="flex h-48 items-end gap-3" role="img" aria-label="نمودار نمونه‌ی بازدید روزانه">
          {bars.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-label">{fmt.num(b)}</span>
              <div className="w-full rounded-t-sm bg-ink" style={{ height: `${(b / 25) * 100}%` }} />
              <span className="text-label text-muted-foreground">{WEEK[i].slice(0, 2)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function SalonSettings() {
  return (
    <>
      <DashTitle title="تنظیمات" />
      <Card className="flex max-w-2xl flex-col gap-2">
        <label className="flex min-h-12 items-center justify-between">اعلان درخواست رزرو جدید <Switch defaultChecked /></label>
        <label className="flex min-h-12 items-center justify-between">اعلان نظر جدید <Switch defaultChecked /></label>
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-caption text-muted-foreground"><DecisionTag id="BK-1" /> حالت رزرو فوری فعلاً در دسترس نیست؛ همه‌ی رزروها درخواستی‌اند.</div>
        <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground"><DecisionTag id="PY-1" /> تنظیمات پرداخت پس از تعیین روش پرداخت اضافه می‌شود.</div>
      </Card>
    </>
  );
}

const OB_STEPS = ["حساب", "هویت و تماس", "خدمات و قیمت", "نمونه‌کار", "مدارک", "زمان‌ها", "پیش‌نمایش"];
export function SalonOnboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ phone: "", name: "", area: "", address: "", service: "", price: "", photos: 0, cred: "", days: 6 });
  const [submitted, setSubmitted] = useState(false);
  const fmt = useFmt();
  const set = (p: Partial<typeof data>) => setData((d) => ({ ...d, ...p }));
  const valid = [/^09\d{9}$/.test(data.phone.replace(/\D/g, "")), data.name.trim().length > 1 && !!data.area, !!data.service && !!Number(data.price), data.photos > 0, !!data.cred, data.days > 0, true][step];
  if (submitted)
    return (
      <StatePanel
        icon="verified"
        title="پروفایل برای بررسی ارسال شد"
        body="وضعیت: در انتظار تأیید. پس از بررسی مدارک، پروفایل شما قابل انتشار است. (در این نسخه‌ی نمایشی چیزی ارسال نمی‌شود.)"
        action={<Link to="/salon" className={btn()}>رفتن به پیشخوان</Link>}
      />
    );
  return (
    <>
      <DashTitle title="راه‌اندازی پروفایل سالن" body={`قدم ${fmt.digits(step + 1)} از ${fmt.digits(OB_STEPS.length)}`} />
      <div className="mb-6 max-w-4xl"><StepBar steps={OB_STEPS} current={step} /></div>
      <Card className="max-w-2xl">
        <h2 className="mb-4 text-h3">{OB_STEPS[step]}</h2>
        {step === 0 && <Field label="شماره‌ی موبایل مدیر سالن" htmlFor="o0" hint="۱۱ رقم، با ۰۹ شروع می‌شود."><input id="o0" dir="ltr" className={inputCls + " text-start font-mono"} value={data.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>}
        {step === 1 && (
          <div className="grid gap-4">
            <Field label="نام سالن" htmlFor="o1"><input id="o1" className={inputCls} value={data.name} onChange={(e) => set({ name: e.target.value })} /></Field>
            <Field label="محله" htmlFor="o2"><input id="o2" className={inputCls} value={data.area} onChange={(e) => set({ area: e.target.value })} /></Field>
            <Field label="آدرس" htmlFor="o3"><input id="o3" className={inputCls} value={data.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اولین خدمت" htmlFor="o4"><input id="o4" className={inputCls} placeholder="مثلاً ژلیش دست" value={data.service} onChange={(e) => set({ service: e.target.value })} /></Field>
            <Field label="قیمت (تومان)" htmlFor="o5"><input id="o5" dir="ltr" inputMode="numeric" className={inputCls + " text-start font-mono"} value={data.price} onChange={(e) => set({ price: e.target.value.replace(/\D/g, "") })} /></Field>
            <p className="text-caption text-muted-foreground sm:col-span-2">بقیه‌ی خدمات را بعداً در «خدمات و قیمت» اضافه کنید.</p>
          </div>
        )}
        {step === 3 && (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-border-strong p-8 text-center hover:bg-muted">
            <Icon name="camera" size={32} />
            <span className="font-semibold">{data.photos ? `${fmt.num(data.photos)} تصویر انتخاب شد` : "انتخاب تصویر نمونه‌کار"}</span>
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => set({ photos: e.target.files?.length ?? 0 })} />
          </label>
        )}
        {step === 4 && (
          <Field label="مدرک فنی (فایل)" htmlFor="o6" hint="فقط تیم بررسی میکزی به این فایل دسترسی دارد.">
            <input id="o6" type="file" accept="image/*,.pdf" className={inputCls + " py-2.5"} onChange={(e) => set({ cred: e.target.files?.[0]?.name ?? "" })} />
          </Field>
        )}
        {step === 5 && (
          <Field label="تعداد روزهای کاری در هفته" htmlFor="o7">
            <input id="o7" type="number" min={0} max={7} dir="ltr" className={inputCls + " text-start font-mono"} value={data.days} onChange={(e) => set({ days: Number(e.target.value) })} />
          </Field>
        )}
        {step === 6 && (
          <dl className="grid grid-cols-[8rem_1fr] gap-2 text-body">
            <dt className="text-muted-foreground">نام</dt><dd>{data.name}</dd>
            <dt className="text-muted-foreground">محله</dt><dd>{data.area}</dd>
            <dt className="text-muted-foreground">خدمت</dt><dd>{data.service} · {fmt.price(Number(data.price))}</dd>
            <dt className="text-muted-foreground">نمونه‌کار</dt><dd>{fmt.num(data.photos)} تصویر</dd>
            <dt className="text-muted-foreground">مدرک</dt><dd className="truncate">{data.cred}</dd>
            <dt className="text-muted-foreground">وضعیت</dt><dd><VerifyBadge status="pending" /></dd>
          </dl>
        )}
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>قبلی</Button>
          {step < OB_STEPS.length - 1 ? <Button disabled={!valid} onClick={() => setStep((s) => s + 1)}>ادامه</Button> : <Button onClick={() => setSubmitted(true)}>ارسال برای بررسی</Button>}
        </div>
      </Card>
    </>
  );
}
