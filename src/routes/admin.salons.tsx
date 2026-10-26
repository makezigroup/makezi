import { createFileRoute } from "@tanstack/react-router";
import { AdminSalons } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/salons")({
  head: () => seo("سالن‌ها", "سالن‌ها — میکزی", { noindex: true }),
  component: AdminSalons,
});
