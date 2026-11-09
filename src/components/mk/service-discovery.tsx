import { Link } from '@tanstack/react-router';
import { SafeImg } from './marketplace';
import { btn, StatusBadge } from './core';
import { useFmt, usePublicSalons } from '@/lib/app-store';
import type { Database } from '@/integrations/supabase/types';
export type CatalogService = Database['public']['Tables']['service_catalog']['Row'];
export function ServiceCard({ service }: { service: CatalogService }) {
  const salons = usePublicSalons(), fmt = useFmt();
  const count = salons.filter(s => s.services.some(v => v.id === service.id)).length;
  return <article className="overflow-hidden rounded-card bg-card shadow-card"><Link to="/services/$serviceId" params={{ serviceId: service.id }}><SafeImg src={service.image || 'interior'} alt={service.name} className="aspect-[4/3] w-full" /></Link><div className="flex flex-col gap-3 p-5"><h2 className="text-h3">{service.name}</h2>{service.is_demo && <StatusBadge tone="neutral">اطلاعات نمونه</StatusBadge>}<p className="text-caption text-muted-foreground">{service.description || 'اطلاعات و قیمت اعلام‌شدهٔ سالن‌های ارائه‌دهنده'}</p><span>{fmt.num(count)} سالن</span><Link to="/services/$serviceId" params={{ serviceId: service.id }} className={btn({ variant: 'outline', size: 'sm' })}>بررسی خدمت</Link></div></article>;
}