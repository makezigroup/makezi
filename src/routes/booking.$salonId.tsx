import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/mk/layout";
import { Button, DecisionTag, DemoNote, Field, Icon, StatePanel, btn, inputCls } from "@/components/mk/core";
import { StepBar } from "@/components/mk/marketplace";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSalon, slotsFor, type Booking } from "@/lib/data";
import { useApp, useFmt } from "@/lib/app-store";
import { isoDay, isValidPhone, normalizePhone } from "@/lib/format";
import { DECISIONS } from "@/lib/decisions";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/booking/$salonId")({
  validateSearch: z.object({ service: z.string().optional() }),
  loader: ({ params }) => {
    const s = getSalon(params.salonId);
    if (!s) throw notFound();
    return { name: s.name };
  },
  head: ({ loaderData }) => seo(`رزرو نوبت ${loaderData?.name ?? ""}`, "خدمت، متخصص و زمان را انتخاب کنید و رزرو را ثبت کنید.", { noindex: true }),
  component: BookingFlow,
});

const STEPS = ["خدمت", "متخصص", "زمان", "اطلاعات شما", "بازبینی"];

function BookingFlow() {
  const { salonId } = Route.useParams();
  const { service } = Route.useSearch();
  const salon = getSalon(salonId)!;
  const fmt = useFmt();
  const { addBooking, phone: signedPhone } = useApp();
  const [step, setStep] = useState(0);
  const [svc, setSvc] = useState<string[]>(service ? [service] : []);
  const [staff, setStaff] = useState<string | null>(null);
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => isoDay(i)), []);
  const [day, setDay] = useState(isoDay(0));
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(signedPhone ?? "");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<Booking | null>(null);

  const chosen = salon.services.filter((s) => svc.includes(s.id));
  const total = chosen.reduce((a, s) => a + s.price, 0);
  const duration = chosen.reduce((a, s) => a + s.durationMin, 0);
  const hasFrom = chosen.some((s) => s.priceFrom);
  const slots = slotsFor(salon.id, day);

  const canNext = [svc.length > 0, true, !!time, true, true][step];

  const next = () => {
    if (step === 3) {
      const e: { name?: string; phone?: string } = {};
      if (name.trim().length < 2) e.name = "نام خود را وارد کنید.";
      if (!isValidPhone(phone)) e.phone = "شماره‌ی موبایل ۱۱ رقم است و با ۰۹ شروع می‌شود.";
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = () => {
    const b = addBooking({ salonId: salon.id, serviceIds: svc, staffId: staff, date: day, time: time!, customerName: name, phone: normalizePhone(phone), note, total });
    setDone(b);
  };

  return (
    <SiteLayout footer={false}>
      <div className="container-mk max-w-5xl py-8">
        <Link to="/salons/$slug" params={{ slug: salon.slug }} className="text-caption">بازگشت به {salon.name}</Link>
        <h1 className="mt-2 text-h1">رزرو نوبت</h1>
        <div className="mt-6"><StepBar steps={STEPS} current={step} /></div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <section className="rounded-card bg-card p-5 shadow-card md:p-6" aria-live="polite">
            <h2 className="mb-4 text-h3">{STEPS[step]}</h2>

            {step === 0 && (
              <ul className="flex flex-col gap-2">
                {salon.services.map((s) => {
                  const on = svc.includes(s.id);
                  return (
                    <li key={s.id}>
                      <label className={cn("flex min-h-16 cursor-pointer items-center gap-3 rounded-input border p-3", on ? "border-foreground bg-muted" : "border-border")}>
                        <input type="checkbox" className="size-5 accent-[var(--brand-ink)]" checked={on} onChange={() => setSvc((x) => (on ? x.filter((i) => i !== s.id) : [...x, s.id]))} />
                        <span className="flex-1">
                          <span className="block font-semibold">{s.name}</span>
                          <span className="text-caption text-muted-foreground">{fmt.duration(s.durationMin)}{s.note && ` · ${s.note}`}</span>
                        </span>
                        <span className="font-semibold">{s.priceFrom && "از "}{fmt.price(s.price)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}

            {step === 1 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {[{ id: null, name: "فرقی نمی‌کند", role: "اولین متخصص آزاد" }, ...salon.staff].map((st) => (
                  <button key={st.id ?? "any"} onClick={() => setStaff(st.id)} aria-pressed={staff === st.id} className={cn("flex min-h-16 items-center gap-3 rounded-input border p-3 text-start", staff === st.id ? "border-foreground bg-muted" : "border-border")}>
                    <span className="grid size-10 place-items-center rounded-full bg-muted"><Icon name="profile" size={20} /></span>
                    <span><span className="block font-semibold">{st.name}</span><span className="text-caption text-muted-foreground">{st.role}</span></span>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="listbox" aria-label="روز">
                  {days.map((d) => {
                    const closed = slotsFor(salon.id, d).length === 0;
                    return (
                      <button
                        key={d}
                        role="option"
                        aria-selected={day === d}
                        disabled={closed}
                        onClick={() => { setDay(d); setTime(null); }}
                        className={cn("flex min-w-20 flex-col items-center rounded-input border px-3 py-2 text-caption disabled:opacity-40", day === d ? "border-selected bg-selected text-selected-foreground" : "border-border")}
                      >
                        <span>{fmt.date(d, { weekday: "short" })}</span>
                        <span className="text-h3">{fmt.date(d, { day: "numeric" })}</span>
                        <span>{fmt.date(d, { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>
                {slots.length === 0 ? (
                  <StatePanel icon="calendar" title="این روز نوبت خالی ندارد" body="روز دیگری را انتخاب کنید." />
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="ساعت">
                    {slots.map((t) => (
                      <button key={t} role="radio" aria-checked={time === t} onClick={() => setTime(t)} className={cn("min-h-12 rounded-input border font-mono", time === t ? "border-selected bg-selected text-selected-foreground" : "border-border hover:bg-muted")}>
                        {fmt.digits(t)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <Field label="نام و نام خانوادگی" htmlFor="bn" error={errors.name}>
                  <input id="bn" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} autoComplete="name" />
                </Field>
                <Field label="شماره‌ی موبایل" htmlFor="bp" error={errors.phone} hint="سالن برای هماهنگی نوبت از این شماره استفاده می‌کند.">
                  <input id="bp" dir="ltr" inputMode="tel" className={inputCls + " text-start"} value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} placeholder="09xxxxxxxxx" />
                </Field>
                <Field label="توضیح برای سالن (اختیاری)" htmlFor="bnote">
                  <textarea id="bnote" rows={3} className={inputCls + " py-3"} value={note} onChange={(e) => setNote(e.target.value)} />
                </Field>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-3">
                <p><span className="text-muted-foreground">سالن: </span>{salon.name}</p>
                <p><span className="text-muted-foreground">زمان: </span>{fmt.date(day)}، ساعت {fmt.digits(time ?? "")}</p>
                <p><span className="text-muted-foreground">متخصص: </span>{salon.staff.find((s) => s.id === staff)?.name ?? "فرقی نمی‌کند"}</p>
                <p><span className="text-muted-foreground">نام: </span>{name} · <bdi dir="ltr">{fmt.digits(normalizePhone(phone))}</bdi></p>
                <div className="flex flex-col gap-2 rounded-input bg-muted p-3 text-caption">
                  <span className="flex flex-wrap items-center gap-2 font-semibold"><DecisionTag id="CN-1" /> سیاست لغو هنوز تعیین نشده است.</span>
                  <span className="flex flex-wrap items-center gap-2 font-semibold"><DecisionTag id="PY-1" /> {DECISIONS.onlinePayment ? "" : "پرداخت آنلاین وجود ندارد؛ روش پرداخت هنوز نهایی نشده است."}</span>
                </div>
                {DECISIONS.bookingMode === "request" && <DemoNote>رزرو شما درخواست است و پس از تأیید سالن قطعی می‌شود.</DemoNote>}
              </div>
            )}

            <div className="mt-6 flex justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>قبلی</Button>
              {step < 4 ? (
                <Button onClick={next} disabled={!canNext}>ادامه</Button>
              ) : (
                <Button onClick={submit}>ثبت رزرو</Button>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-card bg-card p-5 shadow-card lg:sticky lg:top-24" aria-label="خلاصه‌ی قیمت">
            <h2 className="text-h3">خلاصه</h2>
            {chosen.length === 0 ? (
              <p className="mt-3 text-caption text-muted-foreground">هنوز خدمتی انتخاب نکرده‌اید.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2 text-caption">
                {chosen.map((s) => (
                  <li key={s.id} className="flex justify-between gap-2"><span>{s.name}</span><span>{s.priceFrom && "از "}{fmt.price(s.price)}</span></li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
              <span>جمع {hasFrom && "(حداقل)"}</span>
              <span>{fmt.price(total)}</span>
            </div>
            <p className="mt-1 text-caption text-muted-foreground">مدت تقریبی: {fmt.duration(duration)}</p>
            <p className="mt-3 text-label text-muted-foreground">قیمت‌ها همان قیمت ثبت‌شده‌ی سالن است. هزینه‌ی دیگری از طرف میکزی اضافه نمی‌شود.</p>
          </aside>
        </div>
      </div>

      <Dialog open={!!done} onOpenChange={() => {}}>
        <DialogContent className="rounded-sheet" dir="rtl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-start">
            <span className="mb-2 grid size-12 place-items-center rounded-full bg-lime text-brand-ink"><Icon name="verified" /></span>
            <DialogTitle className="text-h3">{done?.status === "confirmed" ? "رزرو شد" : "درخواست رزرو ثبت شد"}</DialogTitle>
            <DialogDescription className="text-body">
              {done && `${chosen.map((s) => s.name).join("، ")} در ${salon.name}، ${fmt.date(done.date)} ساعت ${fmt.digits(done.time)}.`}{" "}
              {done?.status === "pending" && "پس از تأیید سالن، وضعیت در «نوبت‌های من» به‌روز می‌شود."}
            </DialogDescription>
          </DialogHeader>
          <p className="text-caption text-muted-foreground">کد رزرو: <bdi dir="ltr" className="font-mono">{done?.id}</bdi></p>
          <div className="flex flex-wrap gap-3">
            <Link to="/my-bookings" className={btn()}>رزرو شما</Link>
            <Link to="/discover" className={btn({ variant: "outline" })}>ادامه‌ی جست‌وجو</Link>
          </div>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
