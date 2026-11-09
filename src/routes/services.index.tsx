import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SiteLayout, PageIntro } from '@/components/mk/layout';
import { StatePanel, inputCls } from '@/components/mk/core';
import { ServiceCard } from '@/components/mk/service-discovery';
import { getProductData } from '@/lib/product.functions';
import { normalizeSearch } from '@/lib/product-schemas';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/services/')({ loader: () => getProductData(), head: () => seo('خدمات زیبایی', 'خدمات زیبایی را با سالن‌های ارائه‌دهنده و قیمت‌های اعلام‌شده بررسی کنید.', { path: '/services' }), component: Services });
function Services() { const { services, categories } = Route.useLoaderData(); const [q, setQ] = useState(''), [cat, setCat] = useState(''); const list = services.filter(s => (!cat || s.category_id === cat) && normalizeSearch(s.name).includes(normalizeSearch(q))); return <SiteLayout><PageIntro title="خدمات زیبایی" /><div className="container-mk"><div className="mb-6 grid gap-3 sm:grid-cols-2"><input aria-label="جست‌وجوی خدمت" value={q} onChange={e => setQ(e.target.value)} className={inputCls} placeholder="نام خدمت…" /><select aria-label="دستهٔ خدمت" value={cat} onChange={e => setCat(e.target.value)} className={inputCls}><option value="">همهٔ دسته‌ها</option>{categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>{list.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map(s => <ServiceCard key={s.id} service={s} />)}</div> : <StatePanel title="خدمتی پیدا نشد" />}</div></SiteLayout>; }