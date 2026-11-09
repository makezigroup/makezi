import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { DashShell } from "@/components/mk/layout";
import { ADMIN_NAV } from "@/components/mk/admin-pages";
import { useApp } from "@/lib/app-store";
import { StatePanel, btn } from "@/components/mk/core";
import { SiteLayout } from "@/components/mk/layout";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => seo("مدیریت داخلی", "ابزار داخلی تأیید سالن‌ها و نظارت بر بازار.", { noindex: true }),
  component: AdminGate,
});
function AdminGate(){const {ready,isAdmin,phone}=useApp();if(!ready)return <SiteLayout><div className="container-mk py-16">در حال بررسی دسترسی…</div></SiteLayout>;if(!isAdmin)return <SiteLayout><div className="container-mk py-16"><StatePanel icon="profile" title={phone?'اجازه‌ی دسترسی ندارید':'ورود مدیر'} body="این بخش فقط برای کارکنان مجاز میکزی است." action={!phone?<Link to="/login" search={{redirect:'/admin'}} className={btn()}>ورود</Link>:undefined}/></div></SiteLayout>;return <DashShell title="مدیریت داخلی" badge="داخلی" nav={ADMIN_NAV}><Outlet/></DashShell>;}
