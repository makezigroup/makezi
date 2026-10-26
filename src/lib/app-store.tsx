import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DECISIONS } from "./decisions";
import { makeFmt, isoDay } from "./format";
import type { Booking, BookingStatus } from "./data";

// Client-side demo state (no backend connected). Persisted in this browser only.
type Theme = "light" | "dark";
interface Store {
  theme: Theme;
  setTheme: (t: Theme) => void;
  faDigits: boolean;
  setFaDigits: (v: boolean) => void;
  fmt: ReturnType<typeof makeFmt>;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  setStatus: (id: string, s: BookingStatus) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  phone: string | null;
  signIn: (phone: string) => void;
  signOut: () => void;
  ready: boolean;
}

const Ctx = createContext<Store | null>(null);
const KEY = "mkz-demo-v1";

const seed = (): Booking[] => [
  { id: "MKZ-4821", salonId: "s1", serviceIds: ["n2"], staffId: "st1", date: isoDay(3), time: "11:30", status: "confirmed", customerName: "[نام شما]", phone: "09120000000", total: 450000, createdAt: isoDay(-1) },
  { id: "MKZ-4790", salonId: "s2", serviceIds: ["n3"], staffId: null, date: isoDay(6), time: "16:00", status: "pending", customerName: "[نام شما]", phone: "09120000000", total: 520000, createdAt: isoDay(0) },
  { id: "MKZ-4602", salonId: "s4", serviceIds: ["h1"], staffId: "st3", date: isoDay(-12), time: "13:00", status: "completed", customerName: "[نام شما]", phone: "09120000000", total: 380000, createdAt: isoDay(-20) },
  { id: "MKZ-4511", salonId: "s1", serviceIds: ["n1"], staffId: "st2", date: isoDay(-30), time: "10:00", status: "completed", customerName: "[نام شما]", phone: "09120000000", total: 850000, reviewed: true, createdAt: isoDay(-35) },
];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DECISIONS.defaultTheme);
  const [faDigits, setFaDigits] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>(seed);
  const [saved, setSaved] = useState<string[]>([]);
  const [phone, setPhone] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<{ theme: Theme; faDigits: boolean; bookings: Booking[]; saved: string[]; phone: string }>;
        if (s.theme) setThemeState(s.theme);
        if (typeof s.faDigits === "boolean") setFaDigits(s.faDigits);
        if (Array.isArray(s.bookings)) setBookings(s.bookings);
        if (Array.isArray(s.saved)) setSaved(s.saved);
        if (s.phone) setPhone(s.phone);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ theme, faDigits, bookings, saved, phone }));
  }, [ready, theme, faDigits, bookings, saved, phone]);

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = theme;
    el.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const addBooking = useCallback<Store["addBooking"]>((b) => {
    const nb: Booking = {
      ...b,
      id: `MKZ-${Math.floor(5000 + Math.random() * 4999)}`,
      createdAt: isoDay(0),
      status: DECISIONS.bookingMode === "instant" ? "confirmed" : "pending",
    };
    setBookings((x) => [nb, ...x]);
    return nb;
  }, []);
  const updateBooking = useCallback((id: string, patch: Partial<Booking>) => {
    setBookings((x) => x.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const value = useMemo<Store>(
    () => ({
      theme,
      setTheme: setThemeState,
      faDigits,
      setFaDigits,
      fmt: makeFmt(faDigits),
      bookings,
      addBooking,
      updateBooking,
      setStatus: (id, status) => updateBooking(id, { status }),
      saved,
      toggleSaved: (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
      phone,
      signIn: setPhone,
      signOut: () => setPhone(null),
      ready,
    }),
    [theme, faDigits, bookings, saved, phone, ready, addBooking, updateBooking],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppStoreProvider");
  return v;
}
export const useFmt = () => useApp().fmt;
