import { createFileRoute } from "@tanstack/react-router";
import { SalonProfileEdit } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/profile")({
  head: () => seo("پروفایل سالن", "پروفایل سالن — میکزی", { noindex: true }),
  component: SalonProfileEdit,
});
