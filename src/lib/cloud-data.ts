import type { Database } from '@/integrations/supabase/types';
import type { Review } from './data';
export function reviewFromRow(r: Database['public']['Tables']['reviews']['Row']): Review {
  return { isDemo: r.is_demo, id: r.id, salonId: r.salon_id, author: r.author, userKey: r.user_id, date: r.created_at, service: r.service, dims: r.dims, text: r.text, title: r.title, visitDate: r.visit_date ?? undefined, status: r.status as Review['status'], kind: r.kind as Review['kind'], reply: r.reply ?? undefined, moderationNote: r.moderation_note ?? undefined, reports: [] };
}
export const safeReturnPath = (path?: string | null) => path && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') ? path : '/account';
export const validWebsite = (url?: string) => !!url && /^https?:\/\//i.test(url) && !/example\.(com|org|net)/i.test(url);
export const validContactPhone = (phone?: string) => !!phone && /^(\+?[0-9]{8,15})$/.test(phone) && !/000000/.test(phone);

export const canContactSalon = (s: {isDemo?: boolean; phone: string}) => !s.isDemo && validContactPhone(s.phone);
export const servicePriceLabel = (price: number, format: (n:number)=>string) => price > 0 ? format(price) : "قیمت اعلام نشده";
