import { createFileRoute } from "@tanstack/react-router";
import { AdminCategories } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/service-categories")({
  head: () => seo("دسته‌بندی خدمات", "دسته‌بندی خدمات — میکزی", { noindex: true }),
  component: AdminCategories,
});
