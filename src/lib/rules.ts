// Pure product rules (tested in src/test/rules.test.ts).
import { DECISIONS } from "./decisions";
import { reviewOverall, type Review } from "./data";
import { isValidPhone } from "./format";

/** Add/remove a salon from the comparison; refuses a 4th salon. */
export function toggleCompare(list: string[], id: string): { list: string[]; ok: boolean } {
  if (list.includes(id)) return { list: list.filter((x) => x !== id), ok: true };
  if (list.length >= DECISIONS.compareMax) return { list, ok: false };
  return { list: [...list, id], ok: true };
}

/** Only reviews approved by the MAKEZI team are public. */
export const publicReviews = (all: Review[], salonId: string) =>
  all.filter((r) => r.salonId === salonId && r.status === "approved");

export interface Score { count: number; avg: number | null; dims: number[]; verifiedCount: number }
/** Simple mean of approved reviews; no score below the minimum count. */
export function scoreOf(approved: Review[]): Score {
  const count = approved.length;
  const dims = DECISIONS.ratingDimensions.map((_, i) =>
    count ? approved.reduce((a, r) => a + (r.dims[i] ?? 0), 0) / count : 0,
  );
  const avg = count >= DECISIONS.minReviewsForScore ? approved.reduce((a, r) => a + reviewOverall(r), 0) / count : null;
  return { count, avg, dims, verifiedCount: approved.filter((r) => r.kind === "verified-visit").length };
}

/** One review per user per salon (rejected ones don't count). */
export const hasReviewed = (all: Review[], salonId: string, userKey: string) =>
  all.some((r) => r.salonId === salonId && r.userKey === userKey && r.status !== "rejected");

export type ReviewErrors = Partial<Record<"service" | "dims" | "text" | "evidence", string>>;
export function validateReview(v: { service: string; dims: (number | null)[]; text: string }): ReviewErrors {
  const e: ReviewErrors = {};
  if (!v.service) e.service = "خدمتی را که گرفته‌اید انتخاب کنید.";
  if (v.dims.length !== DECISIONS.ratingDimensions.length || v.dims.some((d) => !d || d < 1 || d > 5)) e.dims = "به همه‌ی بخش‌ها از ۱ تا ۵ امتیاز دهید.";
  const t = v.text.trim();
  if (t.length < DECISIONS.reviewMinChars) e.text = `دست‌کم ${DECISIONS.reviewMinChars} نویسه بنویسید.`;
  if (t.length > 1500) e.text = "متن نظر حداکثر ۱۵۰۰ نویسه است.";
  if (/(https?:\/\/|www\.)/i.test(t)) e.text = "نظر نباید پیوند داشته باشد.";
  if (/09\d{9}|۰۹[۰-۹]{9}/.test(t)) e.text = "شماره‌ی تلفن در متن نظر مجاز نیست.";
  return e;
}

export type InquiryErrors = Partial<Record<"business" | "name" | "phone" | "city" | "message", string>>;
export function validateInquiry(v: { business: string; name: string; phone: string; city: string; message: string }): InquiryErrors {
  const e: InquiryErrors = {};
  if (v.business.trim().length < 2) e.business = "نام کسب‌وکار را بنویسید.";
  if (v.name.trim().length < 2) e.name = "نام خود را بنویسید.";
  if (!isValidPhone(v.phone)) e.phone = "شماره‌ی موبایل ۱۱ رقمی و با ۰۹ شروع شود.";
  if (!v.city) e.city = "شهر را انتخاب کنید.";
  if (v.message.trim().length > 1000) e.message = "حداکثر ۱۰۰۰ نویسه.";
  return e;
}
