import { createFileRoute } from "@tanstack/react-router";
import { AdminAnalytics } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/analytics")({
  head: () => seo("شاخص‌های بازار", "شاخص‌های بازار — میکزی", { noindex: true }),
  component: AdminAnalytics,
});
