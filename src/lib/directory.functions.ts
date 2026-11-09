import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { Salon } from './data';
import { readAll } from './cloud-pages';
import { directorySearch, filterSalons } from './filters';
import type { Review } from './data';

export const getPublicDirectory = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const client = createClient<Database>(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const data = await readAll((from, to) => client.from('salons').select('data').order('id').range(from, to));
  return data.map(r => r.data as unknown as Salon);
});

export const getPublicSalon = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const client = createClient<Database>(process.env['SUPABASE_URL']!, key, {
      auth: { persistSession: false },
      global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } },
    });
    const { data, error } = await client.from('salons').select('data').eq('slug', slug).maybeSingle();
    if (error) throw new Error('اطلاعات سالن دریافت نشد.');
    return data ? data.data as unknown as Salon : null;
  });

export const getDirectoryResults = createServerFn({method:'GET'}).inputValidator(directorySearch).handler(async({data:search})=>{
  const key=process.env['SUPABASE_PUBLISHABLE_KEY'],url=process.env['SUPABASE_URL'];
  if(!key||!url)throw new Error('اطلاعات دریافت نشد.');
  const client=createClient<Database>(url,key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
  const [salons,rows]=await Promise.all([readAll((a,b)=>client.from('salons').select('data').order('id').range(a,b)),readAll((a,b)=>client.from('published_reviews').select('*').order('id').range(a,b))]);
  const reviews:Review[]=rows.map(r=>({id:r.id??'',salonId:r.salon_id??'',author:r.author??'',userKey:'',date:r.created_at??'',service:r.service??'',text:r.text??'',dims:r.dims??[],status:'approved',kind:r.kind==='verified-visit'?'verified-visit':'community',reports:[],isDemo:r.is_demo??false}));
  const results=filterSalons(salons.map(s=>s.data as unknown as Salon),reviews,{...search,open:undefined});
  const pages=Math.max(1,Math.ceil(results.length/12)),page=Math.min(search.page??1,pages);
  return {salons:results.slice((page-1)*12,page*12),total:results.length,pages,page};
});
