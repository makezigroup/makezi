import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { supportSchema } from './product-schemas';

export const getProductData = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('دریافت اطلاعات ممکن نشد.');
  const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } } });
  const [services, categories, locations, content] = await Promise.all([client.from('service_catalog').select('*').eq('archived', false), client.from('directory_categories').select('*').eq('archived', false), client.from('directory_locations').select('*').eq('archived', false), client.from('site_content').select('*')]);
  if (services.error || categories.error || locations.error || content.error) throw new Error('اطلاعات خدمات دریافت نشد.');
  return { services: services.data ?? [], categories: categories.data ?? [], locations: locations.data ?? [], content: content.data ?? [] };
});

export const requestAccountDeletion = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(supportSchema).handler(async ({ data, context }) => {
  if (data.kind !== 'account-deletion') throw new Error('درخواست نامعتبر است.');
  const { error } = await context.supabase.from('support_submissions').insert({ ...data, user_id: context.userId });
  if (error) throw new Error('درخواست ذخیره نشد.');
  return { ok: true };
});

export const getStaffUsers = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const role = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (role.data !== true) throw new Error('اجازهٔ دسترسی ندارید.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const [users, roles, profiles] = await Promise.all([supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }), supabaseAdmin.from('user_roles').select('user_id,role'), supabaseAdmin.from('profiles').select('id,display_name,is_demo')]);
  if (users.error || roles.error || profiles.error) throw new Error('اطلاعات کاربران دریافت نشد.');
  return users.data.users.map(u => ({ id: u.id, email: u.email ?? '', created_at: u.created_at, banned_until: u.banned_until ?? '', name: profiles.data?.find(p => p.id === u.id)?.display_name ?? '', isDemo: profiles.data?.find(p => p.id === u.id)?.is_demo ?? false, roles: roles.data?.filter(r => r.user_id === u.id).map(r => r.role) ?? [] }));
});

export const updateStaffUser = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid(), action: z.enum(['grant-admin', 'remove-admin', 'suspend', 'restore']) })).handler(async ({ data, context }) => {
  const role = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (role.data !== true || data.id === context.userId) throw new Error('این تغییر مجاز نیست.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  if (data.action === 'grant-admin' || data.action === 'remove-admin') {
    const result = data.action === 'grant-admin' ? await supabaseAdmin.from('user_roles').upsert({ user_id: data.id, role: 'admin' }, { onConflict: 'user_id,role' }) : await supabaseAdmin.from('user_roles').delete().eq('user_id', data.id).eq('role', 'admin');
    if (result.error) throw new Error('نقش تغییر نکرد.');
  } else {
    const result = await supabaseAdmin.auth.admin.updateUserById(data.id, { ban_duration: data.action === 'suspend' ? '876000h' : 'none' });
    if (result.error) throw new Error('وضعیت تغییر نکرد.');
  }
  const audit = await supabaseAdmin.from('admin_audit_logs').insert({ actor_id: context.userId, entity: 'user_roles', record_id: data.id, action: data.action });
  if (audit.error) throw new Error('تغییر انجام شد اما سابقه ثبت نشد.');
  return { ok: true };
});