import {describe,it,expect} from 'vitest';
import {validWebsite,validContactPhone,safeReturnPath,canContactSalon,servicePriceLabel} from '@/lib/cloud-data';
describe('real contact channels',()=>{
 it('never calls a fictional salon even with a valid-format number',()=>expect(canContactSalon({isDemo:true,phone:'02122334455'})).toBe(false));
 it('shows unavailable rather than zero for missing prices',()=>expect(servicePriceLabel(0,n=>`${n} تومان`)).toBe('قیمت اعلام نشده'));
 it('rejects placeholder telephone numbers',()=>expect(validContactPhone('02100000001')).toBe(false));
 it('rejects placeholder websites',()=>expect(validWebsite('https://example.com')).toBe(false));
 it('accepts a valid telephone format',()=>expect(validContactPhone('02122334455')).toBe(true));
 it('prevents external post-login redirects',()=>expect(safeReturnPath('//outside.test')).toBe('/account'));
});
