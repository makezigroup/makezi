import { createFileRoute, Link } from '@tanstack/react-router';
import { ContentPage } from '@/components/mk/content-page';
import { SupportForm } from '@/components/mk/support-form';
import { StatePanel, btn } from '@/components/mk/core';
import { useApp } from '@/lib/app-store';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/delete-account')({ head: () => seo('درخواست حذف حساب', 'درخواست بررسی حذف حساب با حفظ یکپارچگی نظرها و مدارک.', { noindex: true }), component: DeleteAccount });
function DeleteAccount() { const { phone } = useApp(); return <ContentPage title="درخواست حذف حساب">{phone ? <SupportForm kind="account-deletion" /> : <StatePanel title="وارد حساب شوید" action={<Link to="/login" className={btn()}>ورود</Link>} />}</ContentPage>; }