import { createFileRoute } from "@tanstack/react-router";
import { AdminHome } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => seo("پیشخوان مدیریت", "پیشخوان مدیریت — میکزی", { noindex: true }),
  component: AdminHome,
});
