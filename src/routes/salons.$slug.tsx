import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/mk/location-pages";
import { SalonMissing, SalonProfile } from "@/components/mk/salon-profile";
import { getCity, getStaticSalon, areaName } from "@/lib/data";
import { useSalon } from "@/lib/app-store";
import { SITE_URL, breadcrumbLd, seo } from "@/lib/seo";

// One segment serves both city pages (/salons/tehran) and salon profiles (/salons/<salon-slug>).
export const Route = createFileRoute("/salons/$slug")({
  head: ({ params }) => {
    const city = getCity(params.slug);
    if (city) return seo(`سالن‌های زیبایی ${city.name}`, `سالن‌های زیبایی ${city.name} را بر اساس محله، خدمت، قیمت و نظر کاربران مقایسه کنید.`, { path: `/salons/${city.slug}` });
    const s = getStaticSalon(params.slug);
    if (!s) return seo("سالن پیدا نشد", "این سالن در میکزی پیدا نشد.", { noindex: true });
    const path = `/salons/${s.slug}`;
    return seo(`${s.name}، ${areaName(s.city, s.area)}`, `خدمات، قیمت اعلام‌شده، نمونه‌کار، ساعت کاری و نظرهای ${s.name}.`, {
      path,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "BeautySalon", name: s.name, address: s.address, telephone: s.phone, url: SITE_URL + path },
        breadcrumbLd([{ name: "سالن‌ها", path: "/salons" }, { name: s.name, path }]),
      ],
    });
  },
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useParams();
  const salon = useSalon(slug);
  if (getCity(slug)) return <CityPage city={slug} />;
  if (!salon) return <SalonMissing />;
  return <SalonProfile salon={salon} />;
}
