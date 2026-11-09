import { createFileRoute } from '@tanstack/react-router';
import { AdminDocuments } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/documents')({ head: () => seo('مدارک خصوصی سالن', 'بررسی خصوصی مدارک سالن‌ها در میکزی.', { noindex: true }), component: AdminDocuments });