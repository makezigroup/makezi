import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Chip, Icon, btn, StatePanel, DemoNote } from "@/components/mk/core";
import { SafeImg } from "@/components/mk/marketplace";
import { CATEGORIES, GALLERY, getSalon, type CategoryId } from "@/lib/data";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => seo("گالری مدل", "ایده‌ی ناخن، مو و آرایش را ببینید؛ هر مدل به سالن سازنده و خدمت مربوط وصل است."),
  component: Gallery,
});

function Gallery() {
  const [cat, setCat] = useState<CategoryId | null>(null);
  const fmt = useFmt();
  const { saved, toggleSaved } = useApp();
  const items = GALLERY.filter((g) => !cat || g.category === cat);
  return (
    <SiteLayout>
      <PageIntro title="گالری مدل" body="هر تصویر کار یک سالن است؛ همان خدمت را از همان سالن رزرو کنید.">
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip active={!cat} onClick={() => setCat(null)}>همه</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} icon={c.icon} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>
          ))}
        </div>
      </PageIntro>
      <div className="container-mk">
        {items.length === 0 ? (
          <StatePanel icon="gallery" title="مدلی در این دسته نیست" />
        ) : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {items.map((g, i) => {
              const salon = getSalon(g.salonSlug)!;
              const svc = salon.services.find((s) => s.id === g.serviceId);
              const isSaved = saved.includes(g.id);
              return (
                <figure key={g.id} className="mb-4 break-inside-avoid overflow-hidden rounded-card bg-card shadow-card">
                  <div className="relative">
                    <SafeImg src={g.image} alt={g.title} className={i % 3 === 0 ? "aspect-[4/5] w-full" : "aspect-square w-full"} />
                    <button onClick={() => toggleSaved(g.id)} aria-pressed={isSaved} aria-label="ذخیره‌ی مدل" className={"absolute end-2 top-2 grid size-11 place-items-center rounded-full shadow-card " + (isSaved ? "bg-ink text-ink-foreground" : "bg-surface")}>
                      <Icon name="save" size={18} />
                    </button>
                  </div>
                  <figcaption className="flex flex-col gap-2 p-3">
                    <span className="font-semibold">{g.title}</span>
                    <span className="text-caption text-muted-foreground">{svc?.name} · {salon.name}</span>
                    {svc && <span className="text-caption">{svc.priceFrom && "از "}{fmt.price(svc.price)}</span>}
                    <div className="flex flex-wrap gap-2">
                      <Link to="/booking/$salonId" params={{ salonId: salon.id }} search={{ service: g.serviceId }} className={btn({ size: "sm" })}>درخواست این مدل</Link>
                      <Link to="/salons/$slug" params={{ slug: salon.slug }} className={btn({ variant: "ghost", size: "sm" })}>سالن</Link>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
        <DemoNote className="mt-4">«درخواست این مدل» فعلاً به رزرو همان خدمت در سالن سازنده می‌رود (تصمیم باز MD-1). متن رضایت تصویر هنوز تأیید نشده است (BB-5).</DemoNote>
      </div>
    </SiteLayout>
  );
}
