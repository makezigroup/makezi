import { createContext, useContext, type ReactNode } from 'react';
import type { getProductData } from './product.functions';
export type ProductData = Awaited<ReturnType<typeof getProductData>>;
const ProductContext = createContext<ProductData | null>(null);
export function ProductProvider({ data, children }: { data: ProductData; children: ReactNode }) { return <ProductContext.Provider value={data}>{children}</ProductContext.Provider>; }
export function useProduct() { const data = useContext(ProductContext); if (!data) throw new Error('ProductProvider missing'); return data; }