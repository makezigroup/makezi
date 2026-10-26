import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, Prose } from "@/components/mk/content-page";
import { DemoNote } from "@/components/mk/core";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("حریم خصوصی (پیش‌نویس)", "جای‌نگه‌دار سیاست حریم خصوصی میکزی؛ متن تأییدشده هنوز منتشر نشده است."),
  component: () => (
    <ContentPage title="حریم خصوصی" body="پیش‌نویس — متن حقوقی تأییدشده نیست.">
      <Prose>
        <DemoNote>این صفحه جای‌نگه‌دار است. سیاست حریم خصوصی رسمی میکزی هنوز تهیه یا تأیید نشده و این متن هیچ تعهد حقوقی ایجاد نمی‌کند.</DemoNote>
        <h2>موضوع‌هایی که متن نهایی باید پوشش دهد</h2>
        <ul>
          <li>چه اطلاعاتی از مشتری و سالن جمع‌آوری می‌شود (مثل شماره‌ی موبایل و سابقه‌ی رزرو).</li>
          <li>نگهداری و دسترسی به مدارک بارگذاری‌شده‌ی سالن‌ها (این مدارک نباید عمومی باشند).</li>
          <li>رضایت استفاده از تصویر در نمونه‌کار و گالری (تصمیم باز BB-5).</li>
          <li>حقوق کاربر برای اصلاح یا حذف اطلاعات.</li>
        </ul>
      </Prose>
    </ContentPage>
  ),
});
