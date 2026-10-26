import { z } from "zod";
import { avgRating, priceFrom, slotsFor, type Salon } from "./data";
import { DECISIONS } from "./decisions";
import { isoDay } from "./format";

export const discoverSearch = z.object({
  q: z.string().optional(),
  cat: z.enum(["nail", "hair", "skin", "makeup"]).optional(),
  area: z.string().optional(),
  date: z.enum(["today", "tomorrow"]).optional(),
  verified: z.boolean().optional(),
  max: z.number().optional(),
  sort: z.enum(["distance", "price", "rating", "complete"]).optional(),
});
export type DiscoverSearch = z.infer<typeof discoverSearch>;

export const SORT_LABEL: Record<NonNullable<DiscoverSearch["sort"]>, string> = {
  distance: "فاصله (نزدیک‌ترین)",
  price: "قیمت شروع (کمترین)",
  rating: "امتیاز نظرهای تأییدشده",
  complete: "کامل‌بودن پروفایل",
};

export function filterSalons(list: Salon[], s: DiscoverSearch, today = new Date()) {
  const q = s.q?.trim();
  let out = list.filter((x) => {
    if (!DECISIONS.showUnverifiedSalons && x.status !== "verified") return false;
    if (s.verified && x.status !== "verified") return false;
    if (s.cat && !x.categories.includes(s.cat)) return false;
    if (s.area && x.area !== s.area) return false;
    if (s.max && priceFrom(x) > s.max) return false;
    if (s.date) {
      const day = isoDay(s.date === "today" ? 0 : 1, today);
      if (slotsFor(x.id, day).length === 0) return false;
    }
    if (q && !(x.name.includes(q) || x.services.some((v) => v.name.includes(q)))) return false;
    return true;
  });
  const sort = s.sort ?? "distance";
  out = [...out].sort((a, b) => {
    if (sort === "price") return priceFrom(a) - priceFrom(b);
    if (sort === "complete") return b.profileCompleteness - a.profileCompleteness;
    if (sort === "rating") {
      // Salons below the review threshold sort after scored ones; never given a fake score.
      const ra = a.reviews.length >= DECISIONS.minReviewsForScore ? avgRating(a) : -1;
      const rb = b.reviews.length >= DECISIONS.minReviewsForScore ? avgRating(b) : -1;
      return rb - ra;
    }
    return a.distanceKm - b.distanceKm;
  });
  return out;
}
