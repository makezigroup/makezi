import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

// Old public URL: the directory moved to /salons. Keep links and bookmarks working.
export const Route = createFileRoute("/discover")({
  validateSearch: z.object({ q: z.string().optional() }).passthrough(),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/salons", search: { q: search.q }, statusCode: 301 });
  },
});
