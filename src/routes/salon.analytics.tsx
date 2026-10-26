import { createFileRoute } from "@tanstack/react-router";
import { SalonAnalytics } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/analytics")({
  head: () => seo("آمار سالن", "آمار سالن — میکزی", { noindex: true }),
  component: SalonAnalytics,
});
