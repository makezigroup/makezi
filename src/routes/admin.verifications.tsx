import { createFileRoute } from "@tanstack/react-router";
import { AdminVerifications } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/verifications")({
  head: () => seo("صف تأیید مدارک", "صف تأیید مدارک — میکزی", { noindex: true }),
  component: AdminVerifications,
});
