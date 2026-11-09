// Product rules and open decisions. Values marked "open" are reversible
// implementation defaults, NOT approved business rules. Change here only.
export const DECISIONS = {
  /** Unverified salons public? — open. Default: shown, clearly labelled, filterable. */
  showUnverifiedSalons: true,
  /** Minimum approved reviews before a score is shown — open default. */
  minReviewsForScore: 3,
  /** Rating dimensions — decided by the product brief. */
  ratingDimensions: ["کیفیت خدمات", "بهداشت و نظافت", "رفتار کارکنان", "حرفه‌ای‌بودن", "ارزش در برابر هزینه", "تجربه‌ی کلی"],
  /** Maximum salons in a comparison. */
  compareMax: 3,
  /** Minimum review text length. */
  reviewMinChars: 20,
  /** Default theme (BB-3) — open. Light is only the baseline. */
  defaultTheme: "light" as "light" | "dark",
};

export const OPEN_DECISIONS: { id: string; title: string; current: string }[] = [
  { id: "BB-1", title: "شعار نهایی", current: "از «انتخاب آگاهانه در زیبایی» فقط به‌عنوان جوهره استفاده شده، نه شعار لوگو." },
  { id: "BB-3", title: "تم پیش‌فرض", current: "روشن به‌عنوان مبنا؛ تم تیره با کلید قابل انتخاب است." },
  { id: "RV-1", title: "حداقل نظر برای نمایش امتیاز", current: "زیر ۳ نظر منتشرشده، امتیاز کلی نمایش داده نمی‌شود." },
  { id: "RV-2", title: "مدارک قابل قبول برای «مراجعه‌ی تأییدشده»", current: "رسید یا فاکتور، تصویر پیام هماهنگی؛ فهرست نهایی تأیید نشده است." },
  { id: "RV-3", title: "قوانین محتوای نظرها", current: "متن تأییدشده موجود نیست؛ فعلاً معیارهای عمومی (بی‌احترامی، تبلیغ، اطلاعات شخصی) اعمال می‌شود." },
  { id: "BB-5", title: "متن حقوقی رضایت تصویر", current: "متن تأییدشده موجود نیست؛ جای آن مشخص شده است." },
  { id: "BB-7", title: "سهم لیمویی در محصول", current: "لیمویی فقط برای اقدام اصلی هر صفحه و لحظه‌های برند." },
  { id: "VR-1", title: "نمایش سالن‌های تأییدنشده", current: "با برچسب نمایش داده می‌شوند و قابل فیلترند." },
  { id: "BB-9", title: "فایل‌های برداری نهایی لوگو", current: "از SVG موجود در سیستم طراحی استفاده شده است." },
];
