import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DECISIONS } from "./decisions";
import { makeFmt, isoDay } from "./format";
import { SALONS, SEED_REVIEWS, type Review, type Salon } from "./data";
import { publicReviews, scoreOf, toggleCompare as toggleCompareRule } from "./rules";
import { track } from "./analytics";

// Client-side demo state (no backend connected). Persisted in this browser only.
type Theme = "light" | "dark";
export type InquiryStatus = "new" | "contacted" | "closed";
export interface Inquiry { id: string; business: string; name: string; phone: string; city: string; area: string; categories: string[]; message: string; date: string; status: InquiryStatus }

interface Store {
  theme: Theme; setTheme: (t: Theme) => void;
  faDigits: boolean; setFaDigits: (v: boolean) => void;
  fmt: ReturnType<typeof makeFmt>;
  phone: string | null; displayName: string; setDisplayName: (v: string) => void;
  signIn: (phone: string) => void; signOut: () => void;
  saved: string[]; toggleSaved: (id: string) => void;
  compare: string[]; toggleCompare: (id: string) => boolean; clearCompare: () => void;
  /** All salons incl. unpublished drafts (admin). Public pages filter `published`. */
  salons: Salon[]; upsertSalon: (s: Salon) => void;
  reviews: Review[]; addReview: (r: Omit<Review, "id" | "date" | "status" | "reports" | "kind">) => void;
  updateReview: (id: string, patch: Partial<Review>) => void; reportReview: (id: string, reason: string) => void;
  inquiries: Inquiry[]; addInquiry: (i: Omit<Inquiry, "id" | "date" | "status">) => void; updateInquiry: (id: string, patch: Partial<Inquiry>) => void;
  ready: boolean;
}

const Ctx = createContext<Store | null>(null);
const KEY = "mkz-demo-v2";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DECISIONS.defaultTheme);
  const [faDigits, setFaDigits] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [phone, setPhone] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [salonEdits, setSalonEdits] = useState<Record<string, Salon>>({});
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<{ theme: Theme; faDigits: boolean; saved: string[]; compare: string[]; phone: string; displayName: string; salonEdits: Record<string, Salon>; reviews: Review[]; inquiries: Inquiry[] }>;
        if (s.theme) setThemeState(s.theme);
        if (typeof s.faDigits === "boolean") setFaDigits(s.faDigits);
        if (Array.isArray(s.saved)) setSaved(s.saved);
        if (Array.isArray(s.compare)) setCompare(s.compare.slice(0, DECISIONS.compareMax));
        if (s.phone) setPhone(s.phone);
        if (s.displayName) setDisplayName(s.displayName);
        if (s.salonEdits) setSalonEdits(s.salonEdits);
        if (Array.isArray(s.reviews)) setReviews(s.reviews);
        if (Array.isArray(s.inquiries)) setInquiries(s.inquiries);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ theme, faDigits, saved, compare, phone, displayName, salonEdits, reviews, inquiries }));
  }, [ready, theme, faDigits, saved, compare, phone, displayName, salonEdits, reviews, inquiries]);

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", theme);
    el.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const salons = useMemo(() => {
    const base = SALONS.map((s) => salonEdits[s.id] ?? s);
    const extra = Object.values(salonEdits).filter((s) => !SALONS.some((b) => b.id === s.id));
    return [...base, ...extra];
  }, [salonEdits]);

  const toggleCompare = useCallback(
    (id: string) => {
      const r = toggleCompareRule(compare, id);
      if (!r.ok) return false;
      if (!compare.includes(id)) track(compare.length === 0 ? "comparison_started" : "salon_added_to_comparison", { salon: id });
      setCompare(r.list);
      return true;
    },
    [compare],
  );

  const value = useMemo<Store>(
    () => ({
      theme, setTheme: setThemeState, faDigits, setFaDigits, fmt: makeFmt(faDigits),
      phone, displayName, setDisplayName,
      signIn: setPhone, signOut: () => setPhone(null),
      saved,
      toggleSaved: (id) =>
        setSaved((s) => {
          const has = s.includes(id);
          track(has ? "salon_removed_from_favorites" : "salon_added_to_favorites", { id });
          return has ? s.filter((x) => x !== id) : [...s, id];
        }),
      compare, toggleCompare, clearCompare: () => setCompare([]),
      salons,
      upsertSalon: (s) => setSalonEdits((m) => ({ ...m, [s.id]: s })),
      reviews,
      addReview: (r) => {
        setReviews((x) => [{ ...r, id: `r-${Date.now()}`, date: isoDay(0), status: "pending", kind: "community", reports: [] }, ...x]);
        track("review_submitted", { salon: r.salonId, evidence: !!r.evidenceSubmitted });
      },
      updateReview: (id, patch) => setReviews((x) => x.map((r) => (r.id === id ? { ...r, ...patch } : r))),
      reportReview: (id, reason) => {
        setReviews((x) => x.map((r) => (r.id === id ? { ...r, reports: [...r.reports, { reason, date: isoDay(0) }] } : r)));
        track("review_reported", { review: id });
      },
      inquiries,
      addInquiry: (i) => {
        setInquiries((x) => [{ ...i, id: `INQ-${Math.floor(1000 + Math.random() * 8999)}`, date: isoDay(0), status: "new" }, ...x]);
        track("business_inquiry_submitted", { city: i.city });
      },
      updateInquiry: (id, patch) => setInquiries((x) => x.map((q) => (q.id === id ? { ...q, ...patch } : q))),
      ready,
    }),
    [theme, faDigits, phone, displayName, saved, compare, toggleCompare, salons, reviews, inquiries, ready],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppStoreProvider");
  return v;
}
export const useFmt = () => useApp().fmt;
export const usePublicSalons = () => useApp().salons.filter((s) => s.published);
export const useSalon = (slugOrId: string) => useApp().salons.find((s) => s.slug === slugOrId || s.id === slugOrId);
export function useScore(salonId: string) {
  const { reviews } = useApp();
  return useMemo(() => scoreOf(publicReviews(reviews, salonId)), [reviews, salonId]);
}
