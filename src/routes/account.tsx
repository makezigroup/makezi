import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Button, DemoNote, Icon, StatePanel, btn } from "@/components/mk/core";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => seo("حساب من", "نظرها، سالن‌های ذخیره‌شده و تنظیمات حساب.", { noindex: true }),
  component: Account,
});

function Account() {
  const { phone, email, signOut, reviews, saved, compare, displayName } = useApp();
  const fmt = useFmt();
  const tiles = [
    { to: "/my-reviews" as const, icon: "review" as const, label: "نظرهای من", n: phone ? reviews.filter((r) => r.userKey === phone).length : 0 },
    { to: "/saved" as const, icon: "save" as const, label: "سالن‌های ذخیره‌شده", n: saved.length },
    { to: "/compare" as const, icon: "sort" as const, label: "مقایسه", n: compare.length },
    { to: "/settings" as const, icon: "filter" as const, label: "تنظیمات", n: null },
  ];
  return (
    <SiteLayout>
      <PageIntro title="حساب من" />
      <div className="container-mk grid max-w-4xl gap-6">
        {!phone ? (
          <StatePanel icon="profile" title="وارد حساب خود نشده‌اید" body="برای نوشتن نظر و نگه‌داشتن فهرست‌ها وارد حساب شوید." action={<Link to="/login" className={btn()}>ورود</Link>} />
        ) : (
          <section className="flex flex-wrap items-center gap-4 rounded-card bg-card p-5 shadow-card">
            <span className="grid size-14 place-items-center rounded-full bg-muted"><Icon name="profile" /></span>
            <div className="flex-1">
              <p className="font-semibold">{displayName || "کاربر میکزی"}</p>
              <bdi dir="ltr" className="font-mono text-caption text-muted-foreground">{email}</bdi>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>خروج</Button>
          </section>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link key={t.to} to={t.to} className="flex items-center gap-3 rounded-card bg-card p-5 text-foreground no-underline shadow-card hover:shadow-modal">
              <Icon name={t.icon} /> <span className="flex-1 font-semibold">{t.label}</span>{t.n != null && <span className="text-caption text-muted-foreground">{fmt.num(t.n)}</span>}
            </Link>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
