// SAMPLE DATA ONLY. Every name, number and photo is a placeholder (Brand Book rule:
// never present sample data as real). Replace with live data once a backend exists.
import heroNails from "@/assets/hero-nails.jpg";
import nailArt from "@/assets/g-nail-art.jpg";
import extension from "@/assets/g-extension.jpg";
import hair from "@/assets/g-hair.jpg";
import makeup from "@/assets/g-makeup.jpg";
import interior from "@/assets/salon-interior.jpg";
import type { IconName } from "@/components/mk/icon-data";

export const IMAGES = { heroNails, nailArt, extension, hair, makeup, interior };

export type CategoryId = "nail" | "hair" | "skin" | "makeup";
export const CATEGORIES: { id: CategoryId; label: string; icon: IconName }[] = [
  { id: "nail", label: "ناخن", icon: "nail" },
  { id: "hair", label: "مو", icon: "hair" },
  { id: "skin", label: "پوست", icon: "skin" },
  { id: "makeup", label: "آرایش", icon: "makeup" },
];

export const AREAS = ["[محله ۱]", "[محله ۲]", "[محله ۳]", "[محله ۴]"];

export type VerifyStatus = "verified" | "pending" | "unverified";

export interface Service {
  id: string;
  name: string;
  category: CategoryId;
  durationMin: number;
  price: number;
  priceFrom?: boolean;
  note?: string;
  updated: string;
}
export interface Staff {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  years: number;
}
export interface Review {
  id: string;
  author: string;
  date: string;
  service: string;
  overall: number;
  dims: number[];
  text: string;
  reply?: string;
  bookingVerified: true;
}
export interface Credential {
  label: string;
  date: string;
  status: VerifyStatus;
}
export interface Salon {
  id: string;
  slug: string;
  name: string;
  status: VerifyStatus;
  area: string;
  distanceKm: number;
  categories: CategoryId[];
  image: string;
  about: string;
  address: string;
  hours: string;
  map: { x: number; y: number };
  services: Service[];
  staff: Staff[];
  reviews: Review[];
  credentials: Credential[];
  /** days ahead (0..13) that are closed */
  closedWeekday: number;
  profileCompleteness: number;
}

const svc = (id: string, name: string, category: CategoryId, durationMin: number, price: number, extra: Partial<Service> = {}): Service => ({
  id, name, category, durationMin, price, updated: "۱۲ مهر ۱۴۰۵", ...extra,
});

const NAIL = [
  svc("n1", "کاشت ناخن ژل", "nail", 120, 850000, { priceFrom: true, note: "بر اساس طول ناخن" }),
  svc("n2", "ژلیش دست", "nail", 60, 450000),
  svc("n3", "مانیکور روسی", "nail", 75, 520000),
  svc("n4", "ترمیم کاشت", "nail", 90, 600000, { priceFrom: true }),
  svc("n5", "طراحی ناخن (هر ناخن)", "nail", 15, 60000),
];
const HAIR = [
  svc("h1", "کوتاهی مو", "hair", 45, 380000),
  svc("h2", "براشینگ", "hair", 40, 300000),
  svc("h3", "رنگ ریشه", "hair", 120, 1200000, { priceFrom: true, note: "بر اساس مقدار رنگ" }),
];
const SKIN = [
  svc("k1", "پاکسازی پوست", "skin", 75, 900000),
  svc("k2", "آبرسانی پوست", "skin", 50, 650000),
];
const MAKEUP = [
  svc("m1", "آرایش روزانه", "makeup", 60, 700000),
  svc("m2", "اصلاح و فرم‌دهی ابرو", "makeup", 30, 250000),
];

const STAFF: Staff[] = [
  { id: "st1", name: "[متخصص ۱]", role: "متخصص ناخن", specialties: ["کاشت ژل", "فرنچ"], years: 6 },
  { id: "st2", name: "[متخصص ۲]", role: "متخصص ناخن", specialties: ["مانیکور روسی", "ژلیش"], years: 4 },
  { id: "st3", name: "[متخصص ۳]", role: "متخصص مو و پوست", specialties: ["رنگ مو", "پاکسازی"], years: 8 },
];

const REVIEWS = (seed: number): Review[] => [
  { id: `r${seed}1`, author: "مریم ک.", date: "مهر ۱۴۰۵", service: "ژلیش دست", overall: 4.8, dims: [5, 4.5, 5, 4.5], text: "رنگ همان شد که در نمونه‌کار دیده بودم. قیمت هم همان بود که نوشته بود.", reply: "ممنون از شما. منتظر دیدار بعدی هستیم.", bookingVerified: true },
  { id: `r${seed}2`, author: "سارا ر.", date: "شهریور ۱۴۰۵", service: "کاشت ناخن ژل", overall: 4.0, dims: [4.5, 4, 4.5, 3], text: "کار تمیز بود ولی بیست دقیقه دیرتر از ساعت نوبت شروع شد.", bookingVerified: true },
  { id: `r${seed}3`, author: "نگار ت.", date: "شهریور ۱۴۰۵", service: "مانیکور روسی", overall: 4.6, dims: [4.5, 5, 4.5, 4.5], text: "محیط مرتب بود و ابزارها جلوی خودم از بسته‌ی استریل باز شد.", bookingVerified: true },
  { id: `r${seed}4`, author: "الهام م.", date: "مرداد ۱۴۰۵", service: "ژلیش دست", overall: 4.4, dims: [4.5, 4, 4.5, 4.5], text: "زمان کار طبق اعلام سالن یک ساعت بود و همان‌قدر طول کشید.", bookingVerified: true },
  { id: `r${seed}5`, author: "زهرا ب.", date: "مرداد ۱۴۰۵", service: "ترمیم کاشت", overall: 4.7, dims: [5, 4.5, 4.5, 5], text: "توضیح دادند چرا قیمت ترمیم برای من کمی بیشتر شد؛ قبل از شروع کار.", reply: "ممنون که نوشتید.", bookingVerified: true },
];

const CREDS: Credential[] = [
  { label: "مدرک فنی کاشت ناخن", date: "فروردین ۱۴۰۵", status: "verified" },
  { label: "مجوز بهداشت محل کار", date: "مهر ۱۴۰۵", status: "verified" },
  { label: "دستگاه استریل اتوکلاو", date: "مهر ۱۴۰۵", status: "verified" },
];

function salon(i: number, p: Partial<Salon> & Pick<Salon, "status" | "categories" | "services" | "image">): Salon {
  return {
    id: `s${i}`,
    slug: `salon-${i}`,
    name: `سالن [نام ${"۰۱۲۳۴۵۶۷۸۹"[i]}]`,
    area: AREAS[(i - 1) % AREAS.length],
    distanceKm: 0.6 + i * 0.55,
    about: "این متن نمونه است. سالن در این بخش درباره‌ی تخصص، روش کار و ابزارهای خود توضیح می‌دهد.",
    address: "[آدرس نمونه]، [محله]",
    hours: "شنبه تا پنجشنبه، ۱۰ تا ۲۰",
    map: { x: 15 + ((i * 37) % 70), y: 15 + ((i * 53) % 65) },
    staff: STAFF.slice(0, 2 + (i % 2)),
    reviews: REVIEWS(i),
    credentials: p.status === "verified" ? CREDS : CREDS.map((c) => ({ ...c, status: "pending" as const })),
    closedWeekday: 5,
    profileCompleteness: 80,
    ...p,
  };
}

export const SALONS: Salon[] = [
  salon(1, { status: "verified", categories: ["nail"], services: NAIL, image: nailArt, profileCompleteness: 95 }),
  salon(2, { status: "verified", categories: ["nail", "makeup"], services: [...NAIL.slice(1, 4), ...MAKEUP], image: heroNails, reviews: REVIEWS(2).slice(0, 2), profileCompleteness: 85 }),
  salon(3, { status: "pending", categories: ["nail"], services: NAIL.slice(0, 3).map((s) => ({ ...s, price: s.price - 70000 })), image: extension, profileCompleteness: 70 }),
  salon(4, { status: "verified", categories: ["hair", "skin"], services: [...HAIR, ...SKIN], image: hair, profileCompleteness: 90 }),
  salon(5, { status: "verified", categories: ["makeup", "skin"], services: [...MAKEUP, ...SKIN], image: makeup, reviews: [], profileCompleteness: 75 }),
  salon(6, { status: "unverified", categories: ["nail", "hair"], services: [NAIL[1], NAIL[4], HAIR[0]], image: interior, reviews: REVIEWS(6).slice(0, 1), profileCompleteness: 55 }),
];

export const getSalon = (slugOrId: string) => SALONS.find((s) => s.slug === slugOrId || s.id === slugOrId);
export const priceFrom = (s: Salon) => Math.min(...s.services.map((v) => v.price));
export const avgRating = (s: Salon) =>
  s.reviews.length ? s.reviews.reduce((a, r) => a + r.overall, 0) / s.reviews.length : 0;
export const dimAverages = (s: Salon) =>
  [0, 1, 2, 3].map((d) => (s.reviews.length ? s.reviews.reduce((a, r) => a + r.dims[d], 0) / s.reviews.length : 0));

/** Deterministic sample availability: time slots for salon + ISO day. */
const ALL_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
export function slotsFor(salonId: string, iso: string): string[] {
  const d = new Date(iso + "T12:00:00");
  const s = getSalon(salonId);
  if (s && d.getDay() === s.closedWeekday) return [];
  const seed = (Number(salonId.replace(/\D/g, "")) * 7 + d.getDate() * 3) % 5;
  return ALL_SLOTS.filter((_, i) => (i + seed) % 3 !== 0);
}
export const openSlotsToday = (s: Salon, today: string) => slotsFor(s.id, today).length;

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: CategoryId;
  serviceId: string;
  salonSlug: string;
  tags: string[];
}
export const GALLERY: GalleryItem[] = [
  { id: "g1", image: nailArt, title: "ژلیش لیمویی", category: "nail", serviceId: "n2", salonSlug: "salon-1", tags: ["ناخن کوتاه", "گرد"] },
  { id: "g2", image: extension, title: "کاشت بادامی کروم", category: "nail", serviceId: "n1", salonSlug: "salon-3", tags: ["ناخن بلند", "بادامی"] },
  { id: "g3", image: heroNails, title: "ژلیش نود صورتی", category: "nail", serviceId: "n2", salonSlug: "salon-2", tags: ["ناخن کوتاه", "بیضی"] },
  { id: "g4", image: hair, title: "براشینگ موج‌دار", category: "hair", serviceId: "h2", salonSlug: "salon-4", tags: ["موی بلند"] },
  { id: "g5", image: makeup, title: "آرایش روزانه‌ی طبیعی", category: "makeup", serviceId: "m1", salonSlug: "salon-5", tags: ["روزانه"] },
  { id: "g6", image: extension, title: "کاشت بی‌رنگ", category: "nail", serviceId: "n1", salonSlug: "salon-1", tags: ["ناخن بلند"] },
  { id: "g7", image: hair, title: "رنگ ریشه‌ی قهوه‌ای", category: "hair", serviceId: "h3", salonSlug: "salon-4", tags: ["رنگ"] },
  { id: "g8", image: nailArt, title: "مانیکور روسی", category: "nail", serviceId: "n3", salonSlug: "salon-2", tags: ["طبیعی"] },
];

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "change-requested" | "cancel-requested";
export interface Booking {
  id: string;
  salonId: string;
  serviceIds: string[];
  staffId: string | null;
  date: string;
  time: string;
  status: BookingStatus;
  customerName: string;
  phone: string;
  note?: string;
  total: number;
  reviewed?: boolean;
  createdAt: string;
}

export const BOOKING_STATUS: Record<BookingStatus, { label: string; tone: "success" | "warning" | "error" | "info" | "neutral" }> = {
  pending: { label: "در انتظار تأیید سالن", tone: "warning" },
  confirmed: { label: "تأییدشده", tone: "success" },
  completed: { label: "انجام‌شده", tone: "info" },
  cancelled: { label: "لغوشده", tone: "error" },
  "change-requested": { label: "درخواست تغییر زمان", tone: "warning" },
  "cancel-requested": { label: "درخواست لغو", tone: "warning" },
};

export const FAQ = [
  { q: "قیمت‌های میکزی از کجا می‌آید؟", a: "هر سالن قیمت خدمات خود را ثبت می‌کند و تاریخ آخرین به‌روزرسانی کنار قیمت نمایش داده می‌شود. اگر قیمت «از» باشد، دلیل تغییر آن هم نوشته می‌شود." },
  { q: "«تأییدشده» یعنی چه؟", a: "یعنی مدارک این سالن (مثل مدرک فنی و مجوز بهداشت) بررسی و تأیید شده است. این برچسب درباره‌ی مدارک است، نه تضمین کیفیت کار." },
  { q: "چه کسی می‌تواند نظر بنویسد؟", a: "فقط کسی که از طریق میکزی نوبت گرفته و نوبتش انجام شده است. به همین دلیل کنار هر نظر نوشته شده «نظر تأییدشده»." },
  { q: "پرداخت چطور انجام می‌شود؟", a: "روش پرداخت هنوز نهایی نشده است. در این نسخه پرداخت آنلاین وجود ندارد." },
  { q: "سیاست لغو نوبت چیست؟", a: "سیاست لغو هنوز تعیین نشده است. در حال حاضر می‌توانید درخواست لغو یا تغییر زمان ثبت کنید تا سالن بررسی کند." },
];
