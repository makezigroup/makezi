export function seo(title: string, description: string, opts: { noindex?: boolean } = {}) {
  const t = `${title} | میکزی MAKEZI`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(opts.noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
  };
}
