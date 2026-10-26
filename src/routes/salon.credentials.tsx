import { createFileRoute } from "@tanstack/react-router";
import { SalonCredentials } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/credentials")({
  head: () => seo("مدارک سالن", "مدارک سالن — میکزی", { noindex: true }),
  component: SalonCredentials,
});
