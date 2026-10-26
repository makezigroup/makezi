import { createFileRoute } from "@tanstack/react-router";
import { SalonAvailability } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/availability")({
  head: () => seo("زمان‌های کاری سالن", "زمان‌های کاری سالن — میکزی", { noindex: true }),
  component: SalonAvailability,
});
