import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/mk/content-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { btn } from "@/components/mk/core";
import { FAQ } from "@/lib/data";
import { OPEN_DECISIONS } from "@/lib/decisions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/help")({
  head: () => seo("راهنما و پرسش‌های رایج", "پاسخ پرسش‌های رایج درباره‌ی قیمت‌ها، تأیید مدارک، نظرها، مقایسه و تماس با سالن در میکزی."),
  component: () => (
    <ContentPage title="راهنما و پرسش‌های رایج">
      <Accordion type="single" collapsible className="max-w-3xl rounded-card bg-card px-5 shadow-card">
        {FAQ.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-start text-body font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="text-body text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-h3">موارد هنوز تصمیم‌گیری‌نشده</h2>
        <p className="mt-1 text-muted-foreground">این نسخه برای موارد زیر پیش‌فرض موقت دارد؛ هیچ‌کدام قاعده‌ی نهایی نیست.</p>
        <ul className="mt-4 divide-y divide-border rounded-card bg-card shadow-card">
          {OPEN_DECISIONS.map((d) => (
            <li key={d.id} className="grid gap-1 p-4 sm:grid-cols-[6rem_10rem_1fr]">
              <bdi dir="ltr" className="font-mono text-caption text-muted-foreground">{d.id}</bdi>
              <span className="font-semibold">{d.title}</span>
              <span className="text-caption text-muted-foreground">{d.current}</span>
            </li>
          ))}
        </ul>
      </section>
      <Link to="/contact" className={btn({ variant: "outline" }) + " mt-8"}>تماس با پشتیبانی</Link>
    </ContentPage>
  ),
});
