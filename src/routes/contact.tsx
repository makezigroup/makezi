import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/mk/content-page";
import { DemoNote } from "@/components/mk/core";
import { SupportForm } from "@/components/mk/support-form";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("تماس و پشتیبانی", "پیام خود را برای پشتیبانی میکزی بنویسید.", { path: "/contact" }),
  component: Contact,
});

function Contact() {
  return (
    <ContentPage title="تماس و پشتیبانی" body="پیام شما برای رسیدگی تیم میکزی ثبت می‌شود.">
      <SupportForm />
      <DemoNote className="mt-6">نشانی، تلفن و ایمیل رسمی پشتیبانی هنوز اعلام نشده است.</DemoNote>
    </ContentPage>
  );
}
