import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashShell } from "@/components/mk/layout";
import { SALON_NAV } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon")({
  head: () => seo("پنل سالن", "مدیریت نوبت‌ها، خدمات، نمونه‌کار، مدارک و نظرهای سالن در میکزی.", { noindex: true }),
  component: () => (
    <DashShell title="پنل سالن" badge="سالن" nav={SALON_NAV}>
      <Outlet />
    </DashShell>
  ),
});
