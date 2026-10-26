import { createFileRoute } from "@tanstack/react-router";
import { SalonSettings } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/settings")({
  head: () => seo("تنظیمات سالن", "تنظیمات سالن — میکزی", { noindex: true }),
  component: SalonSettings,
});
