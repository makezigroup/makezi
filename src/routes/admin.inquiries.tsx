import { createFileRoute } from "@tanstack/react-router";
import { AdminInquiries } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/inquiries")({
  head: () => seo("درخواست کسب‌وکارها", "درخواست‌های ثبت سالن — میکزی", { noindex: true }),
  component: AdminInquiries,
});
