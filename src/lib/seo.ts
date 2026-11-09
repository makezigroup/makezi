export const SITE_URL = "https://makezi.lovable.app";

export function seo(title: string, description: string, opts: { noindex?: boolean; path?: string; jsonLd?: object[] } = {}) {
  const t = `${title} | میکزی MAKEZI`;
  const url = opts.path ? SITE_URL + opts.path : undefined;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      ...(url ? [{ property: "og:url", content: url }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      ...(opts.noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: url && !opts.noindex ? [{ rel: "canonical", href: url }] : [],
    scripts: (opts.jsonLd ?? []).map((j) => ({ type: "application/ld+json", children: JSON.stringify(j) })),
  };
}

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE_URL + it.path })),
});
