export async function readAll<T>(read: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 500) {
    const result = await read(from, from + 499);
    if (result.error) throw new Error('اطلاعات دریافت نشد. دوباره تلاش کنید.');
    rows.push(...(result.data ?? []));
    if (!result.data || result.data.length < 500) return rows;
  }
}