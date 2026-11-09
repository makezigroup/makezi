import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { SITE_URL } from '@/lib/seo';
export const Route = createFileRoute('/sitemap.xml')({server:{handlers:{GET:async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY'],url=process.env['SUPABASE_URL'];if(!key||!url)return new Response('Unavailable',{status:503});
 const client=createClient<Database>(url,key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const [salons,services]=await Promise.all([client.from('salons').select('slug,data').eq('is_demo',false),client.from('service_catalog').select('id').eq('is_demo',false).eq('archived',false)]);
 const paths=['/','/about','/salons','/services','/categories','/contact','/for-salons','/help','/how-it-works','/review-guidelines','/review-verification','/content-policy',...(salons.data??[]).filter(s=>{const d=s.data;return !d||typeof d!=='object'||Array.isArray(d)||!d['seo']||!(d['seo'] as Record<string,unknown>)['noindex'];}).map(s=>`/salons/${s.slug}`),...(services.data??[]).map(s=>`/services/${s.id}`)];
 const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${escape(SITE_URL+p)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}}}});