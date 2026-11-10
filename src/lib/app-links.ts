// Central app-download configuration. Update marketplace URLs HERE only —
// every button on the homepage, /app page and navigation reads from this file.
// Empty string = link not published yet; the UI shows a disabled «به‌زودی» state.
export const APP_LINKS = {
  /** Official Cafe Bazaar listing — not published yet. */
  cafeBazaar: "",
  /** Official Myket listing — not published yet. */
  myket: "",
  /** PWA address used in the iPhone installation guide. */
  pwaUrl: "https://makezi.lovable.app",
} as const;

export type Platform = "android" | "ios" | "desktop";

/** Convenience-only platform hint. Never used to redirect or hide options. */
export function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

/** A marketplace link is usable only when a real https URL is configured. */
export function isLinkReady(url: string): boolean {
  return /^https:\/\/\S+$/.test(url.trim());
}
