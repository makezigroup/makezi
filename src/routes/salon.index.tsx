import { createFileRoute } from "@tanstack/react-router";
import { SalonHome } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/")({
  head: () => seo("پیشخوان سالن", "پیشخوان سالن — میکزی", { noindex: true }),
  component: SalonHome,
});
