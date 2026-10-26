// Open decisions from Brand Book 3.0 / roadmap. Each value is a reversible
// implementation default, NOT an approved business rule. Change here only.
export const DECISIONS = {
  /** Instant vs request-based booking — open. Default: request (salon confirms). */
  bookingMode: "request" as "request" | "instant",
  /** Payment method — open. No online payment is implemented. */
  onlinePayment: false,
  /** Cancellation policy — open. No policy text is shown as binding. */
  cancellationPolicyApproved: false,
  /** Unverified salons public? — open. Default: shown, clearly labelled, filterable. */
  showUnverifiedSalons: true,
  /** Insufficient-review display rule — open. Default threshold for showing a score. */
  minReviewsForScore: 5,
  /** Rating dimension names (BB-4) — open. Placeholders. */
  ratingDimensions: ["[بعد ۱]", "[بعد ۲]", "[بعد ۳]", "[بعد ۴]"],
  /** Independent specialists in launch — open. Not included. */
  independentSpecialists: false,
  /** "Request this model" behaviour — open. Default: goes to salon booking with service preselected. */
  modelRequest: "book-service" as const,
  /** Default theme (BB-3) — open. Light is only the baseline. */
  defaultTheme: "light" as "light" | "dark",
};

export const OPEN_DECISIONS: { id: string; title: string; current: string }[] = [
  { id: "BB-1", title: "شعار نهایی", current: "از «انتخاب آگاهانه در زیبایی» فقط به‌عنوان جوهره استفاده شده، نه شعار لوگو." },
  { id: "BB-3", title: "تم پیش‌فرض", current: "روشن به‌عنوان مبنا؛ تم تیره با کلید قابل انتخاب است." },
  { id: "BB-4", title: "نام ابعاد امتیاز", current: "نام‌ها با [بعد ۱] تا [بعد ۴] جای‌گذاری شده‌اند." },
  { id: "OD-08-4", title: "قاعده‌ی امتیاز کلی", current: "میانگین ساده‌ی نظرهای تأییدشده؛ زیر ۵ نظر امتیاز نمایش داده نمی‌شود." },
  { id: "BB-5", title: "متن حقوقی رضایت تصویر", current: "متن تأییدشده موجود نیست؛ جای آن مشخص شده است." },
  { id: "BB-7", title: "سهم لیمویی در محصول", current: "لیمویی فقط برای اقدام اصلی هر صفحه و لحظه‌های برند." },
  { id: "BK-1", title: "رزرو فوری یا درخواستی", current: "درخواستی: نوبت تا تأیید سالن «در انتظار تأیید» است." },
  { id: "PY-1", title: "روش پرداخت", current: "پرداخت آنلاین پیاده‌سازی نشده است." },
  { id: "CN-1", title: "سیاست لغو", current: "سیاستی اعلام نشده؛ لغو فقط به‌صورت درخواست ثبت می‌شود." },
  { id: "MD-1", title: "رفتار «درخواست این مدل»", current: "به رزرو همان خدمت در سالن سازنده هدایت می‌شود." },
  { id: "SP-1", title: "متخصصان مستقل", current: "در این نسخه فقط سالن‌ها حضور دارند." },
  { id: "VR-1", title: "نمایش سالن‌های تأییدنشده", current: "با برچسب «در انتظار تأیید» نمایش داده می‌شوند و قابل فیلترند." },
  { id: "BB-9", title: "فایل‌های برداری نهایی لوگو", current: "از SVG موجود در سیستم طراحی استفاده شده است." },
];
