import { createFileRoute } from "@tanstack/react-router";
import { SalonReviews } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/reviews")({
  head: () => seo("نظرهای سالن", "نظرهای سالن — میکزی", { noindex: true }),
  component: SalonReviews,
});
