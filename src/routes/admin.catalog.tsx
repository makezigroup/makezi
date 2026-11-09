import { createFileRoute } from '@tanstack/react-router';
import { AdminCatalog } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/catalog')({ head: () => seo('مدیریت خدمات', 'کاتالوگ خدمات میکزی.', { noindex: true }), component: AdminCatalog });