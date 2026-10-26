import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/mk/layout";
import { Icon, VerifyBadge, StatusBadge, btn, DemoNote, StatePanel } from "@/components/mk/core";
import { RatingInline, RatingSummary, ReviewCard, SafeImg } from "@/components/mk/marketplace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, GALLERY, getSalon } from "@/lib/data";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salons/$slug")({
  loader: ({ params }) => {
    const salon = getSalon(params.slug);
    if (!salon) throw notFound();
    return { name: salon.name, area: salon.area };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(`${loaderData.name}، ${loaderData.area}`, `فهرست قیمت ثبت‌شده، متخصصان، مدارک، نمونه‌کار و نظرهای تأییدشده‌ی ${loaderData.name}.`)
      : seo("سالن پیدا نشد", "این سالن در میکزی وجود ندارد.", { noindex: true }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-mk py-16">
        <StatePanel icon="salon" title="این سالن پیدا نشد" action={<Link to="/discover" className={btn()}>جست‌وجوی سالن</Link>} />
      </div>
    </SiteLayout>
  ),
  component: SalonProfile,
});

function SalonProfile() {
  const { slug } = Route.useParams();
  const salon = getSalon(slug)!;
  const fmt = useFmt();
  const { saved, toggleSaved } = useApp();
  const portfolio = GALLERY.filter((g) => g.salonSlug === salon.slug);
  const isSaved = saved.includes(salon.id);

  return (
    <SiteLayout>
      <div className="container-mk pt-6">
        <nav aria-label="مسیر" className="mb-4 text-caption text-muted-foreground">
          <Link to="/discover" className="text-muted-foreground">سالن‌ها</Link> / <span>{salon.name}</span>
        </nav>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid grid-cols-3 gap-3">
            <SafeImg src={salon.image} alt={`نمونه‌کار ${salon.name}`} eager className="col-span-2 row-span-2 aspect-[4/5] w-full rounded-card" />
            {(portfolio.length ? portfolio : GALLERY).slice(0, 2).map((p) => (
              <SafeImg key={p.id} src={p.image} alt={p.title} className="aspect-square w-full rounded-card" />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <VerifyBadge status={salon.status} />
              {salon.categories.map((c) => (
                <StatusBadge key={c} tone="neutral" icon={false}>{CATEGORIES.find((x) => x.id === c)?.label}</StatusBadge>
              ))}
            </div>
            <h1 className="text-h1">{salon.name}</h1>
            <RatingInline salon={salon} />
            <p className="flex items-center gap-2 text-muted-foreground"><Icon name="location" size={20} /> {salon.address} · {fmt.rating(salon.distanceKm)} کیلومتر</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Icon name="clock" size={20} /> {salon.hours}</p>
            <p>{salon.about}</p>
            {salon.status !== "verified" && <DemoNote>مدارک این سالن هنوز بررسی نشده است.</DemoNote>}
            <div className="mt-2 flex flex-wrap gap-3">
              <Link to="/booking/$salonId" params={{ salonId: salon.id }} className={btn({ size: "lg" }) + " flex-1"}>
                <Icon name="calendar" size={20} /> رزرو نوبت
              </Link>
              <button onClick={() => toggleSaved(salon.id)} aria-pressed={isSaved} className={btn({ variant: "outline", size: "lg" })}>
                <Icon name="save" size={20} /> {isSaved ? "ذخیره شد" : "ذخیره"}
              </button>
              <button
                className={btn({ variant: "ghost", size: "lg" })}
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                aria-label="کپی پیوند سالن"
              >
                <Icon name="share" size={20} />
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="prices" className="mt-10" dir="rtl">
          <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-full bg-muted p-1">
            {([["prices", "فهرست قیمت"], ["staff", "متخصصان"], ["reviews", "نظرها"], ["portfolio", "نمونه‌کار"], ["creds", "مدارک"]] as const).map(([v, l]) => v && (
              <TabsTrigger key={v} value={v} className="min-h-10 rounded-full px-4 data-[state=active]:bg-selected data-[state=active]:text-selected-foreground">
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="prices" className="mt-6">
            <ul className="divide-y divide-border rounded-card bg-card shadow-card">
              {salon.services.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-caption text-muted-foreground">
                      {fmt.duration(v.durationMin)} · به‌روزرسانی {v.updated}
                      {v.note && ` · ${v.note}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{v.priceFrom && "از "}{fmt.price(v.price)}</span>
                    <Link to="/booking/$salonId" params={{ salonId: salon.id }} search={{ service: v.id }} className={btn({ variant: "outline", size: "sm" })}>انتخاب</Link>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-label text-muted-foreground">قیمت‌ها را سالن ثبت کرده است. قیمت‌های «از» ممکن است بر اساس توضیح نوشته‌شده تغییر کنند.</p>
          </TabsContent>

          <TabsContent value="staff" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {salon.staff.map((st) => (
              <div key={st.id} className="flex items-start gap-3 rounded-card bg-card p-5 shadow-card">
                <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name="profile" /></span>
                <div>
                  <p className="font-semibold">{st.name}</p>
                  <p className="text-caption text-muted-foreground">{st.role} · {fmt.num(st.years)} سال سابقه</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {st.specialties.map((x) => <StatusBadge key={x} tone="neutral" icon={false}>{x}</StatusBadge>)}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 flex flex-col gap-4">
            <RatingSummary salon={salon} />
            {salon.reviews.length === 0 ? (
              <StatePanel icon="review" title="این سالن هنوز نظری ندارد" body="پس از اولین رزرو انجام‌شده، نظرها اینجا نمایش داده می‌شوند." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">{salon.reviews.map((r) => <ReviewCard key={r.id} r={r} />)}</div>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            {portfolio.length === 0 ? (
              <StatePanel icon="gallery" title="هنوز نمونه‌کاری ثبت نشده است" />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {portfolio.map((p) => (
                  <figure key={p.id}>
                    <SafeImg src={p.image} alt={p.title} className="aspect-[4/5] w-full rounded-card" />
                    <figcaption className="mt-2 text-caption"><span className="font-semibold">{p.title}</span> · {p.tags.join("، ")}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="creds" className="mt-6">
            <ul className="flex flex-col gap-2 rounded-card bg-card p-4 shadow-card">
              {salon.credentials.map((c) => (
                <li key={c.label} className="flex flex-wrap items-center justify-between gap-2 p-2">
                  <span className="flex items-center gap-2"><Icon name="package" size={20} /> {c.label}</span>
                  <span className="flex items-center gap-2 text-caption text-muted-foreground">{c.date} <VerifyBadge status={c.status} /></span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-label text-muted-foreground">«تأییدشده» یعنی مدارک این سالن بررسی و تأیید شده است؛ نه تضمین کیفیت کار. فایل مدارک عمومی نیست.</p>
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}
