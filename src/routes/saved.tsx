import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { StatePanel, btn } from "@/components/mk/core";
import { SalonCard } from "@/components/mk/marketplace";
import { useApp, usePublicSalons } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/saved")({
  head: () => seo("سالن‌های ذخیره‌شده", "سالن‌هایی که برای بعد نگه داشته‌اید.", { noindex: true }),
  component: Saved,
});

function Saved() {
  const { saved } = useApp();
  const salons = usePublicSalons().filter((s) => saved.includes(s.id));
  return (
    <SiteLayout>
      <PageIntro title="سالن‌های ذخیره‌شده" />
      <div className="container-mk">
        {salons.length === 0 ? (
          <StatePanel icon="save" title="هنوز سالنی ذخیره نکرده‌اید" body="روی نماد ذخیره در کارت یا پروفایل سالن بزنید." action={<Link to="/salons" className={btn()}>کاوش سالن‌ها</Link>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{salons.map((s) => <SalonCard key={s.id} salon={s} />)}</div>
        )}
      </div>
    </SiteLayout>
  );
}
