import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/mk/layout";
import { Button, DemoNote, StatePanel, btn } from "@/components/mk/core";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/verify")({
  head: () => seo("تأیید کد", "کد پیامک‌شده را وارد کنید.", { noindex: true }),
  component: Verify,
});

const DEMO_CODE = "12345";

function Verify() {
  const nav = useNavigate();
  const { signIn } = useApp();
  const fmt = useFmt();
  const [phone, setPhone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [left, setLeft] = useState(90);
  useEffect(() => setPhone(sessionStorage.getItem("mkz-otp-phone")), []);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (phone === null)
    return (
      <SiteLayout footer={false}>
        <div className="container-mk py-16"><StatePanel icon="call" title="ابتدا شماره‌ی موبایل را وارد کنید" action={<Link to="/login" className={btn()}>ورود</Link>} /></div>
      </SiteLayout>
    );

  return (
    <SiteLayout footer={false}>
      <div className="container-mk grid min-h-[70vh] place-items-center py-10">
        <form
          className="flex w-full max-w-md flex-col gap-5 rounded-sheet bg-card p-6 shadow-modal md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (code !== DEMO_CODE) return setErr("کد درست نیست. دوباره وارد کنید یا کد جدید بگیرید.");
            signIn(phone);
            toast.success("وارد شدید.");
            nav({ to: "/my-bookings" });
          }}
        >
          <h1 className="text-h2">کد تأیید</h1>
          <p className="text-muted-foreground">کد ۵ رقمی ارسال‌شده به <bdi dir="ltr" className="font-mono">{fmt.digits(phone)}</bdi> را وارد کنید.</p>
          <div dir="ltr" className="self-center">
            <InputOTP maxLength={5} value={code} onChange={(v) => { setCode(v); setErr(""); }} aria-label="کد تأیید">
              <InputOTPGroup>
                {[0, 1, 2, 3, 4].map((i) => <InputOTPSlot key={i} index={i} className="size-12 text-h3" />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {err && <p role="alert" className="text-caption text-error-text">{err}</p>}
          <Button type="submit" disabled={code.length < 5}>تأیید و ورود</Button>
          <button type="button" disabled={left > 0} onClick={() => setLeft(90)} className="text-caption text-muted-foreground disabled:opacity-60">
            {left > 0 ? `ارسال دوباره تا ${fmt.digits(left)} ثانیه‌ی دیگر` : "ارسال دوباره‌ی کد"}
          </button>
          <Link to="/login" className="text-caption">تغییر شماره</Link>
          <DemoNote>کد نمایشی: <bdi dir="ltr" className="font-mono">12345</bdi></DemoNote>
        </form>
      </div>
    </SiteLayout>
  );
}
