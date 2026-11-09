import { createFileRoute } from '@tanstack/react-router';
import { AdminTaxonomy } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/taxonomy')({ head: () => seo('دسته‌ها و مکان‌ها', 'مدیریت دسته‌ها و مکان‌های میکزی.', { noindex: true }), component: AdminTaxonomy });