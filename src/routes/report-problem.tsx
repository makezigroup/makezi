import { createFileRoute } from '@tanstack/react-router';
import { ContentPage } from '@/components/mk/content-page';
import { SupportForm } from '@/components/mk/support-form';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/report-problem')({ head: () => seo('گزارش مشکل', 'گزارش اطلاعات نادرست سالن، قیمت، محتوا یا پیوند برای رسیدگی تیم میکزی.', { path: '/report-problem' }), component: () => <ContentPage title="گزارش مشکل"><SupportForm kind="problem" /></ContentPage> });