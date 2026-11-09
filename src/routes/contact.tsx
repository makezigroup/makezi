import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ContentPage } from "@/components/mk/content-page";
import { Button, DemoNote, Field, inputCls } from "@/components/mk/core";
import { isValidPhone } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("تماس و پشتیبانی", "پیام خود را برای پشتیبانی میکزی بنویسید.", { path: "/contact" }),
  component: Contact,
});

function Contact() {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState<{ phone?: string; msg?: string }>({});
  return (
    <ContentPage title="تماس و پشتیبانی" body="پیام خود را بنویسید؛ پشتیبانی با شماره‌ی شما تماس می‌گیرد.">
      <form
        noValidate
        className="flex max-w-xl flex-col gap-4 rounded-card bg-card p-6 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          const ne: typeof err = {};
          if (!isValidPhone(phone)) ne.phone = "شماره‌ی موبایل ۱۱ رقم است و با ۰۹ شروع می‌شود.";
          if (msg.trim().length < 10) ne.msg = "پیام دست‌کم ۱۰ نویسه باشد.";
          setErr(ne);
          if (Object.keys(ne).length) return;
          toast.success("پیام شما در این مرورگر ثبت شد.", { description: "ارسال واقعی پس از اتصال پشتیبانی فعال می‌شود." });
          setMsg("");
        }}
      >
        <Field label="شماره‌ی موبایل" htmlFor="cphone" error={err.phone}>
          <input id="cphone" inputMode="tel" dir="ltr" className={inputCls + " text-start"} value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!err.phone} placeholder="09xxxxxxxxx" />
        </Field>
        <Field label="پیام" htmlFor="cmsg" error={err.msg}>
          <textarea id="cmsg" rows={5} className={inputCls + " py-3"} value={msg} onChange={(e) => setMsg(e.target.value)} aria-invalid={!!err.msg} />
        </Field>
        <Button type="submit">ارسال پیام</Button>
        <DemoNote>نشانی، تلفن و ایمیل رسمی پشتیبانی هنوز اعلام نشده و اینجا ساخته نشده است.</DemoNote>
      </form>
    </ContentPage>
  );
}
