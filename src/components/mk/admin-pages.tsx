import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashTitle } from "./layout";
import { Button, Card, DemoNote, Field, Icon, StatePanel, StatusBadge, VerifyBadge, btn, inputCls } from "./core";
import { ReviewCard, SafeImg } from "./marketplace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ATTRIBUTES, CATEGORIES, CITIES, IMAGES, IMAGE_LABEL, areaName, getCategory,
  type AttrId, type CategoryId, type ImageKey, type Review, type Salon, type Service, type VerifyStatus,
} from "@/lib/data";
import { OPEN_DECISIONS } from "@/lib/decisions";
import { useApp, useFmt } from "@/lib/app-store";
import { getEvents, track, type TrackedEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { isoDay, normalizePhone } from "@/lib/format";

export const ADMIN_NAV = [
  { to: "/admin", label: "پیشخوان", icon: "salon" as const, exact: true },
  { to: "/admin/salons", label: "سالن‌ها", icon: "location" as const },
  { to: "/admin/reviews", label: "بررسی نظرها", icon: "review" as const },
  { to: "/admin/verifications", label: "تأیید مدارک", icon: "verified" as const },
  { to: "/admin/service-categories", label: "خدمات و قیمت‌ها", icon: "package" as const },
  { to: "/admin/inquiries", label: "درخواست کسب‌وکارها", icon: "support" as const },
  { to: "/admin/analytics", label: "شاخص‌های کاوش", icon: "sort" as const },
];

const Note = () => (
  <DemoNote className="mt-6">تغییرات مهم کارکنان در سابقه‌ی مدیریت ثبت می‌شود.</DemoNote>
);

export function AdminHome() {
  const fmt = useFmt();
  const { salons, reviews, inquiries } = useApp();
  const stats: [string, number, "salon" | "review" | "support" | "verified"][] = [
    ["سالن‌های منتشرشده", salons.filter((s) => s.published).length, "salon"],
    ["نظرهای منتظر بررسی", reviews.filter((r) => r.status === "pending").length, "review"],
    ["نظرهای گزارش‌شده", reviews.filter((r) => r.reports.length && r.status !== "rejected").length, "review"],
    ["درخواست‌های جدید", inquiries.filter((i) => i.status === "new").length, "support"],
  ];
  return (
    <>
      <DashTitle title="پیشخوان مدیریت" body="همه‌ی اعداد از اطلاعات ثبت‌شده محاسبه می‌شوند." action={<Link to="/admin/salons/$id" params={{ id: "new" }} className={btn({ size: "sm" })}><Icon name="add" size={18} /> افزودن سالن</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([l, v, i]) => (
          <Card key={l} className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name={i} /></span>
            <div><p className="text-caption text-muted-foreground">{l}</p><p className="text-h2">{fmt.num(v)}</p></div>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="mb-3 text-h3">تصمیم‌های باز</h2>
        <ul className="flex flex-col divide-y divide-border">
          {OPEN_DECISIONS.map((d) => (
            <li key={d.id} className="flex flex-wrap gap-2 py-2.5 text-caption">
              <bdi dir="ltr" className="font-mono text-muted-foreground">{d.id}</bdi>
              <span className="font-semibold">{d.title}</span>
              <span className="text-muted-foreground">— {d.current}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Note />
    </>
  );
}

export function AdminSalons() {
  const { salons, upsertSalon } = useApp();
  const fmt = useFmt();
  const [q, setQ] = useState("");
  const list = salons.filter((s) => !q || s.name.includes(q));
  return (
    <>
      <DashTitle title="سالن‌ها" body="ایجاد، ویرایش، انتشار و توقف انتشار پروفایل‌ها." action={<Link to="/admin/salons/$id" params={{ id: "new" }} className={btn({ size: "sm" })}><Icon name="add" size={18} /> افزودن سالن</Link>} />
      <label className="sr-only" htmlFor="as-q">جست‌وجو</label>
      <input id="as-q" className={inputCls + " mb-4 max-w-sm"} placeholder="جست‌وجوی نام سالن…" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.length === 0 ? <StatePanel icon="salon" title="سالنی پیدا نشد" /> : (
        <div className="overflow-x-auto rounded-card bg-card shadow-card">
          <table className="w-full min-w-[640px] text-caption">
            <thead className="text-muted-foreground"><tr className="border-b border-border text-start">{["نام", "محله", "مدارک", "خدمات", "آخرین بررسی", "منتشرشده", ""].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3">{areaName(s.city, s.area)}</td>
                  <td className="p-3"><VerifyBadge status={s.status} /></td>
                  <td className="p-3">{fmt.num(s.services.length)}</td>
                  <td className="p-3">{fmt.date(s.checkedAt, { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="p-3"><Switch checked={s.published} aria-label={`انتشار ${s.name}`} onCheckedChange={(v) => { upsertSalon({ ...s, published: v }); toast.success(v ? "منتشر شد." : "از نمایش عمومی خارج شد."); }} /></td>
                  <td className="p-3"><Link to="/admin/salons/$id" params={{ id: s.id }} className={btn({ variant: "outline", size: "sm" })}>ویرایش</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Note />
    </>
  );
}

const blankSalon = (id: string): Salon => ({
  id, slug: "", name: "", published: false, status: "unverified", city: "tehran", area: "area-1", address: "", distanceKm: 1,
  categories: [], image: "interior", about: "", phone: "", openHour: 10, closeHour: 20, closedDay: 5, hours: "", attributes: [],
  map: { x: 50, y: 50 }, services: [], staff: [], portfolio: [], credentials: [], addedAt: isoDay(0), checkedAt: isoDay(0),
});
const WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

type SalonErrors = Partial<Record<"name" | "slug" | "phone" | "address" | "categories" | "hours" | "services", string>>;
export function AdminSalonEdit({ id }: { id: string }) {
  const { salons, upsertSalon } = useApp();
  const nav = useNavigate();
  const existing = salons.find((s) => s.id === id);
  const [s, setS] = useState<Salon>(() => existing ?? blankSalon(`s-${Date.now()}`));
  const [errors, setErrors] = useState<SalonErrors>({});
  useEffect(() => { if (existing) setS(existing); }, [existing?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (id !== "new" && !existing) return <StatePanel icon="salon" title="این سالن پیدا نشد" action={<Link to="/admin/salons" className={btn()}>بازگشت</Link>} />;
  const set = (p: Partial<Salon>) => setS((x) => ({ ...x, ...p }));
  const city = CITIES.find((c) => c.slug === s.city) ?? CITIES[0]!;
  const setSvc = (i: number, p: Partial<Service>) => set({ services: s.services.map((v, j) => (j === i ? { ...v, ...p, updated: isoDay(0) } : v)) });

  const save = async () => {
    const e: SalonErrors = {};
    if (s.name.trim().length < 2) e.name = "نام سالن را بنویسید.";
    if (!/^[a-z0-9-]{3,60}$/.test(s.slug)) e.slug = "فقط حروف کوچک لاتین، عدد و خط تیره (۳ تا ۶۰ نویسه).";
    else if (salons.some((x) => x.slug === s.slug && x.id !== s.id) || CITIES.some((c) => c.slug === s.slug)) e.slug = "این نشانی قبلاً استفاده شده است.";
    if (normalizePhone(s.phone).length < 8) e.phone = "شماره‌ی تماس معتبر نیست.";
    if (s.address.trim().length < 3) e.address = "آدرس را بنویسید.";
    if (s.categories.length === 0) e.categories = "دست‌کم یک دسته انتخاب کنید.";
    if (s.openHour >= s.closeHour) e.hours = "ساعت پایان باید بعد از ساعت شروع باشد.";
    if (s.services.some((v) => !v.name.trim() || v.price < 0 || (v.priceMax != null && v.priceMax < v.price))) e.services = "هر خدمت نام و قیمت معتبر داشته باشد (سقف قیمت کمتر از کف نباشد).";
    if (s.published && s.services.length === 0) e.services = "برای انتشار، دست‌کم یک خدمت لازم است.";
    setErrors(e);
    if (Object.keys(e).length) { toast.error("چند مورد نیاز به اصلاح دارد."); return; }
    try { await upsertSalon({ ...s, phone: normalizePhone(s.phone), checkedAt: isoDay(0) }); toast.success("پروفایل ذخیره شد."); nav({ to: "/admin/salons" }); } catch { toast.error("ذخیره نشد؛ دسترسی و اطلاعات را بررسی کنید."); }
  };

  return (
    <>
      <DashTitle title={existing ? `ویرایش ${existing.name}` : "افزودن سالن"} body="اطلاعات را پس از بررسی با سالن وارد کنید. تاریخ «آخرین بررسی» با ذخیره به‌روز می‌شود." action={<Button onClick={save}>ذخیره</Button>} />
      <div className="grid gap-6">
        <Card className="grid gap-4 md:grid-cols-2">
          <Field label="نام سالن" htmlFor="f-name" error={errors.name}><input id="f-name" className={inputCls} value={s.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          <Field label="نشانی صفحه (لاتین)" htmlFor="f-slug" error={errors.slug} hint="مثل salon-name"><input id="f-slug" dir="ltr" className={inputCls} value={s.slug} onChange={(e) => set({ slug: e.target.value.toLowerCase() })} /></Field>
          <Field label="شهر" htmlFor="f-city"><select id="f-city" className={inputCls} value={s.city} onChange={(e) => set({ city: e.target.value })}>{CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></Field>
          <Field label="محله" htmlFor="f-area"><select id="f-area" className={inputCls} value={s.area} onChange={(e) => set({ area: e.target.value })}>{city.areas.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}</select></Field>
          <Field label="آدرس" htmlFor="f-addr" error={errors.address}><input id="f-addr" className={inputCls} value={s.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          <Field label="تلفن" htmlFor="f-phone" error={errors.phone}><input id="f-phone" dir="ltr" inputMode="tel" className={inputCls} value={s.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="وب‌سایت (اختیاری)" htmlFor="f-web"><input id="f-web" dir="ltr" className={inputCls} value={s.website ?? ""} onChange={(e) => set({ website: e.target.value || undefined })} /></Field>
          <Field label="اینستاگرام (اختیاری)" htmlFor="f-ig"><input id="f-ig" dir="ltr" className={inputCls} value={s.instagram ?? ""} onChange={(e) => set({ instagram: e.target.value.replace("@", "") || undefined })} /></Field>
          <Field label="درباره‌ی سالن" htmlFor="f-about"><textarea id="f-about" rows={3} className={inputCls + " py-3"} value={s.about} onChange={(e) => set({ about: e.target.value })} /></Field>
          <Field label="تصویر اصلی" htmlFor="f-img">
            <div className="flex items-center gap-3">
              <select id="f-img" className={inputCls} value={s.image} onChange={(e) => set({ image: e.target.value as ImageKey })}>{(Object.keys(IMAGES) as ImageKey[]).map((k) => <option key={k} value={k}>{IMAGE_LABEL[k]}</option>)}</select>
              <SafeImg src={s.image} alt="" className="size-12 shrink-0 rounded-input" />
            </div>
          </Field>
        </Card>

        <Card className="grid gap-4 md:grid-cols-3">
          <h2 className="text-h3 md:col-span-3">ساعت کاری و وضعیت</h2>
          <Field label="شروع" htmlFor="f-oh" error={errors.hours}><input id="f-oh" type="number" min={0} max={23} className={inputCls} value={s.openHour} onChange={(e) => set({ openHour: Number(e.target.value) })} /></Field>
          <Field label="پایان" htmlFor="f-ch"><input id="f-ch" type="number" min={1} max={24} className={inputCls} value={s.closeHour} onChange={(e) => set({ closeHour: Number(e.target.value) })} /></Field>
          <Field label="روز تعطیل" htmlFor="f-cd"><select id="f-cd" className={inputCls} value={s.closedDay} onChange={(e) => set({ closedDay: Number(e.target.value) })}>{WEEKDAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></Field>
          <Field label="متن ساعت کاری" htmlFor="f-ht"><input id="f-ht" className={inputCls} value={s.hours} onChange={(e) => set({ hours: e.target.value })} placeholder="شنبه تا پنجشنبه، ۱۰ تا ۲۰" /></Field>
          <Field label="وضعیت مدارک" htmlFor="f-st"><select id="f-st" className={inputCls} value={s.status} onChange={(e) => set({ status: e.target.value as VerifyStatus })}><option value="unverified">تأییدنشده</option><option value="pending">در انتظار تأیید</option><option value="verified">مدارک تأییدشده</option></select></Field>
          <label className="flex min-h-12 items-center justify-between gap-3 self-end rounded-input bg-muted px-3 text-caption font-semibold">منتشرشده <Switch checked={s.published} onCheckedChange={(v) => set({ published: v })} /></label>
        </Card>

        <Card className="flex flex-col gap-4">
          <fieldset>
            <legend className="mb-2 text-caption font-semibold">دسته‌ها</legend>
            <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => <label key={c.id} className="flex min-h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-caption"><input type="checkbox" checked={s.categories.includes(c.id)} onChange={(e) => set({ categories: e.target.checked ? [...s.categories, c.id] : s.categories.filter((x) => x !== c.id) })} /> {c.label}</label>)}</div>
            {errors.categories && <p role="alert" className="mt-1 text-caption text-error-text">{errors.categories}</p>}
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-caption font-semibold">ویژگی‌ها</legend>
            <div className="flex flex-wrap gap-2">{ATTRIBUTES.map((a) => <label key={a.id} className="flex min-h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-caption"><input type="checkbox" checked={s.attributes.includes(a.id)} onChange={(e) => set({ attributes: e.target.checked ? [...s.attributes, a.id] : s.attributes.filter((x) => x !== a.id) as AttrId[] })} /> {a.label}</label>)}</div>
          </fieldset>
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-h3">خدمات و قیمت‌ها</h2>
            <Button variant="outline" size="sm" onClick={() => set({ services: [...s.services, { id: `v${Date.now()}`, name: "", category: s.categories[0] ?? "nail", durationMin: 60, price: 0, updated: isoDay(0) }] })}><Icon name="add" size={18} /> افزودن خدمت</Button>
          </div>
          {errors.services && <p role="alert" className="text-caption text-error-text">{errors.services}</p>}
          {s.services.length === 0 && <p className="text-caption text-muted-foreground">هنوز خدمتی ثبت نشده است.</p>}
          {s.services.map((v, i) => (
            <div key={v.id} className="grid gap-2 rounded-input border border-border p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
              <input aria-label="نام خدمت" className={inputCls} placeholder="نام خدمت" value={v.name} onChange={(e) => setSvc(i, { name: e.target.value })} />
              <select aria-label="دسته" className={inputCls} value={v.category} onChange={(e) => setSvc(i, { category: e.target.value as CategoryId })}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
              <input aria-label="مدت (دقیقه)" type="number" min={5} className={inputCls} value={v.durationMin} onChange={(e) => setSvc(i, { durationMin: Number(e.target.value) })} />
              <input aria-label="قیمت (تومان)" type="number" min={0} step={10000} className={inputCls} value={v.price || ""} placeholder="قیمت" onChange={(e) => setSvc(i, { price: Number(e.target.value) })} />
              <input aria-label="سقف قیمت (اختیاری)" type="number" min={0} step={10000} className={inputCls} value={v.priceMax ?? ""} placeholder="سقف (اختیاری)" onChange={(e) => setSvc(i, { priceMax: e.target.value ? Number(e.target.value) : undefined })} />
              <Button variant="danger" size="sm" onClick={() => set({ services: s.services.filter((_, j) => j !== i) })} aria-label="حذف خدمت">حذف</Button>
              <input aria-label="توضیح قیمت" className={inputCls + " sm:col-span-2 lg:col-span-6"} placeholder="توضیح (مثلاً: بر اساس طول ناخن)" value={v.note ?? ""} onChange={(e) => setSvc(i, { note: e.target.value || undefined, priceFrom: !!e.target.value || !!v.priceMax })} />
            </div>
          ))}
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-h3">نمونه‌کار</h2>
            <Button variant="outline" size="sm" onClick={() => set({ portfolio: [...s.portfolio, { id: `p${Date.now()}`, image: s.image, title: "", category: s.categories[0] ?? "nail", tags: [] }] })}><Icon name="add" size={18} /> افزودن تصویر</Button>
          </div>
          <p className="text-caption text-muted-foreground">فقط تصویر کار واقعی همین سالن و با رضایت مشتری (متن رضایت: تصمیم باز BB-5).</p>
          {s.portfolio.map((p, i) => (
            <div key={p.id} className="grid items-center gap-2 sm:grid-cols-[auto_1fr_1fr_1fr_auto]">
              <SafeImg src={p.image} alt="" className="size-12 rounded-input" />
              <select aria-label="تصویر" className={inputCls} value={p.image} onChange={(e) => set({ portfolio: s.portfolio.map((x, j) => (j === i ? { ...x, image: e.target.value as ImageKey } : x)) })}>{(Object.keys(IMAGES) as ImageKey[]).map((k) => <option key={k} value={k}>{IMAGE_LABEL[k]}</option>)}</select>
              <input aria-label="عنوان" className={inputCls} placeholder="عنوان" value={p.title} onChange={(e) => set({ portfolio: s.portfolio.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
              <select aria-label="دسته" className={inputCls} value={p.category} onChange={(e) => set({ portfolio: s.portfolio.map((x, j) => (j === i ? { ...x, category: e.target.value as CategoryId } : x)) })}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
              <Button variant="danger" size="sm" onClick={() => set({ portfolio: s.portfolio.filter((_, j) => j !== i) })}>حذف</Button>
            </div>
          ))}
        </Card>
        <div className="flex gap-2"><Button onClick={save}>ذخیره</Button><Link to="/admin/salons" className={btn({ variant: "ghost" })}>انصراف</Link></div>
      </div>
    </>
  );
}

export function AdminReviews() {
  const { reviews, salons, updateReview } = useApp();
  const name = (id: string) => salons.find((s) => s.id === id)?.name ?? id;
  const groups: [string, string, Review[]][] = [
    ["pending", "منتظر بررسی", reviews.filter((r) => r.status === "pending")],
    ["reported", "گزارش‌شده", reviews.filter((r) => r.reports.length > 0 && r.status !== "rejected")],
    ["approved", "منتشرشده", reviews.filter((r) => r.status === "approved")],
    ["closed", "ردشده یا پنهان", reviews.filter((r) => r.status === "rejected" || r.status === "hidden")],
  ];
  const act = async (r: Review, patch: Partial<Review>, msg: string) => { try { await updateReview(r.id, patch); toast.success(msg); } catch { toast.error("تغییر ذخیره نشد."); } };
  return (
    <>
      <DashTitle title="بررسی نظرها" body="فقط تیم میکزی می‌تواند نظری را منتشر، رد یا پنهان کند. مدارک مراجعه هرگز عمومی نمی‌شود." />
      <Tabs defaultValue="pending" dir="rtl">
        <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-full bg-muted p-1">
          {groups.map(([v, l, list]) => <TabsTrigger key={v} value={v} className="min-h-10 rounded-full px-4 data-[state=active]:bg-selected data-[state=active]:text-selected-foreground">{l} ({list.length})</TabsTrigger>)}
        </TabsList>
        {groups.map(([v, , list]) => (
          <TabsContent key={v} value={v} className="mt-6">
            {list.length === 0 ? <StatePanel icon="review" title="موردی نیست" /> : (
              <div className="grid gap-4 lg:grid-cols-2">
                {list.map((r) => (
                  <div key={r.id} className="flex flex-col gap-2">
                    <p className="text-caption text-muted-foreground">{name(r.salonId)}{r.evidenceSubmitted && " · مدرک مراجعه پیوست شده (فقط برای تیم)"}</p>
                    <ReviewCard r={r} report={false} />
                    {r.evidenceSubmitted && <Button size="sm" variant="outline" onClick={async()=>{const {data}=await supabase.from('review_evidence').select('storage_path').eq('review_id',r.id);const path=data?.[0]?.storage_path;if(!path)return;const result=await supabase.storage.from('visit-evidence').createSignedUrl(path,60);if(result.data)window.open(result.data.signedUrl,'_blank','noopener');}}>مشاهده‌ی مدرک خصوصی</Button>}
                    <Field label="یادداشت بررسی" htmlFor={'note-'+r.id}><input id={'note-'+r.id} className={inputCls} defaultValue={r.moderationNote ?? ''} onBlur={e=>void act(r,{moderationNote:e.target.value},'یادداشت ذخیره شد.')} /></Field>
                    <Field label="پاسخ رسمی سالن" htmlFor={'reply-'+r.id}><input id={'reply-'+r.id} className={inputCls} defaultValue={r.reply ?? ''} onBlur={e=>void act(r,{reply:e.target.value},'پاسخ ذخیره شد.')} /></Field>
                    {r.reports.length > 0 && <p className="text-caption text-warning-text">گزارش‌ها: {r.reports.map((x) => x.reason).join("، ")}</p>}
                    <div className="flex flex-wrap gap-2">
                      {r.status !== "approved" && <Button size="sm" onClick={() => { act(r, { status: "approved" }, "نظر منتشر شد."); track("review_approved", { review: r.id }); }}>انتشار</Button>}
                      {r.status !== "rejected" && <Button size="sm" variant="danger" onClick={() => act(r, { status: "rejected", moderationNote: "خلاف قوانین محتوا" }, "نظر رد شد.")}>رد</Button>}
                      {r.status === "approved" && <Button size="sm" variant="outline" onClick={() => act(r, { status: "hidden" }, "نظر پنهان شد.")}>پنهان</Button>}
                      {r.kind === "community" ? (
                        <Button size="sm" variant="outline" disabled={!r.evidenceSubmitted} title={r.evidenceSubmitted ? undefined : "مدرکی پیوست نشده است"} onClick={() => act(r, { kind: "verified-visit" }, "برچسب مراجعه‌ی تأییدشده اضافه شد.")}>تأیید مراجعه</Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => act(r, { kind: "community" }, "برچسب برداشته شد.")}>برداشتن برچسب مراجعه</Button>
                      )}
                      {r.reports.length > 0 && <Button size="sm" variant="ghost" onClick={() => act(r, { reports: [] }, "گزارش‌ها بسته شد.")}>بستن گزارش‌ها</Button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Note />
    </>
  );
}

export function AdminVerifications() {
  const { salons, upsertSalon } = useApp();
  const queue = salons.filter((s) => s.status !== "verified");
  return (
    <>
      <DashTitle title="تأیید مدارک" body="مدارک فنی، بهداشتی و پروانه‌ی کسب سالن‌ها. «تأییدشده» یعنی مدارک دیده شده، نه تضمین کیفیت." />
      {queue.length === 0 ? <StatePanel icon="verified" title="صف تأیید خالی است" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {queue.map((s) => (
            <Card key={s.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-h3">{s.name}</h2><VerifyBadge status={s.status} /></div>
              <ul className="flex flex-col gap-1 text-caption">
                {s.credentials.length === 0 ? <li className="text-muted-foreground">مدرکی ثبت نشده است.</li> : s.credentials.map((c) => <li key={c.label} className="flex justify-between gap-2"><span>{c.label} · {c.date}</span><VerifyBadge status={c.status} /></li>)}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={s.credentials.length === 0} onClick={() => { upsertSalon({ ...s, status: "verified", credentials: s.credentials.map((c) => ({ ...c, status: "verified" })) }); toast.success("مدارک تأیید شد."); }}>تأیید مدارک</Button>
                <Button size="sm" variant="danger" onClick={() => { upsertSalon({ ...s, status: "unverified" }); toast("به «تأییدنشده» برگشت."); }}>نیاز به مدرک بیشتر</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Note />
    </>
  );
}

export function AdminCategories() {
  const { salons } = useApp();
  const fmt = useFmt();
  const rows = salons.flatMap((s) => s.services.map((v) => ({ s, v })));
  const stale = rows.filter((r) => r.v.updated < isoDay(-90)).length;
  return (
    <>
      <DashTitle title="خدمات و قیمت‌ها" body={`${fmt.num(rows.length)} خدمت ثبت‌شده · ${fmt.num(stale)} قیمت بیش از ۹۰ روز بررسی نشده است.`} />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Card key={c.id} className="flex items-center gap-3 p-4">
            <Icon name={c.icon} />
            <div><p className="font-semibold">{c.label}</p><p className="text-caption text-muted-foreground">{fmt.num(rows.filter((r) => r.v.category === c.id).length)} خدمت · {fmt.num(salons.filter((s) => s.categories.includes(c.id)).length)} سالن</p></div>
          </Card>
        ))}
      </div>
      <div className="overflow-x-auto rounded-card bg-card shadow-card">
        <table className="w-full min-w-[640px] text-caption">
          <thead className="text-muted-foreground"><tr className="border-b border-border">{["خدمت", "دسته", "سالن", "قیمت", "آخرین بررسی", ""].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(({ s, v }) => (
              <tr key={s.id + v.id} className="border-b border-border last:border-0">
                <td className="p-3 font-semibold">{v.name}</td>
                <td className="p-3">{getCategory(v.category)?.label}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{v.priceFrom && "از "}{fmt.price(v.price)}{v.priceMax ? ` تا ${fmt.price(v.priceMax)}` : ""}</td>
                <td className="p-3">{v.updated < isoDay(-90) ? <StatusBadge tone="warning">{fmt.date(v.updated, { day: "numeric", month: "short" })}</StatusBadge> : fmt.date(v.updated, { day: "numeric", month: "short" })}</td>
                <td className="p-3"><Link to="/admin/salons/$id" params={{ id: s.id }} className={btn({ variant: "ghost", size: "sm" })}>ویرایش</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note />
    </>
  );
}

export function AdminInquiries() {
  const { inquiries, updateInquiry } = useApp();
  const fmt = useFmt();
  const LABEL = { new: "جدید", contacted: "تماس گرفته شد", accepted: "پذیرفته‌شده", closed: "بسته‌شده" } as const;
  return (
    <>
      <DashTitle title="درخواست کسب‌وکارها" body="درخواست‌های معرفی سالن یا اصلاح اطلاعات که از فرم «معرفی سالن» رسیده است." />
      {inquiries.length === 0 ? <StatePanel icon="support" title="درخواستی نرسیده است" body="درخواست‌های فرم «معرفی سالن به میکزی» اینجا نمایش داده می‌شوند." action={<Link to="/for-salons" className={btn({ variant: "outline" })}>دیدن فرم</Link>} /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {inquiries.map((q) => (
            <Card key={q.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-h3">{q.business}</h2>
                <StatusBadge tone={q.status === "new" ? "info" : q.status === "contacted" ? "warning" : "neutral"}>{LABEL[q.status]}</StatusBadge>
              </div>
              <p className="text-caption text-muted-foreground"><bdi dir="ltr" className="font-mono">{q.id}</bdi> · {fmt.date(q.date, { day: "numeric", month: "long" })} · {q.name} · <bdi dir="ltr">{fmt.digits(q.phone)}</bdi></p>
              <p className="text-caption">{CITIES.find((c) => c.slug === q.city)?.name} {q.area && `· ${q.area}`} {q.categories.length > 0 && `· ${q.categories.map((c) => getCategory(c)?.label).join("، ")}`}</p>
              {q.message && <p>{q.message}</p>}
              <Field label="یادداشت داخلی" htmlFor={q.id}><input id={q.id} className={inputCls} defaultValue={q.internalNote ?? ""} onBlur={e=>void updateInquiry(q.id,{internalNote:e.target.value}).catch(()=>toast.error("یادداشت ذخیره نشد."))}/></Field>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(LABEL) as (keyof typeof LABEL)[]).filter((k) => k !== q.status).map((k) => <Button key={k} size="sm" variant="outline" onClick={() => updateInquiry(q.id, { status: k })}>{LABEL[k]}</Button>)}
                <Link to="/admin/salons/$id" params={{ id: "new" }} className={btn({ variant: "ghost", size: "sm" })}>ساخت پروفایل</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Note />
    </>
  );
}

export function AdminAnalytics() {
  const fmt = useFmt();
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  useEffect(() => { void supabase.from('discovery_events').select('name,props,created_at').order('created_at',{ascending:false}).range(0,999).then(({data})=>setEvents((data ?? []).map(x=>({name:x.name as TrackedEvent['name'],at:x.created_at})))); }, []);
  const counts = events.reduce<Record<string, number>>((a, e) => ({ ...a, [e.name]: (a[e.name] ?? 0) + 1 }), {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <>
      <DashTitle title="شاخص‌های کاوش" body="رویدادهای ثبت‌شده‌ی میکزی. اطلاعات شخصی (نام، شماره، متن نظر) در رویدادها ذخیره نمی‌شود." />
      {rows.length === 0 ? <StatePanel icon="sort" title="هنوز رویدادی ثبت نشده" body="در سایت جست‌وجو کنید، صفحه‌ی سالنی را باز کنید یا سالن‌ها را مقایسه کنید." /> : (
        <Card>
          <ul className="flex flex-col divide-y divide-border">
            {rows.map(([n, c]) => <li key={n} className="flex justify-between py-2.5 text-caption"><bdi dir="ltr" className="font-mono">{n}</bdi><span className="font-semibold">{fmt.num(c)}</span></li>)}
          </ul>
        </Card>
      )}
      <Note />
    </>
  );
}
