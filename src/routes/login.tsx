import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/mk/layout";
import { Button, DemoNote, Field, LogoMark, inputCls } from "@/components/mk/core";
import { isValidPhone, normalizePhone } from "@/lib/format";
import { seo } from "@/lib/seo";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  head: () => seo("ورود با موبایل", "با شماره‌ی موبایل وارد میکزی شوید.", { noindex: true }),
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  return (
    <SiteLayout footer={false}>
      <div className="container-mk grid min-h-[70vh] place-items-center py-10">
        <form
          noValidate
          className="flex w-full max-w-md flex-col gap-5 rounded-sheet bg-card p-6 shadow-modal md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isValidPhone(phone)) return setErr("شماره‌ی موبایل ۱۱ رقم است و با ۰۹ شروع می‌شود.");
            sessionStorage.setItem("mkz-otp-phone", normalizePhone(phone));
            // Only same-site paths are allowed as a return target.
            if (redirect?.startsWith("/") && !redirect.startsWith("//")) sessionStorage.setItem("mkz-return", redirect);
            else sessionStorage.removeItem("mkz-return");
            nav({ to: "/verify" });
          }}
        >
          <LogoMark className="h-8 w-auto self-start text-foreground" />
          <div>
            <h1 className="text-h2">ورود یا ثبت‌نام</h1>
            <p className="mt-1 text-muted-foreground">کد تأیید به شماره‌ی شما پیامک می‌شود.</p>
          </div>
          <Field label="شماره‌ی موبایل" htmlFor="lp" error={err}>
            <input id="lp" dir="ltr" inputMode="tel" autoComplete="tel" className={inputCls + " text-start font-mono"} value={phone} onChange={(e) => { setPhone(e.target.value); setErr(""); }} aria-invalid={!!err} placeholder="09xxxxxxxxx" />
          </Field>
          <Button type="submit">دریافت کد</Button>
          <DemoNote>ارسال پیامک هنوز متصل نیست. در این نسخه‌ی نمایشی کد <bdi dir="ltr" className="font-mono">12345</bdi> را وارد کنید.</DemoNote>
        </form>
      </div>
    </SiteLayout>
  );
}
