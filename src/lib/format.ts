// Persian number/price/rating formatting (Brand Book typesetting rules).
const FA = "۰۱۲۳۴۵۶۷۸۹";

export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => FA[Number(d)]);

export function makeFmt(faDigits: boolean) {
  const digits = (s: string | number) => (faDigits ? toFa(s) : String(s));
  const num = (n: number) =>
    digits(Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, faDigits ? "٬" : ","));
  return {
    digits,
    num,
    /** ۲۵۰٬۰۰۰ تومان */
    price: (n: number) => `${num(n)} تومان`,
    /** ۴٫۶ */
    rating: (r: number) => digits(r.toFixed(1).replace(".", faDigits ? "٫" : ".")),
    /** ۴٫۶ از ۵ */
    ratingOf5: (r: number) => `${digits(r.toFixed(1).replace(".", faDigits ? "٫" : "."))} از ${digits(5)}`,
    duration: (min: number) => `${digits(min)} دقیقه`,
    date: (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) =>
      new Intl.DateTimeFormat(faDigits ? "fa-IR-u-ca-persian" : "fa-IR-u-ca-persian-nu-latn", opts).format(
        new Date(iso + "T12:00:00"),
      ),
  };
}

export type Fmt = ReturnType<typeof makeFmt>;

export function isoDay(offset: number, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

/** Mobile rule: 11 digits starting with 09 (accepts Persian digits). */
export function normalizePhone(v: string) {
  return v.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/\D/g, "");
}
export const isValidPhone = (v: string) => /^09\d{9}$/.test(normalizePhone(v));
