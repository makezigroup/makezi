import { createFileRoute } from "@tanstack/react-router";
import { AdminDisputes } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/disputes")({
  head: () => seo("اختلاف‌ها", "اختلاف‌ها — میکزی", { noindex: true }),
  component: AdminDisputes,
});
