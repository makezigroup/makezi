import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "./layout";
import { Button, Chip, DemoNote, Field, Icon, SectionHead, StatePanel, StatusBadge, VerifyBadge, btn, inputCls } from "./core";
import { CompareToggle, OpenBadge, RatingInline, RatingSummary, ReviewCard, SafeImg, SalonCard, SaveButton, StarsInput } from "./marketplace";
import { Crumbs } from "./location-pages";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ATTRIBUTES, CATEGORIES, areaName, getCategory, getCity, priceFrom, reviewOverall, type Salon } from "@/lib/data";
import { DECISIONS } from "@/lib/decisions";
import { hasReviewed, publicReviews, validateReview } from "@/lib/rules";
import { useApp, useFmt, usePublicSalons } from "@/lib/app-store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const directionsUrl = (s: Salon) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`;

const SECTIONS = [
  ["about", "درباره"],
  ["services", "خدمات و قیمت"],
  ["portfolio", "نمونه‌کار"],
  ["reviews", "نظرها"],
  ["contact", "آدرس و تماس"],
] as const;

export function SalonProfile({ salon }: { salon: Salon }) {
  const fmt = useFmt();
  const all = usePublicSalons();
  const { reviews } = useApp();
  const [lightbox, setLightbox] = useState<number | null>(null);
  useEffect(() => { track("salon_profile_viewed", { salon: salon.id }); }, [salon.id]);
  const city = getCity(salon.city);
  const similar = all
    .filter((s) => s.id !== salon.id && (s.area === salon.area || s.categories.some((c) => salon.categories.includes(c))))
    .sort((a, b) => Number(b.area === salon.area) - Number(a.area === salon.area) || Math.abs(priceFrom(a) - priceFrom(salon)) - Math.abs(priceFrom(b) - priceFrom(salon)))
    .slice(0, 4);
  const grouped = CATEGORIES.map((c) => ({ c, list: salon.services.filter((v) => v.category === c.id) })).filter((g) => g.list.length);

  return (
    <SiteLayout>
      <div className="container-mk pt-6">
        <Crumbs
          items={[
            { label: "سالن‌ها", link: <Link to="/salons" className="text-muted-foreground">سالن‌ها</Link> },
            ...(city ? [{ label: city.name, link: <Link to="/salons/$slug" params={{ slug: city.slug }} className="text-muted-foreground">{city.name}</Link> }, { label: areaName(salon.city, salon.area), link: <Link to="/salons/$slug/$area" params={{ slug: city.slug, area: salon.area }} className="text-muted-foreground">{areaName(salon.city, salon.area)}</Link> }] : []),
            { label: salon.name },
          ]}
        />
        {!salon.published && <DemoNote className="mb-4">این پروفایل منتشر نشده و فقط برای پیش‌نمایش مدیریت قابل دیدن است.</DemoNote>}

        {/* A. Header */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid grid-cols-3 gap-3">
            <SafeImg src={salon.image} alt={`تصویر اصلی ${salon.name}`} eager className="col-span-2 row-span-2 aspect-[4/5] w-full rounded-card" />
            {salon.portfolio.slice(0, 2).map((p, i) => (
              <button key={p.id} type="button" onClick={() => { setLightbox(i); track("portfolio_viewed", { salon: salon.id }); }} className="overflow-hidden rounded-card" aria-label={`بزرگ‌نمایی ${p.title}`}>
                <SafeImg src={p.image} alt={p.title} className="aspect-square w-full" />
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <VerifyBadge status={salon.status} />
              {salon.categories.map((c) => <StatusBadge key={c} tone="neutral" icon={false}>{getCategory(c)?.label}</StatusBadge>)}
            </div>
            <h1 className="text-h1">{salon.name}</h1>
            <RatingInline salonId={salon.id} />
            <p className="flex items-center gap-2 text-muted-foreground"><Icon name="location" size={20} /> {salon.address}</p>
            <p className="flex flex-wrap items-center gap-2 text-muted-foreground"><Icon name="clock" size={20} /> {salon.hours} · <OpenBadge salon={salon} /></p>
            {salon.services.length > 0 && <p className="text-caption">بازه‌ی قیمت اعلام‌شده: از {fmt.price(priceFrom(salon))}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={`tel:${salon.phone}`} onClick={() => track("phone_contact_clicked", { salon: salon.id })} className={btn({ size: "lg" }) + " flex-1"}>
                <Icon name="call" size={20} /> تماس با سالن
              </a>
              <a href={directionsUrl(salon)} target="_blank" rel="noopener noreferrer" onClick={() => track("directions_clicked", { salon: salon.id })} className={btn({ variant: "outline", size: "lg" })}>
                <Icon name="route" size={20} /> مسیریابی
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <SaveButton id={salon.id} label />
              <CompareToggle id={salon.id} size="lg" />
              <button
                className={btn({ variant: "ghost", size: "lg" })}
                onClick={() => { void navigator.clipboard?.writeText(window.location.href); toast.success("پیوند سالن کپی شد."); }}
                aria-label="کپی پیوند سالن"
              >
                <Icon name="share" size={20} />
              </button>
            </div>
            <p className="text-label text-muted-foreground">آخرین بررسی اطلاعات توسط تیم میکزی: {fmt.date(salon.checkedAt, { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>

        <nav aria-label="بخش‌های صفحه" className="sticky top-16 z-10 -mx-4 mt-10 overflow-x-auto border-b border-border bg-background/95 px-4 backdrop-blur">
          <ul className="flex gap-1 py-2">
            {SECTIONS.map(([id, l]) => (
              <li key={id}><a href={`#${id}`} className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-caption font-semibold text-foreground no-underline hover:bg-muted">{l}</a></li>
            ))}
          </ul>
        </nav>

        {/* B. About */}
        <section id="about" className="scroll-mt-32 py-10">
          <h2 className="mb-4 text-h2">درباره‌ی سالن</h2>
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-4">
              <p>{salon.about}</p>
              {salon.attributes.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {salon.attributes.map((a) => <li key={a}><StatusBadge tone="neutral">{ATTRIBUTES.find((x) => x.id === a)?.label}</StatusBadge></li>)}
                </ul>
              )}
              {salon.staff.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {salon.staff.map((st) => (
                    <div key={st.id} className="flex items-start gap-3 rounded-card bg-card p-4 shadow-card">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted"><Icon name="profile" size={20} /></span>
                      <div><p className="font-semibold">{st.name}</p><p className="text-caption text-muted-foreground">{st.role} · {fmt.num(st.years)} سال سابقه</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-card bg-card p-5 shadow-card">
              <h3 className="mb-3 text-h3">مدارک</h3>
              {salon.credentials.length === 0 ? <p className="text-caption text-muted-foreground">مدرکی ثبت نشده است.</p> : (
                <ul className="flex flex-col gap-2 text-caption">
                  {salon.credentials.map((c) => <li key={c.label} className="flex flex-wrap items-center justify-between gap-2"><span>{c.label}</span><VerifyBadge status={c.status} /></li>)}
                </ul>
              )}
              <p className="mt-3 text-label text-muted-foreground">«تأییدشده» یعنی مدارک را تیم میکزی دیده است؛ نه تضمین کیفیت کار.</p>
            </div>
          </div>
        </section>

        {/* C. Services */}
        <section id="services" className="scroll-mt-32 py-10">
          <h2 className="mb-1 text-h2">خدمات و قیمت</h2>
          <p className="mb-4 text-caption text-muted-foreground">قیمت‌ها همان است که سالن در تاریخ بررسی اعلام کرده؛ قیمت نهایی را سالن تعیین می‌کند و میکزی آن را تضمین نمی‌کند.</p>
          {grouped.length === 0 ? <StatePanel icon="package" title="هنوز خدمتی ثبت نشده است" /> : (
            <div className="flex flex-col gap-6">
              {grouped.map(({ c, list }) => (
                <div key={c.id}>
                  <h3 className="mb-2 flex items-center gap-2 text-h3"><Icon name={c.icon} size={20} /> {c.label}</h3>
                  <ul className="divide-y divide-border rounded-card bg-card shadow-card">
                    {list.map((v) => (
                      <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div>
                          <Link to="/salons/$slug/services/$serviceId" params={{ slug: salon.slug, serviceId: v.id }} className="font-semibold text-foreground">{v.name}</Link>
                          <p className="text-caption text-muted-foreground">حدود {fmt.duration(v.durationMin)} · بررسی {fmt.date(v.updated, { day: "numeric", month: "long" })}{v.note && ` · ${v.note}`}</p>
                        </div>
                        <span className="font-semibold">{v.priceFrom && !v.priceMax && "از "}{fmt.price(v.price)}{v.priceMax ? ` تا ${fmt.price(v.priceMax)}` : ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* D. Portfolio */}
        <section id="portfolio" className="scroll-mt-32 py-10">
          <h2 className="mb-4 text-h2">نمونه‌کار</h2>
          {salon.portfolio.length === 0 ? <StatePanel icon="gallery" title="هنوز نمونه‌کاری ثبت نشده است" /> : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {salon.portfolio.map((p, i) => (
                <figure key={p.id}>
                  <button type="button" className="block w-full overflow-hidden rounded-card" onClick={() => { setLightbox(i); track("portfolio_viewed", { salon: salon.id }); }} aria-label={`بزرگ‌نمایی ${p.title}`}>
                    <SafeImg src={p.image} alt={`${p.title} — ${salon.name}`} className="aspect-[4/5] w-full transition-transform ease-mk hover:scale-[1.02]" />
                  </button>
                  <figcaption className="mt-2 text-caption"><span className="font-semibold">{p.title}</span> · {getCategory(p.category)?.label}</figcaption>
                </figure>
              ))}
            </div>
          )}
          <p className="mt-3 text-label text-muted-foreground">تصاویر این نسخه نمونه‌اند. در نسخه‌ی نهایی فقط کار واقعی همین سالن منتشر می‌شود.</p>
          <Dialog open={lightbox != null} onOpenChange={(o) => !o && setLightbox(null)}>
            <DialogContent className="max-w-3xl p-2" dir="rtl">
              {lightbox != null && salon.portfolio[lightbox] && (
                <>
                  <DialogTitle className="sr-only">{salon.portfolio[lightbox]!.title}</DialogTitle>
                  <SafeImg src={salon.portfolio[lightbox]!.image} alt={salon.portfolio[lightbox]!.title} className="max-h-[75vh] w-full rounded-card object-contain" />
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="font-semibold">{salon.portfolio[lightbox]!.title}</span>
                    <span className="flex gap-1">
                      <Button size="sm" variant="ghost" disabled={lightbox === 0} onClick={() => setLightbox(lightbox - 1)}>قبلی</Button>
                      <Button size="sm" variant="ghost" disabled={lightbox === salon.portfolio.length - 1} onClick={() => setLightbox(lightbox + 1)}>بعدی</Button>
                    </span>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>

        {/* E. Reviews */}
        <ReviewsSection salon={salon} total={publicReviews(reviews, salon.id).length} />

        {/* F. Contact */}
        <section id="contact" className="scroll-mt-32 py-10">
          <h2 className="mb-4 text-h2">آدرس و تماس</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ul className="flex flex-col gap-3 rounded-card bg-card p-5 shadow-card">
              <li className="flex items-center gap-2"><Icon name="location" size={20} /> {salon.address}</li>
              <li className="flex items-center gap-2"><Icon name="call" size={20} /> <a href={`tel:${salon.phone}`} onClick={() => track("phone_contact_clicked", { salon: salon.id })}><bdi dir="ltr">{fmt.digits(salon.phone)}</bdi></a></li>
              <li className="flex items-center gap-2"><Icon name="clock" size={20} /> {salon.hours}</li>
              {salon.website && <li className="flex items-center gap-2"><Icon name="share" size={20} /> <a href={salon.website} target="_blank" rel="noopener noreferrer nofollow" onClick={() => track("website_clicked", { salon: salon.id })}>وب‌سایت سالن</a></li>}
              {salon.instagram && <li className="flex items-center gap-2"><Icon name="camera" size={20} /> <a href={`https://instagram.com/${salon.instagram}`} target="_blank" rel="noopener noreferrer nofollow" onClick={() => track("website_clicked", { salon: salon.id, kind: "instagram" })}><bdi dir="ltr">@{salon.instagram}</bdi></a></li>}
            </ul>
            <div className="relative overflow-hidden rounded-card bg-muted" style={{ backgroundImage: "url(/pattern-open.svg)", backgroundSize: "cover" }}>
              <span className="absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-ink-foreground shadow-modal" style={{ left: `${salon.map.x}%`, top: `${salon.map.y}%` }} aria-hidden><Icon name="salon" size={18} /></span>
              <a href={directionsUrl(salon)} target="_blank" rel="noopener noreferrer" onClick={() => track("directions_clicked", { salon: salon.id })} className={btn({ size: "sm" }) + " absolute bottom-3 start-3"}>مسیریابی در نقشه</a>
              <div className="aspect-[16/9]" />
            </div>
          </div>
          <DemoNote className="mt-4">شماره‌ها و آدرس‌های این نسخه نمونه‌اند و به سالن واقعی وصل نیستند.</DemoNote>
        </section>

        {/* G. Similar */}
        {similar.length > 0 && (
          <section className="py-10">
            <SectionHead title="سالن‌های مشابه" body="هم‌محله یا با خدمات مشابه، نزدیک‌ترین قیمت شروع اول." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{similar.map((s) => <SalonCard key={s.id} salon={s} compact />)}</div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

function ReviewsSection({ salon, total }: { salon: Salon; total: number }) {
  const { reviews } = useApp();
  const [kind, setKind] = useState<"all" | "verified-visit">("all");
  const [sort, setSort] = useState<"new" | "high" | "low">("new");
  const [shown, setShown] = useState(4);
  const list = useMemo(() => {
    let l = publicReviews(reviews, salon.id);
    if (kind !== "all") l = l.filter((r) => r.kind === kind);
    return [...l].sort((a, b) => (sort === "new" ? b.date.localeCompare(a.date) : sort === "high" ? reviewOverall(b) - reviewOverall(a) : reviewOverall(a) - reviewOverall(b)));
  }, [reviews, salon.id, kind, sort]);
  useEffect(() => {
    const el = document.getElementById("reviews");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { track("reviews_viewed", { salon: salon.id }); io.disconnect(); } });
    io.observe(el);
    return () => io.disconnect();
  }, [salon.id]);
  return (
    <section id="reviews" className="scroll-mt-32 py-10">
      <h2 className="mb-4 text-h2">نظرها و امتیاز</h2>
      <RatingSummary salonId={salon.id} />
      <details className="mt-3 text-caption text-muted-foreground">
        <summary className="cursor-pointer font-semibold">امتیاز چطور محاسبه می‌شود؟</summary>
        <p className="mt-2 max-w-2xl">هر نظر در {DECISIONS.ratingDimensions.length} بخش از ۱ تا ۵ امتیاز می‌گیرد. امتیاز کلی میانگین ساده‌ی نظرهای منتشرشده است و تا {DECISIONS.minReviewsForScore} نظر نمایش داده نمی‌شود. هر نظر پیش از انتشار توسط تیم میکزی بررسی می‌شود. «مراجعه‌ی تأییدشده» یعنی نویسنده مدرک مراجعه فرستاده و تیم آن را دیده است. سالن نمی‌تواند نظری را حذف کند.</p>
      </details>
      {total > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip active={kind === "all"} onClick={() => setKind("all")}>همه</Chip>
          <Chip active={kind === "verified-visit"} onClick={() => setKind("verified-visit")}>فقط مراجعه‌ی تأییدشده</Chip>
          <span className="flex-1" />
          <label className="flex items-center gap-2 text-caption">ترتیب:
            <select className={inputCls + " min-h-10 w-auto py-1"} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="new">جدیدترین</option><option value="high">بیشترین امتیاز</option><option value="low">کمترین امتیاز</option>
            </select>
          </label>
        </div>
      )}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list.slice(0, shown).map((r) => <ReviewCard key={r.id} r={r} />)}
      </div>
      {total > 0 && list.length === 0 && <p className="mt-4 text-muted-foreground">نظری با این فیلتر نیست.</p>}
      {list.length > shown && <Button variant="outline" className="mt-4" onClick={() => setShown(shown + 4)}>نظرهای بیشتر</Button>}
      <ReviewForm salon={salon} />
    </section>
  );
}

function ReviewForm({ salon }: { salon: Salon }) {
  const { phone, reviews, addReview, displayName } = useApp();
  const [open, setOpen] = useState(false);
  const [service, setService] = useState("");
  const [dims, setDims] = useState<(number | null)[]>(DECISIONS.ratingDimensions.map(() => null));
  const [text, setText] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  if (!phone)
    return (
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card bg-muted p-5">
        <p className="flex-1">برای نوشتن نظر وارد حساب خود شوید. نظر ناشناس پذیرفته نمی‌شود.</p>
        <Link to="/login" search={{ redirect: `/salons/${salon.slug}` }} className={btn({ variant: "ink" })}>ورود و نوشتن نظر</Link>
      </div>
    );
  if (sent || hasReviewed(reviews, salon.id, phone))
    return (
      <div className="mt-6 rounded-card bg-success-soft p-5 text-success-text">
        نظر شما برای این سالن ثبت شده است. پس از بررسی تیم میکزی منتشر می‌شود. وضعیت آن را در <Link to="/my-reviews">نظرهای من</Link> ببینید.
      </div>
    );
  if (!open) return <Button className="mt-6" variant="ink" onClick={() => setOpen(true)}><Icon name="review" size={20} /> نوشتن نظر</Button>;

  return (
    <form
      className="mt-6 flex flex-col gap-5 rounded-card bg-card p-5 shadow-card"
      onSubmit={(e) => {
        e.preventDefault();
        const err = validateReview({ service, dims, text });
        if (evidence && evidence.size > 5 * 1024 * 1024) err.evidence = "حجم فایل حداکثر ۵ مگابایت است.";
        setErrors(err);
        if (Object.keys(err).length) return;
        addReview({ salonId: salon.id, author: displayName.trim() || "کاربر میکزی", userKey: phone, service, dims: dims as number[], text: text.trim(), evidenceSubmitted: !!evidence });
        setSent(true);
        toast.success("نظر شما ثبت شد و پس از بررسی منتشر می‌شود.");
      }}
    >
      <h3 className="text-h3">نظر شما درباره‌ی {salon.name}</h3>
      <Field label="کدام خدمت را گرفتید؟" htmlFor="rv-svc" error={errors.service}>
        <select id="rv-svc" className={inputCls} value={service} onChange={(e) => setService(e.target.value)} aria-invalid={!!errors.service}>
          <option value="">انتخاب کنید</option>
          {salon.services.map((v) => <option key={v.id}>{v.name}</option>)}
        </select>
      </Field>
      <div className="flex flex-col gap-3">
        {DECISIONS.ratingDimensions.map((d, i) => <StarsInput key={d} label={d} value={dims[i] ?? null} onChange={(v) => setDims(dims.map((x, j) => (j === i ? v : x)))} />)}
        {errors.dims && <p role="alert" className="text-caption text-error-text">{errors.dims}</p>}
      </div>
      <Field label="تجربه‌ی شما" htmlFor="rv-text" error={errors.text} hint={`دست‌کم ${DECISIONS.reviewMinChars} نویسه. بدون شماره‌ی تلفن، پیوند یا اطلاعات شخصی.`}>
        <textarea id="rv-text" rows={4} className={cn(inputCls, "py-3")} value={text} onChange={(e) => setText(e.target.value)} aria-invalid={!!errors.text} />
      </Field>
      <Field label="مدرک مراجعه (اختیاری)" htmlFor="rv-ev" error={errors.evidence} hint="مثل رسید یا فاکتور. فقط تیم میکزی آن را می‌بیند و هرگز عمومی نمی‌شود. در این نسخه فایل ارسال نمی‌شود.">
        <input id="rv-ev" type="file" accept="image/*,application/pdf" className="text-caption" onChange={(e) => setEvidence(e.target.files?.[0] ?? null)} />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">ثبت نظر</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>انصراف</Button>
      </div>
    </form>
  );
}

export function SalonMissing() {
  return (
    <SiteLayout>
      <div className="container-mk py-16">
        <StatePanel icon="salon" title="این سالن پیدا نشد" body="ممکن است نشانی اشتباه باشد یا پروفایل از نمایش خارج شده باشد." action={<Link to="/salons" className={btn()}>کاوش سالن‌ها</Link>} />
      </div>
    </SiteLayout>
  );
}
