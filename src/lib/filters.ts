import { z } from "zod";
import { CATEGORY_IDS, CATEGORIES, getCity, areaName, isOpenAt, priceFrom, type Review, type Salon } from "./data";
import { DECISIONS } from "./decisions";
import { publicReviews, scoreOf } from "./rules";

export const directorySearch = z.object({
  q: z.string().optional(),
  cat: z.enum(CATEGORY_IDS).optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  max: z.number().optional(),
  min: z.number().optional(),
  minReviews: z.number().optional(),
  service: z.string().optional(),
  page: z.number().int().positive().optional(),
  rating: z.number().optional(),
  verified: z.boolean().optional(),
  open: z.boolean().optional(),
  reviewed: z.boolean().optional(),
  portfolio: z.boolean().optional(),
  attrs: z.array(z.string()).optional(),
  sort: z.enum(["distance", "rating", "reviews", "price", "price-desc", "newest", "updated"]).optional(),
});
export type DirectorySearch = z.infer<typeof directorySearch>;
export type SortKey = NonNullable<DirectorySearch["sort"]>;

export const SORT_LABEL: Record<SortKey, { label: string; how: string }> = {
  distance: { label: "مرتبط‌ترین", how: "تطابق نام سالن و خدمت با جست‌وجوی شما؛ سپس تاریخ انتشار." },
  rating: { label: "امتیاز نظرها", how: `میانگین ساده‌ی نظرهای منتشرشده؛ سالن‌های با کمتر از ${DECISIONS.minReviewsForScore} نظر در انتها می‌آیند.` },
  reviews: { label: "تعداد نظرها", how: "تعداد نظرهای منتشرشده، از بیشتر به کمتر." },
  price: { label: "قیمت شروع (کمترین)", how: "ارزان‌ترین خدمت ثبت‌شده‌ی هر سالن." },
  "price-desc": { label: "قیمت شروع (بیشترین)", how: "ارزان‌ترین خدمت ثبت‌شده، از بیشتر به کمتر." },
  newest: { label: "تازه‌اضافه‌شده", how: "تاریخ انتشار پروفایل در میکزی." },
  updated: { label: "تازه‌ترین بررسی", how: "تاریخ آخرین بررسی اطلاعات توسط تیم میکزی." },
};

export const activeFilterCount = (s: DirectorySearch) =>
  [s.cat, s.city, s.area, s.max, s.rating, s.verified, s.open, s.reviewed, s.portfolio, s.attrs?.length].filter(Boolean).length;

export function filterSalons(list: Salon[], reviews: Review[], s: DirectorySearch, now = new Date()) {
  const q = s.q?.trim();
  const score = new Map(list.map((x) => [x.id, scoreOf(publicReviews(reviews, x.id))]));
  let out = list.filter((x) => {
    if (!x.published || x.archived) return false;
    if (!DECISIONS.showUnverifiedSalons && x.status !== "verified") return false;
    if (s.verified && x.status !== "verified") return false;
    if (s.cat && !x.categories.includes(s.cat) && !x.services.some((v) => v.category === s.cat)) return false;
    if (s.city && x.city !== s.city) return false;
    if (s.area && x.area !== s.area) return false;
    if (s.max && priceFrom(x) > s.max) return false;
    if (s.min && priceFrom(x) < s.min) return false;
    if (s.service && !x.services.some(v=>v.name === s.service)) return false;
    if (s.minReviews && (score.get(x.id)?.count ?? 0) < s.minReviews) return false;
    if (s.rating) {
      const avg = score.get(x.id)?.avg;
      if (avg == null || avg < s.rating) return false;
    }
    if (s.reviewed && !score.get(x.id)?.count) return false;
    if (s.portfolio && x.portfolio.length === 0) return false;
    if (s.open && !isOpenAt(x, now)) return false;
    if (s.attrs?.length && !s.attrs.every((a) => (x.attributes as string[]).includes(a))) return false;
    if (q && ![x.name, x.address, getCity(x.city)?.name ?? x.city, areaName(x.city,x.area), ...x.categories.map(c=>CATEGORIES.find(v=>v.id===c)?.label ?? ''), ...x.services.map(v=>v.name)].some(v=>v.includes(q))) return false;
    return true;
  });
  const sort = s.sort ?? "distance";
  out = [...out].sort((a, b) => {
    const sa = score.get(a.id), sb = score.get(b.id);
    if (!sa || !sb) return 0;
    switch (sort) {
      case "price": return priceFrom(a) - priceFrom(b);
      case "price-desc": return priceFrom(b) - priceFrom(a);
      case "rating": return (sb.avg ?? -1) - (sa.avg ?? -1);
      case "reviews": return sb.count - sa.count;
      case "newest": return b.addedAt.localeCompare(a.addedAt);
      case "updated": return b.checkedAt.localeCompare(a.checkedAt);
      default: return Number(!!q && b.name.includes(q)) - Number(!!q && a.name.includes(q)) || b.addedAt.localeCompare(a.addedAt);
    }
  });
  return out;
}
