import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { StatePanel, StatusBadge, btn } from "@/components/mk/core";
import { ReviewCard } from "@/components/mk/marketplace";
import { useApp } from "@/lib/app-store";
import type { ReviewStatus } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/my-reviews")({
  head: () => seo("نظرهای من", "نظرهایی که نوشته‌اید و وضعیت بررسی آن‌ها.", { noindex: true }),
  component: MyReviews,
});

const ST: Record<ReviewStatus, { t: string; tone: "warning" | "success" | "error" | "neutral" }> = {
  pending: { t: "در انتظار بررسی", tone: "warning" },
  approved: { t: "منتشر شده", tone: "success" },
  rejected: { t: "منتشر نشد", tone: "error" },
  hidden: { t: "پنهان شده", tone: "neutral" },
};

function MyReviews() {
  const { phone, reviews, salons } = useApp();
  const mine = phone ? reviews.filter((r) => r.userKey === phone) : [];
  return (
    <SiteLayout>
      <PageIntro title="نظرهای من" body="هر نظر پیش از انتشار توسط تیم میکزی بررسی می‌شود." />
      <div className="container-mk flex max-w-3xl flex-col gap-4">
        {!phone ? (
          <StatePanel icon="profile" title="وارد حساب خود نشده‌اید" action={<Link to="/login" className={btn()}>ورود با موبایل</Link>} />
        ) : mine.length === 0 ? (
          <StatePanel icon="review" title="هنوز نظری ننوشته‌اید" body="از پروفایل هر سالن می‌توانید تجربه‌تان را بنویسید." action={<Link to="/salons" className={btn()}>کاوش سالن‌ها</Link>} />
        ) : (
          mine.map((r) => {
            const s = salons.find((x) => x.id === r.salonId);
            return (
              <div key={r.id} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {s && <Link to="/salons/$slug" params={{ slug: s.slug }} className="font-semibold">{s.name}</Link>}
                  <StatusBadge tone={ST[r.status].tone}>{ST[r.status].t}</StatusBadge>
                </div>
                <ReviewCard r={r} report={false} />
              </div>
            );
          })
        )}
      </div>
    </SiteLayout>
  );
}
