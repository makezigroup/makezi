import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/mk/location-pages";
import { SalonMissing, SalonProfile } from "@/components/mk/salon-profile";
import { getCity, getStaticSalon, areaName } from "@/lib/data";
import { useSalon } from "@/lib/app-store";
import { SITE_URL, breadcrumbLd, seo } from "@/lib/seo";
import { getPublicSalon } from "@/lib/directory.functions";

// One segment serves both city pages (/salons/tehran) and salon profiles (/salons/<salon-slug>).
export const Route = createFileRoute("/salons/$slug")({
  loader: ({ params }) => getCity(params.slug) ? null : getPublicSalon({ data: params.slug }),
  head: ({ params, loaderData }) => {
    const city = getCity(params.slug);
    if (city) return seo(`سالن‌های زیبایی ${city.name}`, `سالن‌های زیبایی ${city.name} را بر اساس محله، خدمت، قیمت و نظر کاربران مقایسه کنید.`, { path: `/salons/${city.slug}`, noindex: true });
    const s = loaderData;
    if (!s) return seo("سالن پیدا نشد", "این سالن در میکزی پیدا نشد.", { noindex: true });
    const path = `/salons/${s.slug}`;
    return seo(`${s.name}، ${areaName(s.city, s.area)}`, `خدمات، قیمت اعلام‌شده، نمونه‌کار، ساعت کاری و نظرهای ${s.name}.`, {
      path, noindex: !!s.isDemo,
      jsonLd: s.isDemo ? [] : [
        { "@context": "https://schema.org", "@type": "BeautySalon", name: s.name, address: s.address, telephone: s.phone, url: SITE_URL + path },
        breadcrumbLd([{ name: "سالن‌ها", path: "/salons" }, { name: s.name, path }]),
      ],
    });
  },
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useParams();
  const salon = Route.useLoaderData();
  if (getCity(slug)) return <CityPage city={slug} />;
  if (!salon) return <SalonMissing />;
  return <SalonProfile salon={salon} />;
}
