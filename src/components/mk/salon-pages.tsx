import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashTitle } from "./layout";
import { Button, Card, DemoNote, Icon, StatePanel, btn, inputCls } from "./core";
import { ReviewCard, RatingSummary } from "./marketplace";
import { useApp, useFmt, useSalon } from "@/lib/app-store";

/** The signed-in business in this demo. Owners can only read reviews and reply publicly. */
const ME_ID = "s1";

export const SALON_NAV = [
  { to: "/salon", label: "پیشخوان", icon: "salon" as const, exact: true },
  { to: "/salon/reviews", label: "نظرها و پاسخ", icon: "review" as const },
];

export function SalonHome() {
  const me = useSalon(ME_ID)!;
  const { reviews } = useApp();
  const fmt = useFmt();
  const mine = reviews.filter((r) => r.salonId === ME_ID && r.status === "approved");
  const unanswered = mine.filter((r) => !r.reply).length;
  return (
    <>
      <DashTitle title={me.name} body="اطلاعات این صفحه را تیم میکزی منتشر می‌کند. شما می‌توانید نظرها را بخوانید و پاسخ عمومی بنویسید." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name="review" /></span>
          <div><p className="text-caption text-muted-foreground">نظرهای منتشرشده</p><p className="text-h2">{fmt.num(mine.length)}</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-muted"><Icon name="support" /></span>
          <div><p className="text-caption text-muted-foreground">بدون پاسخ</p><p className="text-h2">{fmt.num(unanswered)}</p></div>
        </Card>
      </div>
      <Card className="mt-6 flex flex-col gap-3">
        <h2 className="text-h3">اطلاعات سالن نادرست است؟</h2>
        <p className="text-muted-foreground">قیمت، ساعت کاری، تماس یا نمونه‌کار را تیم میکزی ثبت می‌کند. برای اصلاح، درخواست بفرستید تا پس از بررسی به‌روز شود.</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/for-salons" className={btn({ variant: "outline", size: "sm" })}>درخواست اصلاح اطلاعات</Link>
          <Link to="/salons/$slug" params={{ slug: me.slug }} className={btn({ variant: "ghost", size: "sm" })}>دیدن صفحه‌ی عمومی</Link>
        </div>
      </Card>
      <DemoNote className="mt-6">پنل سالن نمایشی است و ورود ندارد. در نسخه‌ی نهایی فقط مالک تأییدشده‌ی سالن به آن دسترسی دارد. سالن نمی‌تواند نظری را حذف یا ویرایش کند.</DemoNote>
    </>
  );
}

export function SalonReviews() {
  const { reviews, updateReview } = useApp();
  const mine = reviews.filter((r) => r.salonId === ME_ID && r.status === "approved");
  return (
    <>
      <DashTitle title="نظرها و پاسخ" body="به نظرهای منتشرشده پاسخ عمومی دهید. حذف یا ویرایش نظر امکان‌پذیر نیست؛ اگر نظری خلاف قوانین است، گزارش دهید." />
      <RatingSummary salonId={ME_ID} />
      {mine.length === 0 ? (
        <div className="mt-6"><StatePanel icon="review" title="هنوز نظری منتشر نشده است" /></div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {mine.map((r) => (
            <div key={r.id} className="flex flex-col gap-2">
              <ReviewCard r={r} />
              {!r.reply && <ReplyBox id={r.id} onSend={(t) => { updateReview(r.id, { reply: t }); toast.success("پاسخ منتشر شد."); }} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ReplyBox({ id, onSend }: { id: string; onSend: (t: string) => void }) {
  const [t, setT] = useState("");
  const [err, setErr] = useState("");
  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        const v = t.trim();
        if (v.length < 5) return setErr("پاسخ دست‌کم ۵ نویسه باشد.");
        if (v.length > 600) return setErr("پاسخ حداکثر ۶۰۰ نویسه است.");
        onSend(v);
      }}
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={"rp-" + id}>پاسخ سالن</label>
        <input id={"rp-" + id} aria-invalid={!!err} className={inputCls} placeholder="پاسخ عمومی سالن…" value={t} onChange={(e) => { setT(e.target.value); setErr(""); }} />
        <Button type="submit" variant="ink">ارسال</Button>
      </div>
      {err && <p role="alert" className="text-caption text-error-text">{err}</p>}
    </form>
  );
}
