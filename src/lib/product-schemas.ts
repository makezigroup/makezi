import { z } from 'zod';

export const normalizeSearch = (value: string) => value.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, ' ').trim().toLowerCase();
export const supportSchema = z.object({
  kind: z.enum(['contact', 'problem', 'account-deletion']),
  category: z.string().trim().min(2).max(80),
  name: z.string().trim().max(100),
  contact: z.string().trim().min(3).max(255),
  message: z.string().trim().min(10).max(2000),
  related_path: z.string().max(300).refine(v => !v || (v.startsWith('/') && !v.startsWith('//') && !v.includes('\\'))),
});
export const catalogSchema = z.object({ id: z.string().regex(/^[a-z0-9-]{2,80}$/), name: z.string().trim().min(2).max(150), category_id: z.string().min(2).max(80), description: z.string().max(3000), image: z.string().max(500), archived: z.boolean(), is_demo: z.boolean() });