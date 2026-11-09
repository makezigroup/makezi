import { createFileRoute } from '@tanstack/react-router';
import { AdminHomepage } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/homepage')({ head: () => seo('مدیریت صفحهٔ اول', 'انتخاب سالن‌های صفحهٔ اول میکزی.', { noindex: true }), component: AdminHomepage });