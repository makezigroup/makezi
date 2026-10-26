import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashShell } from "@/components/mk/layout";
import { ADMIN_NAV } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => seo("مدیریت داخلی", "ابزار داخلی تأیید سالن‌ها و نظارت بر بازار.", { noindex: true }),
  component: () => (
    <DashShell title="مدیریت داخلی" badge="داخلی" nav={ADMIN_NAV}>
      <Outlet />
    </DashShell>
  ),
});
