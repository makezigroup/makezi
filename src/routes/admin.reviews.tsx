import { createFileRoute } from "@tanstack/react-router";
import { AdminReviews } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/reviews")({
  head: () => seo("بررسی نظرها", "بررسی نظرها — میکزی", { noindex: true }),
  component: AdminReviews,
});
