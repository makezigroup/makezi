import { createFileRoute } from "@tanstack/react-router";
import { SalonOnboarding } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/onboarding")({
  head: () => seo("راه‌اندازی پروفایل سالن", "راه‌اندازی پروفایل سالن — میکزی", { noindex: true }),
  component: SalonOnboarding,
});
