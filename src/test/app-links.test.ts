import { describe, expect, it } from "vitest";
import { APP_LINKS, detectPlatform, isLinkReady } from "@/lib/app-links";

describe("detectPlatform", () => {
  it("detects iPhone and iPad as ios", () => {
    expect(detectPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("ios");
    expect(detectPlatform("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")).toBe("ios");
  });
  it("detects Android", () => {
    expect(detectPlatform("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe("android");
  });
  it("falls back to desktop", () => {
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
  });
});

describe("isLinkReady", () => {
  it("treats empty and non-https values as unavailable", () => {
    expect(isLinkReady("")).toBe(false);
    expect(isLinkReady("   ")).toBe(false);
    expect(isLinkReady("http://example.com")).toBe(false);
    expect(isLinkReady("bazaar://details?id=x")).toBe(false);
  });
  it("accepts a real https URL", () => {
    expect(isLinkReady("https://cafebazaar.ir/app/com.makezi")).toBe(true);
  });
});

describe("APP_LINKS defaults", () => {
  it("ships without invented marketplace URLs", () => {
    expect(isLinkReady(APP_LINKS.cafeBazaar)).toBe(false);
    expect(isLinkReady(APP_LINKS.myket)).toBe(false);
  });
  it("points the PWA guide at the real site", () => {
    expect(isLinkReady(APP_LINKS.pwaUrl)).toBe(true);
  });
});
