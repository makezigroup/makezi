import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { BookingBadge, Button, DemoNote, Field, Icon, StatePanel, btn, inputCls } from "@/components/mk/core";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DECISIONS } from "@/lib/decisions";
import { getSalon, slotsFor, type Booking } from "@/lib/data";
import { useApp, useFmt } from "@/lib/app-store";
import { isoDay } from "@/lib/format";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-bookings")({
  head: () => seo("نوبت‌های من", "نوبت‌های فعال و گذشته‌ی خود را ببینید، درخواست تغییر یا لغو ثبت کنید و نظر بنویسید.", { noindex: true }),
  component: MyBookings,
});

const ACTIVE = ["pending", "confirmed", "change-requested", "cancel-requested"];

function MyBookings() {
  const { bookings } = useApp();
  const today = isoDay(0);
  const active = bookings.filter((b) => ACTIVE.includes(b.status) && b.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = bookings.filter((b) => !active.includes(b));
  return (
    <SiteLayout>
      <PageIntro title="نوبت‌های من" />
      <div className="container-mk">
        <Tabs defaultValue="active" dir="rtl">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="active" className="rounded-full px-4 data-[state=active]:bg-selected data-[state=active]:text-selected-foreground">فعال</TabsTrigger>
            <TabsTrigger value="past" className="rounded-full px-4 data-[state=active]:bg-selected data-[state=active]:text-selected-foreground">گذشته</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6 flex flex-col gap-4">
            {active.length === 0 ? <StatePanel icon="calendar" title="نوبت فعالی ندارید" action={<Link to="/discover" className={btn()}>جست‌وجوی سالن</Link>} /> : active.map((b) => <BookingRow key={b.id} b={b} />)}
          </TabsContent>
          <TabsContent value="past" className="mt-6 flex flex-col gap-4">
            {past.length === 0 ? <StatePanel icon="calendar" title="نوبت گذشته‌ای ندارید" /> : past.map((b) => <BookingRow key={b.id} b={b} />)}
          </TabsContent>
        </Tabs>
        <DemoNote className="mt-6">نوبت‌ها فقط در همین مرورگر ذخیره می‌شوند؛ اتصال به سالن و پیامک هنوز فعال نیست.</DemoNote>
      </div>
    </SiteLayout>
  );
}

function BookingRow({ b }: { b: Booking }) {
  const fmt = useFmt();
  const { updateBooking } = useApp();
  const salon = getSalon(b.salonId);
  const [mode, setMode] = useState<null | "change" | "cancel" | "review">(null);
  if (!salon) return null;
  const services = salon.services.filter((s) => b.serviceIds.includes(s.id));
  const canChange = b.status === "pending" || b.status === "confirmed";
  return (
    <article className="flex flex-col gap-4 rounded-card bg-card p-5 shadow-card md:flex-row md:items-center">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <BookingBadge status={b.status} />
          <bdi dir="ltr" className="font-mono text-label text-muted-foreground">{b.id}</bdi>
        </div>
        <Link to="/salons/$slug" params={{ slug: salon.slug }} className="text-h3 text-foreground no-underline">{salon.name}</Link>
        <p className="text-muted-foreground">{services.map((s) => s.name).join("، ")}</p>
        <p className="flex items-center gap-1 text-caption"><Icon name="calendar" size={16} /> {fmt.date(b.date)}، ساعت {fmt.digits(b.time)} · {fmt.price(b.total)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {canChange && <Button size="sm" variant="outline" onClick={() => setMode("change")}>درخواست تغییر زمان</Button>}
        {canChange && <Button size="sm" variant="danger" onClick={() => setMode("cancel")}>درخواست لغو</Button>}
        {b.status === "completed" && !b.reviewed && <Button size="sm" onClick={() => setMode("review")}><Icon name="review" size={18} /> نوشتن نظر</Button>}
        {b.status === "completed" && b.reviewed && <span className="text-caption text-success-text">نظر شما ثبت شد</span>}
        {b.status === "completed" && <Link to="/booking/$salonId" params={{ salonId: salon.id }} className={btn({ variant: "ghost", size: "sm" })}>رزرو دوباره</Link>}
      </div>

      <Dialog open={mode === "change"} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent dir="rtl" className="rounded-sheet">
          <DialogHeader className="text-start"><DialogTitle>درخواست تغییر زمان</DialogTitle></DialogHeader>
          <Reschedule
            b={b}
            onDone={(date, time) => {
              updateBooking(b.id, { status: "change-requested", date, time });
              setMode(null);
              toast.success("درخواست تغییر زمان ثبت شد.", { description: "پس از بررسی سالن، وضعیت به‌روز می‌شود." });
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "cancel"} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent dir="rtl" className="rounded-sheet">
          <DialogHeader className="text-start"><DialogTitle>درخواست لغو نوبت</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">
            {DECISIONS.cancellationPolicyApproved ? "" : "سیاست لغو هنوز تعیین نشده است. درخواست شما برای سالن فرستاده می‌شود و هزینه‌ای از طرف میکزی محاسبه نمی‌شود."}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setMode(null)}>انصراف</Button>
            <Button variant="danger" onClick={() => { updateBooking(b.id, { status: "cancel-requested" }); setMode(null); toast("درخواست لغو ثبت شد."); }}>ثبت درخواست لغو</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "review"} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent dir="rtl" className="rounded-sheet">
          <DialogHeader className="text-start"><DialogTitle>نظر درباره‌ی {salon.name}</DialogTitle></DialogHeader>
          <ReviewForm onDone={() => { updateBooking(b.id, { reviewed: true }); setMode(null); toast.success("نظر شما ثبت شد.", { description: "پس از بررسی محتوا منتشر می‌شود." }); }} />
        </DialogContent>
      </Dialog>
    </article>
  );
}

function Reschedule({ b, onDone }: { b: Booking; onDone: (d: string, t: string) => void }) {
  const fmt = useFmt();
  const days = Array.from({ length: 10 }, (_, i) => isoDay(i + 1));
  const [day, setDay] = useState(isoDay(1));
  const [time, setTime] = useState<string | null>(null);
  const slots = slotsFor(b.salonId, day);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button key={d} disabled={slotsFor(b.salonId, d).length === 0} onClick={() => { setDay(d); setTime(null); }} className={cn("min-w-16 rounded-input border px-2 py-2 text-caption disabled:opacity-40", d === day ? "border-selected bg-selected text-selected-foreground" : "border-border")}>
            {fmt.date(d, { weekday: "short", day: "numeric" })}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((t) => (
          <button key={t} onClick={() => setTime(t)} aria-pressed={time === t} className={cn("min-h-11 rounded-input border font-mono", time === t ? "border-selected bg-selected text-selected-foreground" : "border-border")}>{fmt.digits(t)}</button>
        ))}
      </div>
      <Button disabled={!time} onClick={() => time && onDone(day, time)}>ثبت درخواست</Button>
    </div>
  );
}

function ReviewForm({ onDone }: { onDone: () => void }) {
  const fmt = useFmt();
  const [vals, setVals] = useState<number[]>([0, 0, 0, 0]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (vals.some((v) => v === 0)) return setErr("به همه‌ی ابعاد امتیاز دهید.");
        if (text.trim().length < 10) return setErr("نظر دست‌کم ۱۰ نویسه باشد.");
        onDone();
      }}
    >
      {DECISIONS.ratingDimensions.map((d, i) => (
        <fieldset key={d} className="flex flex-wrap items-center justify-between gap-2">
          <legend className="sr-only">{d}</legend>
          <span className="text-caption font-semibold">{d}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} aria-label={`${d}: ${n} از ۵`} aria-pressed={vals[i] === n} onClick={() => setVals((v) => v.map((x, j) => (j === i ? n : x)))} className={cn("grid size-10 place-items-center rounded-full border font-mono text-caption", (vals[i] ?? 0) >= n ? "border-selected bg-selected text-selected-foreground" : "border-border")}>
                {fmt.digits(n)}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <Field label="نظر شما" htmlFor="rv" error={err}>
        <textarea id="rv" rows={4} className={inputCls + " py-3"} value={text} onChange={(e) => setText(e.target.value)} placeholder="درباره‌ی همین نوبت بنویسید: قیمت، زمان، نتیجه." />
      </Field>
      <p className="text-label text-muted-foreground">نام ابعاد امتیاز هنوز نهایی نشده است (BB-4).</p>
      <Button type="submit">ثبت نظر</Button>
    </form>
  );
}
