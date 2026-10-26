import { describe, expect, it } from "vitest";
import { makeFmt, isValidPhone } from "@/lib/format";
import { filterSalons } from "@/lib/filters";
import { SALONS } from "@/lib/data";

const fa = makeFmt(true);
describe("Persian formatting", () => {
  it("formats prices with Persian separators and unit after", () => expect(fa.price(250000)).toBe("۲۵۰٬۰۰۰ تومان"));
  it("formats ratings with Persian decimal mark", () => expect(fa.ratingOf5(4.6)).toBe("۴٫۶ از ۵"));
  it("latin digit option", () => expect(makeFmt(false).price(250000)).toBe("250,000 تومان"));
  it("mobile is 11 digits starting with 09", () => {
    expect(isValidPhone("۰۹۱۲۱۲۳۴۵۶۷")).toBe(true);
    expect(isValidPhone("0912123456")).toBe(false);
  });
});
describe("discovery filters", () => {
  it("verified-only hides pending and unverified salons", () =>
    expect(filterSalons(SALONS, { verified: true }).every((s) => s.status === "verified")).toBe(true));
});
