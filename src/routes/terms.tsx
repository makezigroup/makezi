import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, Prose } from "@/components/mk/content-page";
import { DemoNote } from "@/components/mk/core";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo("شرایط استفاده (پیش‌نویس)", "جای‌نگه‌دار شرایط استفاده از میکزی؛ متن تأییدشده هنوز منتشر نشده است."),
  component: () => (
    <ContentPage title="شرایط استفاده" body="پیش‌نویس — متن حقوقی تأییدشده نیست.">
      <Prose>
        <DemoNote>این صفحه جای‌نگه‌دار است و هیچ شرط، سیاست لغو، روش پرداخت یا کارمزدی را تعیین نمی‌کند.</DemoNote>
        <h2>موضوع‌هایی که متن نهایی باید پوشش دهد</h2>
        <ul>
          <li>نقش میکزی به‌عنوان واسط بین مشتری و سالن.</li>
          <li>سیاست لغو و تغییر نوبت (تصمیم باز).</li>
          <li>روش پرداخت و بازپرداخت (تصمیم باز).</li>
          <li>قواعد نوشتن نظر و رسیدگی به اختلاف.</li>
          <li>شرایط همکاری سالن‌ها.</li>
        </ul>
      </Prose>
    </ContentPage>
  ),
});
