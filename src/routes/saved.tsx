import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { StatePanel, btn } from "@/components/mk/core";
import { SalonCard, SafeImg } from "@/components/mk/marketplace";
import { GALLERY, SALONS } from "@/lib/data";
import { useApp } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/saved")({
  head: () => seo("ذخیره‌شده‌ها", "سالن‌ها و مدل‌هایی که ذخیره کرده‌اید.", { noindex: true }),
  component: Saved,
});

function Saved() {
  const { saved } = useApp();
  const salons = SALONS.filter((s) => saved.includes(s.id));
  const models = GALLERY.filter((g) => saved.includes(g.id));
  return (
    <SiteLayout>
      <PageIntro title="ذخیره‌شده‌ها" />
      <div className="container-mk flex flex-col gap-10">
        {salons.length + models.length === 0 && (
          <StatePanel icon="save" title="هنوز چیزی ذخیره نکرده‌اید" body="روی نماد ذخیره در کارت سالن یا مدل بزنید." action={<Link to="/discover" className={btn()}>جست‌وجوی سالن</Link>} />
        )}
        {salons.length > 0 && (
          <section>
            <h2 className="mb-4 text-h3">سالن‌ها</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{salons.map((s) => <SalonCard key={s.id} salon={s} />)}</div>
          </section>
        )}
        {models.length > 0 && (
          <section>
            <h2 className="mb-4 text-h3">مدل‌ها</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {models.map((g) => (
                <Link key={g.id} to="/gallery" className="no-underline">
                  <SafeImg src={g.image} alt={g.title} className="aspect-square w-full rounded-card" />
                  <p className="mt-2 text-caption font-semibold text-foreground">{g.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
