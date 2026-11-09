import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/mk/location-pages";
import { getArea, getCity } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/salons/$slug_/$area")({
  head: ({ params }) => {
    const c = getCity(params.slug), a = getArea(params.slug, params.area);
    return c && a
      ? seo(`سالن‌های زیبایی ${a.name}، ${c.name}`, `سالن‌های زیبایی ${a.name} با خدمات، قیمت اعلام‌شده و نظر کاربران.`, { path: `/salons/${c.slug}/${a.slug}` })
      : seo("محله پیدا نشد", "این محله در میکزی پیدا نشد.", { noindex: true });
  },
  component: function AreaRoute() {
    const { slug, area } = Route.useParams();
    return <AreaPage city={slug} area={area} />;
  },
});
