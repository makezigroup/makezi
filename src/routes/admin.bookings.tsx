import { createFileRoute } from "@tanstack/react-router";
import { AdminBookings } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/bookings")({
  head: () => seo("رزروها", "رزروها — میکزی", { noindex: true }),
  component: AdminBookings,
});
