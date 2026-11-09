import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
export const Route = createFileRoute('/api/public/media')({ server: { handlers: { GET: async ({ request }) => {
  const path = new URL(request.url).searchParams.get('path');
  if (!path || !/^salons\/[a-zA-Z0-9-]+\/[a-zA-Z0-9.-]+$/.test(path)) return new Response('Not found', { status: 404 });
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'], url = process.env['SUPABASE_URL'];
  if (!key || !url) return new Response('Unavailable', { status: 503 });
  const client = createClient<Database>(url, key, { auth: { persistSession: false }, global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } } });
  const salonId = path.split('/')[1];
  if (!salonId) return new Response('Not found', { status: 404 });
  const { data } = await client.from('salons').select('data').eq('id', salonId).maybeSingle();
  if (!data || !JSON.stringify(data.data).includes(`/api/public/media?path=${encodeURIComponent(path)}`)) return new Response('Not found', { status: 404 });
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const file = await supabaseAdmin.storage.from('makezi-media').download(path);
  if (file.error || !file.data || !['image/jpeg', 'image/png', 'image/webp'].includes(file.data.type)) return new Response('Not found', { status: 404 });
  return new Response(file.data, { headers: { 'Content-Type': file.data.type, 'Cache-Control': 'public,max-age=300', 'X-Content-Type-Options': 'nosniff' } });
} } } });