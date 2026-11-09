import { createFileRoute } from '@tanstack/react-router';
import { AdminSupport } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/support')({ head: () => seo('رسیدگی به پیام‌ها', 'مدیریت پیام‌ها و گزارش‌های میکزی.', { noindex: true }), component: AdminSupport });