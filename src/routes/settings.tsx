import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { DemoNote, Field, inputCls } from "@/components/mk/core";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => seo("تنظیمات", "تنظیمات نمایش و نام نمایشی در نظرها.", { noindex: true }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme, faDigits, setFaDigits, displayName, setDisplayName, phone } = useApp();
  return (
    <SiteLayout>
      <PageIntro title="تنظیمات" />
      <div className="container-mk flex max-w-2xl flex-col gap-6">
        {phone && (
          <section className="rounded-card bg-card p-5 shadow-card">
            <Field label="نام نمایشی در نظرها" htmlFor="dn" hint="اگر خالی بماند «کاربر میکزی» نمایش داده می‌شود. شماره‌ی موبایل هرگز عمومی نمی‌شود.">
              <input id="dn" className={inputCls} value={displayName} maxLength={30} onChange={(e) => setDisplayName(e.target.value)} />
            </Field>
          </section>
        )}
        <section className="flex flex-col gap-2 rounded-card bg-card p-5 shadow-card">
          <h2 className="text-h3">نمایش</h2>
          <label className="flex min-h-12 items-center justify-between">تم تیره <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} /></label>
          <label className="flex min-h-12 items-center justify-between">ارقام فارسی <Switch checked={faDigits} onCheckedChange={setFaDigits} /></label>
        </section>
        <DemoNote>تنظیمات فقط در همین مرورگر ذخیره می‌شود.</DemoNote>
      </div>
    </SiteLayout>
  );
}
