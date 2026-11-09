import { createFileRoute } from '@tanstack/react-router';
import { AdminUsers } from '@/components/mk/admin-product-pages';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/admin/users')({ head: () => seo('مدیریت کاربران', 'مدیریت دسترسی و حساب کاربران میکزی.', { noindex: true }), component: AdminUsers });