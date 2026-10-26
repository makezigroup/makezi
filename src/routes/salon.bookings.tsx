import { createFileRoute } from "@tanstack/react-router";
import { SalonBookings } from "@/components/mk/salon-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salon/bookings")({
  head: () => seo("نوبت‌های سالن", "نوبت‌های سالن — میکزی", { noindex: true }),
  component: SalonBookings,
});
