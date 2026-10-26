import { createFileRoute } from "@tanstack/react-router";
import { SalonServices } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/services")({
  head: () => seo("خدمات و قیمت سالن", "خدمات و قیمت سالن — میکزی", { noindex: true }),
  component: SalonServices,
});
