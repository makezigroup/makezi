import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Chip, StatePanel, DemoNote, btn } from "@/components/mk/core";
import { SafeImg } from "@/components/mk/marketplace";
import { CATEGORIES, galleryOf, type CategoryId } from "@/lib/data";
import { usePublicSalons } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => seo("نمونه‌کار سالن‌ها", "نمونه‌کار ناخن، مو و آرایش سالن‌ها را ببینید؛ هر تصویر به پروفایل سالن سازنده وصل است.", { path: "/gallery" }),
  component: Gallery,
});

function Gallery() {
  const [cat, setCat] = useState<CategoryId | null>(null);
  const salons = usePublicSalons();
  const items = galleryOf(salons).filter((g) => !cat || g.category === cat);
  return (
    <SiteLayout>
      <PageIntro title="نمونه‌کار سالن‌ها" body="هر تصویر کار یک سالن است. برای دیدن قیمت و نظرها به پروفایل همان سالن بروید.">
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip active={!cat} onClick={() => setCat(null)}>همه</Chip>
          {CATEGORIES.map((c) => <Chip key={c.id} icon={c.icon} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>)}
        </div>
      </PageIntro>
      <div className="container-mk">
        {items.length === 0 ? <StatePanel icon="gallery" title="نمونه‌کاری در این دسته نیست" /> : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {items.map((g, i) => {
              const salon = salons.find((s) => s.id === g.salonId)!;
              return (
                <figure key={g.salonId + g.id} className="mb-4 break-inside-avoid overflow-hidden rounded-card bg-card shadow-card">
                  <SafeImg src={g.image} alt={`${g.title} — ${salon.name}`} className={i % 3 === 0 ? "aspect-[4/5] w-full" : "aspect-square w-full"} />
                  <figcaption className="flex flex-col gap-2 p-3">
                    <span className="font-semibold">{g.title}</span>
                    <span className="text-caption text-muted-foreground">{salon.name}</span>
                    <Link to="/salons/$slug" params={{ slug: salon.slug }} hash="portfolio" className={btn({ variant: "outline", size: "sm" }) + " self-start"}>دیدن سالن</Link>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
        <DemoNote className="mt-4">تصاویر این نسخه نمونه‌اند. متن رضایت انتشار تصویر هنوز تأیید نشده است (BB-5).</DemoNote>
      </div>
    </SiteLayout>
  );
}
