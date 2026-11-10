import { describe, expect, it } from 'vitest';
import { filterSalons } from '@/lib/filters';
import { normalizeSearch, supportSchema } from '@/lib/product-schemas';
import { SALONS } from '@/lib/data';
import { readAll } from '@/lib/cloud-pages';
describe('service-specific discovery',()=>{
  const base=SALONS[0]; if(!base) throw new Error('Missing fixture');
  const salon={...base,published:true,archived:false,services:[{id:'cheap',name:'ارزان',category:'nail' as const,durationMin:30,price:100000,updated:'2026-11-09'},{id:'selected',name:'منتخب',category:'nail' as const,durationMin:30,price:900000,updated:'2026-11-09'}]};
  it('uses selected service price, not an unrelated cheaper service',()=>expect(filterSalons([salon],[],{service:'selected',max:500000})).toEqual([]));
  it('matches Persian Arabic variants',()=>expect(normalizeSearch('ميكزي')).toBe('میکزی'));
});
describe('support validation',()=>{
  const base={kind:'contact',category:'پشتیبانی',name:'',contact:'qa@example.invalid',message:'درخواست آزمایشی پشتیبانی',related_path:''};
  it('rejects messages shorter than ten characters',()=>expect(supportSchema.safeParse({...base,message:'کوتاه'}).success).toBe(false));
  it('rejects external report paths',()=>expect(supportSchema.safeParse({...base,related_path:'//evil.test'}).success).toBe(false));
});
it('reads records beyond the former 100 and 500 record caps',async()=>{const input=Array.from({length:1101},(_,i)=>i);expect(await readAll(async(a,b)=>({data:input.slice(a,b+1),error:null}))).toHaveLength(1101);});
describe('nearestCity (hero search geolocation)', () => {
  it('maps a Tehran fix to tehran and a Shiraz fix to shiraz', async () => {
    const { nearestCity } = await import('@/lib/data');
    expect(nearestCity(35.7, 51.42).slug).toBe('tehran');
    expect(nearestCity(29.62, 52.53).slug).toBe('shiraz');
    expect(nearestCity(36.3, 59.6).slug).toBe('mashhad');
  });
});
