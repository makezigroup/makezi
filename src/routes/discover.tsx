import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { seo } from "@/lib/seo";

// Old public URL: the directory moved to /salons. Keep links and bookmarks working.
export const Route = createFileRoute("/discover")({
  head: () => seo("جست‌وجوی سالن در میکزی", "فهرست سالن‌ها به صفحه‌ی جست‌وجوی سالن منتقل شده است.", { noindex: true }),
  validateSearch: z.object({ q: z.string().optional() }).passthrough(),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/salons", search: { q: search.q }, statusCode: 301 });
  },
});
