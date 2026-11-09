import { createFileRoute } from '@tanstack/react-router';
import { AdminActivity } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/activity')({ head: () => seo('سابقهٔ اقدامات', 'سابقهٔ اقدامات کارکنان میکزی.', { noindex: true }), component: AdminActivity });