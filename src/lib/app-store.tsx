import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DECISIONS } from "./decisions";
import { makeFmt, isoDay } from "./format";
import { type Review, type Salon } from "./data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { reviewFromRow } from "./cloud-data";
import type { Json } from "@/integrations/supabase/types";
import { publicReviews, scoreOf, toggleCompare as toggleCompareRule } from "./rules";
import { track } from "./analytics";
import { readAll } from './cloud-pages';

// Cloud-backed records; only display preferences remain device-local.
type Theme = "light" | "dark";
export type InquiryStatus = "new" | "under-review" | "contacted" | "accepted" | "rejected" | "closed";
export interface Inquiry { isDemo?: boolean; id: string; business: string; name: string; phone: string; city: string; area: string; categories: string[]; message: string; date: string; status: InquiryStatus; instagram?: string; website?: string; internalNote?: string; salonId?: string | undefined }

interface Store {
  theme: Theme; setTheme: (t: Theme) => void;
  faDigits: boolean; setFaDigits: (v: boolean) => void;
  fmt: ReturnType<typeof makeFmt>;
  phone: string | null; displayName: string; setDisplayName: (v: string) => void;
  isAdmin: boolean; email: string; signOut: () => void;
  saved: string[]; toggleSaved: (id: string) => void;
  compare: string[]; toggleCompare: (id: string) => boolean; clearCompare: () => void;
  /** All salons incl. unpublished drafts (admin). Public pages filter `published`. */
  salons: Salon[]; upsertSalon: (s: Salon) => Promise<void>;
  reviews: Review[]; addReview: (r: Omit<Review, "id" | "date" | "status" | "reports" | "kind">, evidence?: File) => Promise<void>;
  updateReview: (id: string, patch: Partial<Review>) => Promise<void>; reportReview: (id: string, reason: string) => Promise<void>;
  inquiries: Inquiry[]; addInquiry: (i: Omit<Inquiry, "id" | "date" | "status">) => Promise<void>; updateInquiry: (id: string, patch: Partial<Inquiry>) => Promise<void>;
  ready: boolean;
}

const Ctx = createContext<Store | null>(null);
const KEY = "mkz-demo-v2";

export function AppStoreProvider({ children, initialSalons = [] }: { children: ReactNode; initialSalons?: Salon[] }) {
  const [theme, setThemeState] = useState<Theme>(DECISIONS.defaultTheme);
  const [faDigits, setFaDigits] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [phone, setPhone] = useState<string | null>(null); // verified auth user ID, never a demo phone
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setName] = useState("");
  const [salons, setSalons] = useState<Salon[]>(initialSalons);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setPhone(user?.id ?? null); setEmail(user?.email ?? "");
    const role = user ? await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }) : null;
    const admin = role?.data === true; setIsAdmin(admin);
    const [s, r, published] = await Promise.all([readAll((from,to)=>supabase.from('salons').select('data').order('id').range(from,to)), user ? readAll((from,to)=>supabase.from('reviews').select('*').order('id').range(from,to)) : Promise.resolve([]), readAll((from,to)=>supabase.from('published_reviews').select('*').order('id').range(from,to))]);
    setSalons(s.map(x => x.data as unknown as Salon));
    let list = r.map(reviewFromRow);
    const publicRows = published.map(x => ({ isDemo:x.is_demo ?? false, id:x.id ?? '', salonId:x.salon_id ?? '', author:x.author ?? '', date:x.created_at ?? '', service:x.service ?? '', dims:x.dims ?? [], text:x.text ?? '', kind:x.kind as Review['kind'], status:'approved' as const, reply:x.reply ?? undefined, reports:[] }));
    list = [...list,...publicRows.filter(x=>!list.some(r=>r.id===x.id))];
    if (admin) {
      const [ev, reports, iq] = await Promise.all([readAll((from,to)=>supabase.from('review_evidence').select('*').order('id').range(from,to)), readAll((from,to)=>supabase.from('review_reports').select('*').eq('resolved',false).order('id').range(from,to)), readAll((from,to)=>supabase.from('partnership_requests').select('*').order('id').range(from,to))]);
      list = list.map(x => ({ ...x, evidenceSubmitted: ev.some(e => e.review_id === x.id), reports: reports.filter(p => p.review_id === x.id).map(p => ({ reason: p.reason, date: p.created_at })) }));
      setInquiries(iq.map(x => ({ isDemo:x.is_demo, id:x.id, business:x.business, name:x.name, phone:x.phone, city:x.city, area:x.area, categories:x.categories, message:x.message, date:x.created_at, status:x.status as InquiryStatus, instagram:x.instagram, website:x.website, internalNote:x.internal_note, salonId:x.salon_id ?? undefined })));
    } else setInquiries([]);
    setReviews(list);
    if (user) {
      const [f,c,p] = await Promise.all([supabase.from('favorites').select('salon_id').eq('user_id',user.id), supabase.from('comparisons').select('salon_ids').eq('user_id',user.id).maybeSingle(), supabase.from('profiles').select('display_name').eq('id',user.id).maybeSingle()]);
      setSaved((f.data ?? []).map(x=>x.salon_id)); setCompare(c.data?.salon_ids ?? []); setName(p.data?.display_name ?? '');
    } else { setSaved([]); setName(''); }
    setReady(true);
  }, []);
  useEffect(() => {
    try { const p = JSON.parse(localStorage.getItem('mkz-display') ?? '{}'); if(p.theme) setThemeState(p.theme); if(typeof p.faDigits==='boolean') setFaDigits(p.faDigits); } catch { /* ignore preferences */ }
    void refresh().catch(e => { toast.error(e.message); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange(event => { if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) setTimeout(() => void refresh().catch(e=>toast.error(e.message)),0); });
    return () => data.subscription.unsubscribe();
  },[refresh]);
  useEffect(()=>{ document.documentElement.dataset['theme']=theme; document.documentElement.classList.toggle('dark',theme==='dark'); if(ready) localStorage.setItem('mkz-display',JSON.stringify({theme,faDigits})); },[theme,faDigits,ready]);
  const checked = async (result: { error: { message: string } | null }) => { if(result.error) throw new Error(result.error.message); };
  const run = (operation: PromiseLike<unknown>) => { void Promise.resolve(operation).catch(e=>toast.error(e.message)); };
  const toggleCompare = useCallback((id:string) => { const result=toggleCompareRule(compare,id); if(!result.ok) return false; setCompare(result.list); if(phone) run(supabase.from('comparisons').upsert({user_id:phone,salon_ids:result.list}).then(checked)); track(compare.length?'salon_added_to_comparison':'comparison_started',{salon:id}); return true; },[compare,phone]);
  const value: Store = {
    theme,setTheme:setThemeState,faDigits,setFaDigits,fmt:makeFmt(faDigits),phone,email,isAdmin,displayName,
    setDisplayName: v => {setName(v); if(phone) run(supabase.from('profiles').upsert({id:phone,display_name:v}).then(checked));},
    signOut:()=>{run(supabase.auth.signOut().then(checked)); setPhone(null);setIsAdmin(false);setSaved([]);setCompare([]);setInquiries([]);setReviews(x=>x.filter(r=>r.status==='approved'));setSalons(x=>x.filter(s=>s.published));},
    saved,toggleSaved:id=>{if(!phone){toast.error('برای ذخیره‌ی سالن وارد حساب شوید.');return;} run((async()=>{const has=saved.includes(id); await checked(has?await supabase.from('favorites').delete().eq('user_id',phone).eq('salon_id',id):await supabase.from('favorites').insert({user_id:phone,salon_id:id}));setSaved(x=>has?x.filter(v=>v!==id):[...x,id]);track(has?'salon_unfavorited':'salon_favorited',{salon:id});})());},
    compare,toggleCompare,clearCompare:()=>{setCompare([]);if(phone)run(supabase.from('comparisons').upsert({user_id:phone,salon_ids:[]}).then(checked));},
    salons,upsertSalon:async s=>{await checked(await supabase.from('salons').upsert({id:s.id,slug:s.slug,name:s.name,city:s.city,area:s.area,published:s.published,archived:s.archived ?? false,is_demo:s.isDemo ?? false,data:s as unknown as Json}));await refresh();},
    reviews,addReview:async(r,evidence)=>{
      if(!phone)throw new Error('ابتدا وارد حساب شوید.');
      const {data,error}=await supabase.from('reviews').insert({salon_id:r.salonId,user_id:phone,author:displayName.trim()||'کاربر میکزی',service:r.service,dims:r.dims,text:r.text,title:r.title ?? '',visit_date:r.visitDate || null}).select('id').single();
      if(error||!data)throw new Error(error?.message ?? 'نظر ذخیره نشد.');
      if(evidence){const path=`${phone}/${data.id}/${crypto.randomUUID()}`; const upload=await supabase.storage.from('visit-evidence').upload(path,evidence);if(upload.error)toast.error('نظر ثبت شد اما مدرک ارسال نشد.');else await checked(await supabase.from('review_evidence').insert({review_id:data.id,user_id:phone,storage_path:path}));}
      await refresh();track('review_submitted',{salon:r.salonId});
    },
    updateReview:async(id,patch)=>{
      if(patch.kind==='verified-visit'){
        const {data}=await supabase.from('review_evidence').select('*').eq('review_id',id);
        if(!data?.length)throw new Error('مدرک مراجعه موجود نیست.');
        await checked(await supabase.from('review_evidence').update({accepted:true,checked_by:phone,checked_at:new Date().toISOString()}).eq('review_id',id));
      }
      await checked(await supabase.from('reviews').update({...(patch.status?{status:patch.status}:{}),...(patch.kind?{kind:patch.kind}:{}),...(patch.reply!==undefined?{reply:patch.reply}:{}),...(patch.moderationNote!==undefined?{moderation_note:patch.moderationNote}:{})}).eq('id',id));
      if(patch.reports)await checked(await supabase.from('review_reports').update({resolved:true}).eq('review_id',id));await refresh();
    },
    reportReview:async(id,reason)=>{if(!phone)throw new Error('برای گزارش نظر وارد حساب شوید.');await checked(await supabase.from('review_reports').insert({review_id:id,user_id:phone,reason}));track('review_reported',{review:id});},
    inquiries,addInquiry:async i=>{await checked(await supabase.from('partnership_requests').insert({business:i.business,name:i.name,phone:i.phone,city:i.city,area:i.area,categories:i.categories,message:i.message,instagram:i.instagram ?? '',website:i.website ?? ''}));track('partnership_form_submitted',{city:i.city});if(isAdmin)await refresh();},
    updateInquiry:async(id,p)=>{await checked(await supabase.from('partnership_requests').update({...(p.status?{status:p.status}:{}),...(p.internalNote!==undefined?{internal_note:p.internalNote}:{}),...(p.salonId?{salon_id:p.salonId}:{})}).eq('id',id));await refresh();},ready,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppStoreProvider");
  return v;
}
export const useFmt = () => useApp().fmt;
export const usePublicSalons = () => useApp().salons.filter((s) => s.published && !s.archived);
export const useSalon = (slugOrId: string) => useApp().salons.filter(s=>s.published && !s.archived).find((s) => s.slug === slugOrId || s.id === slugOrId);
export function useScore(salonId: string) {
  const { reviews } = useApp();
  return useMemo(() => scoreOf(publicReviews(reviews, salonId)), [reviews, salonId]);
}
