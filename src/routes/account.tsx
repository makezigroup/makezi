import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "@/components/mk/layout";
import { Button, DemoNote, Icon, StatePanel, btn } from "@/components/mk/core";
import { Switch } from "@/components/ui/switch";
import { useApp, useFmt } from "@/lib/app-store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => seo("حساب من", "اطلاعات حساب، تنظیمات نمایش و دسترسی سریع به نوبت‌ها.", { noindex: true }),
  component: Account,
});

function Account() {
  const { phone, signOut, theme, setTheme, faDigits, setFaDigits, bookings, saved } = useApp();
  const fmt = useFmt();
  return (
    <SiteLayout>
      <PageIntro title="حساب من" />
      <div className="container-mk grid max-w-4xl gap-6">
        {!phone ? (
          <StatePanel icon="profile" title="وارد حساب خود نشده‌اید" body="برای دیدن و مدیریت نوبت‌ها با شماره‌ی موبایل وارد شوید." action={<Link to="/login" className={btn()}>ورود با موبایل</Link>} />
        ) : (
          <section className="flex flex-wrap items-center gap-4 rounded-card bg-card p-5 shadow-card">
            <span className="grid size-14 place-items-center rounded-full bg-muted"><Icon name="profile" /></span>
            <div className="flex-1">
              <p className="font-semibold">کاربر میکزی</p>
              <bdi dir="ltr" className="font-mono text-caption text-muted-foreground">{fmt.digits(phone)}</bdi>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>خروج</Button>
          </section>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/my-bookings" className="flex items-center gap-3 rounded-card bg-card p-5 text-foreground no-underline shadow-card hover:shadow-modal">
            <Icon name="calendar" /> <span className="flex-1 font-semibold">نوبت‌های من</span> <span className="text-caption text-muted-foreground">{fmt.num(bookings.length)}</span>
          </Link>
          <Link to="/saved" className="flex items-center gap-3 rounded-card bg-card p-5 text-foreground no-underline shadow-card hover:shadow-modal">
            <Icon name="save" /> <span className="flex-1 font-semibold">ذخیره‌شده‌ها</span> <span className="text-caption text-muted-foreground">{fmt.num(saved.length)}</span>
          </Link>
        </div>
        <section className="flex flex-col gap-2 rounded-card bg-card p-5 shadow-card">
          <h2 className="text-h3">تنظیمات نمایش</h2>
          <label className="flex min-h-12 items-center justify-between">تم تیره <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} /></label>
          <label className="flex min-h-12 items-center justify-between">ارقام فارسی <Switch checked={faDigits} onCheckedChange={setFaDigits} /></label>
          <p className="text-label text-muted-foreground">تم پیش‌فرض محصول هنوز تصمیم‌گیری نشده است (BB-3).</p>
        </section>
        <DemoNote>ورود و حساب کاربری در این نسخه نمایشی است و به سرور متصل نیست.</DemoNote>
      </div>
    </SiteLayout>
  );
}
