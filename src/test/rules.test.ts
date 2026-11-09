import { describe, expect, it } from "vitest";
import { hasReviewed, scoreOf, toggleCompare, validateReview } from "@/lib/rules";
import { SEED_REVIEWS, type Review } from "@/lib/data";
import { DECISIONS } from "@/lib/decisions";

describe("comparison limit", () => {
  it("allows at most 3 salons", () => {
    const r = toggleCompare(["a", "b", "c"], "d");
    expect(r.ok).toBe(false);
    expect(r.list).toEqual(["a", "b", "c"]);
  });
});

describe("score display", () => {
  const base = SEED_REVIEWS[0]!;
  const mk = (n: number): Review[] => Array.from({ length: n }, (_, i) => ({ ...base, id: `t${i}`, status: "approved" }));
  const min = DECISIONS.minReviewsForScore; // open decision default
  it("hides the overall score below the minimum", () => expect(scoreOf(mk(min - 1)).avg).toBeNull());
  it("shows it from the minimum", () => expect(scoreOf(mk(min)).avg).not.toBeNull());
});

describe("reviews", () => {
  it("one review per user per salon", () => {
    const r = { ...SEED_REVIEWS[0]!, userKey: "09121111111", status: "pending" as const };
    expect(hasReviewed([r], r.salonId, "09121111111")).toBe(true);
  });
  it("rejects phone numbers in review text", () => {
    const e = validateReview({ service: "x", dims: DECISIONS.ratingDimensions.map(() => 4), text: "خیلی خوب بود، شماره ۰۹۱۲۱۲۳۴۵۶۷ را بگیرید و بپرسید" });
    expect(e.text).toBeDefined();
  });
});
