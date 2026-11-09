// SAMPLE DATA ONLY. Every salon name, price, review and photo is a placeholder
// (Brand Book rule: never present sample data as real). In the product, the MAKEZI
// team enters and maintains all salon information through the admin panel.
import heroNails from "@/assets/hero-nails.jpg";
import nailArt from "@/assets/g-nail-art.jpg";
import extension from "@/assets/g-extension.jpg";
import hair from "@/assets/g-hair.jpg";
import makeup from "@/assets/g-makeup.jpg";
import interior from "@/assets/salon-interior.jpg";
import type { IconName } from "@/components/mk/icon-data";

export const IMAGES = { heroNails, nailArt, extension, hair, makeup, interior };
export type ImageKey = keyof typeof IMAGES;
export const IMAGE_LABEL: Record<ImageKey, string> = {
  heroNails: "ژلیش صورتی",
  nailArt: "طراحی ناخن",
  extension: "کاشت ناخن",
  hair: "مو",
  makeup: "آرایش",
  interior: "فضای سالن",
};

export type CategoryId = "nail" | "hair" | "color" | "makeup" | "lash" | "brow" | "skin" | "care";
export const CATEGORY_IDS = ["nail", "hair", "color", "makeup", "lash", "brow", "skin", "care"] as const;
export const CATEGORIES: { id: CategoryId; label: string; icon: IconName; image?: ImageKey; body: string }[] = [
  { id: "nail", label: "ناخن", icon: "nail", image: "nailArt", body: "کاشت، ژلیش، مانیکور و طراحی ناخن." },
  { id: "hair", label: "مو", icon: "hair", image: "hair", body: "کوتاهی، براشینگ و حالت‌دهی مو." },
  { id: "color", label: "رنگ و مش", icon: "hair", image: "hair", body: "رنگ ریشه، رنگ کامل، مش و لایت." },
  { id: "makeup", label: "میکاپ", icon: "makeup", image: "makeup", body: "آرایش روزانه و مجلسی." },
  { id: "lash", label: "مژه", icon: "makeup", body: "اکستنشن و لیفت مژه." },
  { id: "brow", label: "ابرو", icon: "makeup", body: "اصلاح، فرم‌دهی و لیفت ابرو." },
  { id: "skin", label: "پوست و فیشیال", icon: "skin", body: "پاکسازی، آبرسانی و مراقبت پوست." },
  { id: "care", label: "اصلاح و مراقبت", icon: "barber", body: "اپیلاسیون، اصلاح صورت و مراقبت بدن." },
];
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export interface Area { slug: string; name: string }
export interface City { slug: string; name: string; areas: Area[] }
export const CITIES: City[] = [
  {slug:'tehran',name:'تهران',areas:[{slug:'vanak',name:'ونک'},{slug:'saadat-abad',name:'سعادت‌آباد'},{slug:'narmak',name:'نارمک'},{slug:'tajrish',name:'تجریش'}]},
  {slug:'qom',name:'قم',areas:[{slug:'salarieh',name:'سالاریه'},{slug:'safashahr',name:'صفاشهر'}]},
  {slug:'karaj',name:'کرج',areas:[{slug:'azimieh',name:'عظیمیه'},{slug:'mehrshahr',name:'مهرشهر'}]},
  {slug:'isfahan',name:'اصفهان',areas:[{slug:'mardavij',name:'مرداویج'},{slug:'jolfa',name:'جلفا'}]},
  {slug:'shiraz',name:'شیراز',areas:[{slug:'maali-abad',name:'معالی‌آباد'},{slug:'ghasr-dasht',name:'قصرالدشت'}]},
  {slug:'mashhad',name:'مشهد',areas:[{slug:'sajjad',name:'سجاد'},{slug:'ahmad-abad',name:'احمدآباد'}]},
];
export const getCity = (slug: string) => CITIES.find((c) => c.slug === slug);
export const getArea = (city: string, area: string) => getCity(city)?.areas.find((a) => a.slug === area);
export const areaName = (city: string, area: string) => getArea(city, area)?.name ?? area;

export type AttrId = "women" | "parking" | "access" | "sterile" | "card";
export const ATTRIBUTES: { id: AttrId; label: string }[] = [
  { id: "women", label: "فقط بانوان" },
  { id: "parking", label: "پارکینگ" },
  { id: "access", label: "دسترسی ویلچر" },
  { id: "sterile", label: "ابزار استریل یک‌بارمصرف" },
  { id: "card", label: "پرداخت با کارت در محل" },
];

export type VerifyStatus = "verified" | "pending" | "unverified";

export interface Service {
  id: string;
  name: string;
  category: CategoryId;
  durationMin: number;
  price: number;
  /** Upper bound when the salon publishes a range. */
  priceMax?: number | undefined;
  priceFrom?: boolean | undefined;
  note?: string | undefined;
  /** ISO date of the last check by the MAKEZI team. */
  updated: string;
}
export interface Staff { id: string; name: string; role: string; specialties: string[]; years: number }
export interface Credential { label: string; date: string; status: VerifyStatus }
export interface PortfolioItem { id: string; image: ImageKey; title: string; category: CategoryId; serviceId?: string | undefined; tags: string[] }

export interface Salon {
  id: string;
  slug: string;
  name: string;
  published: boolean;
  archived?: boolean;
  isDemo?: boolean;
  status: VerifyStatus;
  city: string;
  area: string; // area slug
  address: string;
  distanceKm: number;
  categories: CategoryId[];
  image: ImageKey;
  about: string;
  phone: string;
  website?: string | undefined;
  instagram?: string | undefined;
  openHour: number;
  closeHour: number;
  /** JS weekday the salon is closed (5 = Friday). */
  closedDay: number;
  hours: string;
  attributes: AttrId[];
  map: { x: number; y: number };
  services: Service[];
  staff: Staff[];
  portfolio: PortfolioItem[];
  credentials: Credential[];
  /** ISO date the profile was published. */
  addedAt: string;
  /** ISO date the MAKEZI team last checked the profile. */
  checkedAt: string;
}

/** standard = community review; verified-visit = evidence checked by the MAKEZI team. */
export type ReviewKind = "community" | "verified-visit";
export type ReviewStatus = "pending" | "approved" | "rejected" | "hidden" | "reported";
export interface Review {
  isDemo?: boolean;
  id: string;
  salonId: string;
  author: string;
  /** Owner of the review in this demo (phone). Never shown publicly. */
  userKey?: string | undefined;
  date: string; // ISO
  service: string;
  /** One value per DECISIONS.ratingDimensions, 1..5. */
  dims: number[];
  text: string;
  title?: string;
  visitDate?: string | undefined;
  reply?: string | undefined;
  kind: ReviewKind;
  /** User asked for verification and attached evidence (evidence itself is never public). */
  evidenceSubmitted?: boolean | undefined;
  status: ReviewStatus;
  reports: { reason: string; date: string }[];
  moderationNote?: string | undefined;
}
export const reviewOverall = (r: Review) => (r.dims.length ? r.dims.reduce((a, b) => a + b, 0) / r.dims.length : 0);

const svc = (id: string, name: string, category: CategoryId, durationMin: number, price: number, extra: Partial<Service> = {}): Service => ({
  id, name, category, durationMin, price, updated: "2026-10-04", ...extra,
});

const NAIL = [
  svc("n1", "کاشت ناخن ژل", "nail", 120, 850000, { priceFrom: true, priceMax: 1100000, note: "بر اساس طول ناخن" }),
  svc("n2", "ژلیش دست", "nail", 60, 450000),
  svc("n3", "مانیکور روسی", "nail", 75, 520000),
  svc("n4", "ترمیم کاشت", "nail", 90, 600000, { priceFrom: true }),
  svc("n5", "طراحی ناخن (هر ناخن)", "nail", 15, 60000),
];
const HAIR = [
  svc("h1", "کوتاهی مو", "hair", 45, 380000),
  svc("h2", "براشینگ", "hair", 40, 300000),
  svc("c1", "رنگ ریشه", "color", 120, 1200000, { priceFrom: true, note: "بر اساس مقدار رنگ" }),
  svc("c2", "مش و لایت", "color", 240, 3500000, { priceFrom: true, priceMax: 6000000, note: "بر اساس طول و حجم مو" }),
];
const SKIN = [
  svc("k1", "پاکسازی پوست", "skin", 75, 900000),
  svc("k2", "آبرسانی پوست", "skin", 50, 650000),
  svc("k3", "اپیلاسیون صورت", "care", 30, 200000),
];
const MAKEUP = [
  svc("m1", "آرایش روزانه", "makeup", 60, 700000),
  svc("b1", "اصلاح و فرم‌دهی ابرو", "brow", 30, 250000),
  svc("l1", "اکستنشن مژه", "lash", 120, 1400000, { priceFrom: true }),
];

const STAFF: Staff[] = [
  { id: "st1", name: "[متخصص ۱]", role: "متخصص ناخن", specialties: ["کاشت ژل", "فرنچ"], years: 6 },
  { id: "st2", name: "[متخصص ۲]", role: "متخصص ناخن", specialties: ["مانیکور روسی", "ژلیش"], years: 4 },
  { id: "st3", name: "[متخصص ۳]", role: "متخصص مو و پوست", specialties: ["رنگ مو", "پاکسازی"], years: 8 },
];

const CREDS: Credential[] = [
  { label: "مدرک فنی", date: "فروردین ۱۴۰۵", status: "verified" },
  { label: "مجوز بهداشت محل کار", date: "مهر ۱۴۰۵", status: "verified" },
  { label: "پروانه‌ی کسب", date: "مهر ۱۴۰۵", status: "verified" },
];

const FA = "۰۱۲۳۴۵۶۷۸۹";
function salon(i: number, p: Partial<Salon> & Pick<Salon, "status" | "categories" | "services" | "image" | "portfolio">): Salon {
  const area = CITIES[0]!.areas[(i - 1) % 4]!;
  return {
    id: `s${i}`,
    slug: `salon-${i}`,
    name: `سالن [نام ${FA[i] ?? i}]`,
    published: true,
    city: "tehran",
    area: area.slug,
    address: `[آدرس نمونه]، ${area.name}`,
    distanceKm: 0.6 + i * 0.55,
    about: "این متن نمونه است. تیم میکزی در این بخش اطلاعات بررسی‌شده درباره‌ی تخصص، روش کار و فضای سالن را می‌نویسد.",
    phone: `0210000000${i}`,
    instagram: `salon_sample_${i}`,
    openHour: 10,
    closeHour: 20,
    closedDay: 5,
    hours: "شنبه تا پنجشنبه، ۱۰ تا ۲۰",
    attributes: ["women", "card"],
    map: { x: 15 + ((i * 37) % 70), y: 15 + ((i * 53) % 65) },
    staff: STAFF.slice(0, 2 + (i % 2)),
    credentials: p.status === "verified" ? CREDS : CREDS.map((c) => ({ ...c, status: "pending" as const })),
    addedAt: `2026-${String(4 + i).padStart(2, "0")}-1${i}`,
    checkedAt: "2026-10-04",
    ...p,
  };
}

const pf = (id: string, image: ImageKey, title: string, category: CategoryId, serviceId: string | undefined, tags: string[]): PortfolioItem => ({ id, image, title, category, serviceId, tags });

export const SALONS: Salon[] = [
  salon(1, { status: "verified", categories: ["nail"], services: NAIL, image: "nailArt", attributes: ["women", "sterile", "card"], portfolio: [pf("g1", "nailArt", "ژلیش لیمویی", "nail", "n2", ["ناخن کوتاه"]), pf("g6", "extension", "کاشت بی‌رنگ", "nail", "n1", ["ناخن بلند"])] }),
  salon(2, { status: "verified", categories: ["nail", "makeup", "brow", "lash"], services: [...NAIL.slice(1, 4), ...MAKEUP], image: "heroNails", attributes: ["women", "parking", "card"], portfolio: [pf("g3", "heroNails", "ژلیش نود صورتی", "nail", "n2", ["بیضی"]), pf("g8", "nailArt", "مانیکور روسی", "nail", "n3", ["طبیعی"])] }),
  salon(3, { status: "pending", categories: ["nail"], services: NAIL.slice(0, 3).map((s) => ({ ...s, price: s.price - 70000, updated: "2026-08-20" })), image: "extension", portfolio: [pf("g2", "extension", "کاشت بادامی کروم", "nail", "n1", ["بادامی"])], checkedAt: "2026-08-20" }),
  salon(4, { status: "verified", categories: ["hair", "color", "skin", "care"], services: [...HAIR, ...SKIN], image: "hair", attributes: ["women", "access", "parking", "card"], website: "https://example.com", portfolio: [pf("g4", "hair", "براشینگ موج‌دار", "hair", "h2", ["موی بلند"]), pf("g7", "hair", "رنگ ریشه‌ی قهوه‌ای", "color", "c1", ["رنگ"])] }),
  salon(5, { status: "verified", categories: ["makeup", "brow", "lash", "skin"], services: [...MAKEUP, ...SKIN.slice(0, 2)], image: "makeup", attributes: ["women", "sterile"], portfolio: [pf("g5", "makeup", "آرایش روزانه‌ی طبیعی", "makeup", "m1", ["روزانه"])] }),
  salon(6, { status: "unverified", categories: ["nail", "hair"], services: [NAIL[1]!, NAIL[4]!, HAIR[0]!], image: "interior", attributes: [], portfolio: [], instagram: undefined, checkedAt: "2026-06-01", closeHour: 18 }),
];

export const getStaticSalon = (slugOrId: string) => SALONS.find((s) => s.slug === slugOrId || s.id === slugOrId);
export const priceFrom = (s: Salon) => { const prices=s.services.map(v=>v.price).filter(v=>v>0); return prices.length ? Math.min(...prices) : 0; };
export const priceTop = (s: Salon) => (s.services.length ? Math.max(...s.services.map((v) => v.priceMax ?? v.price)) : 0);

/** Open now from the published hours (hours are as entered by the MAKEZI team). */
export function isOpenAt(s: Salon, d: Date) {
  if (d.getDay() === s.closedDay) return false;
  const h = d.getHours() + d.getMinutes() / 60;
  return h >= s.openHour && h < s.closeHour;
}

const R = (salonId: string, n: number, author: string, date: string, service: string, dims: number[], text: string, extra: Partial<Review> = {}): Review => ({
  id: `r-${salonId}-${n}`, salonId, author, date, service, dims, text, kind: "community", status: "approved", reports: [], ...extra,
});
const REVIEW_SET = (id: string): Review[] => [
  R(id, 1, "مریم ک.", "2026-10-02", "ژلیش دست", [5, 5, 4.5, 5, 4, 5], "رنگ همان شد که در نمونه‌کار دیده بودم. قیمت هم همان بود که نوشته شده بود.", { kind: "verified-visit", reply: "ممنون از شما." }),
  R(id, 2, "سارا ر.", "2026-09-18", "کاشت ناخن ژل", [4, 4.5, 4, 4, 3.5, 4], "کار تمیز بود ولی بیست دقیقه دیرتر از ساعتی که گفته بودند شروع شد."),
  R(id, 3, "نگار ت.", "2026-09-05", "مانیکور روسی", [4.5, 5, 4.5, 4.5, 4, 4.5], "محیط مرتب بود و ابزارها جلوی خودم از بسته‌ی استریل باز شد.", { kind: "verified-visit" }),
  R(id, 4, "الهام م.", "2026-08-21", "ژلیش دست", [4.5, 4, 4.5, 4.5, 4, 4.5], "زمان کار حدود یک ساعت بود، همان‌طور که در صفحه نوشته شده."),
  R(id, 5, "زهرا ب.", "2026-08-02", "ترمیم کاشت", [5, 4.5, 4.5, 5, 4, 5], "قبل از شروع کار توضیح دادند چرا قیمت ترمیم برای من کمی بیشتر شد.", { reply: "ممنون که نوشتید." }),
];

export const SEED_REVIEWS: Review[] = [
  ...REVIEW_SET("s1"),
  ...REVIEW_SET("s2").slice(0, 2),
  ...REVIEW_SET("s3").slice(0, 3),
  ...REVIEW_SET("s4"),
  ...REVIEW_SET("s6").slice(0, 1),
  R("s4", 9, "کاربر نمونه", "2026-10-06", "کوتاهی مو", [2, 3, 2, 2, 2, 2], "نمونه‌ی نظری که منتظر بررسی تیم میکزی است.", { status: "pending", evidenceSubmitted: true }),
  R("s1", 9, "کاربر نمونه", "2026-10-05", "ژلیش دست", [1, 1, 1, 1, 1, 1], "نمونه‌ی نظر گزارش‌شده برای آزمایش صف بررسی.", { reports: [{ reason: "محتوای نامرتبط", date: "2026-10-06" }] }),
];

export interface GalleryItem extends PortfolioItem { salonId: string }
export const galleryOf = (salons: Salon[]): GalleryItem[] => salons.flatMap((s) => s.portfolio.map((p) => ({ ...p, salonId: s.id })));

export const FAQ = [
  { q: "اطلاعات سالن‌ها از کجا می‌آید؟", a: "تیم میکزی اطلاعات هر سالن (خدمات، قیمت، ساعت کاری، تماس و نمونه‌کار) را جمع‌آوری، بررسی و منتشر می‌کند. تاریخ آخرین بررسی کنار اطلاعات نوشته می‌شود." },
  { q: "آیا میکزی نوبت رزرو می‌کند؟", a: "نه. میکزی راهنمای پیدا کردن، بررسی و مقایسه‌ی سالن‌هاست. برای هماهنگی، مستقیم با خود سالن تماس بگیرید." },
  { q: "قیمت‌ها قطعی است؟", a: "قیمت‌ها همان چیزی است که سالن در زمان بررسی اعلام کرده است. قیمت نهایی را سالن تعیین می‌کند و ممکن است تغییر کرده باشد." },
  { q: "«مدارک تأییدشده» یعنی چه؟", a: "یعنی تیم میکزی مدارکی مثل مدرک فنی و مجوز بهداشت را دیده و بررسی کرده است. این برچسب درباره‌ی مدارک است، نه تضمین کیفیت کار." },
  { q: "«مراجعه‌ی تأییدشده» در نظرها یعنی چه؟", a: "نویسنده‌ی نظر مدرکی از مراجعه (مثل رسید) فرستاده و تیم میکزی آن را بررسی کرده است. خود مدرک هرگز عمومی نمی‌شود. بقیه‌ی نظرها «نظر کاربر» هستند." },
  { q: "سالن می‌تواند نظر منفی را حذف کند؟", a: "نه. سالن فقط می‌تواند پاسخ عمومی بنویسد. حذف یا پنهان کردن نظر فقط با بررسی تیم میکزی و طبق قوانین محتوا انجام می‌شود." },
];
