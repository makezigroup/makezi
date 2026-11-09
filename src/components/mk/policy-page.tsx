import { Link } from '@tanstack/react-router';
import { ContentPage, Prose } from './content-page';
import { DemoNote } from './core';
export function PolicyPage({ title, sections }: { title: string; sections: { title: string; body: string }[] }) { return <ContentPage title={title}><Prose><DemoNote>این توضیحات فرایند فعلی است؛ متن سیاست نهایی هنوز نیاز به تأیید دارد.</DemoNote>{sections.map(s=><section key={s.title}><h2>{s.title}</h2><p>{s.body}</p></section>)}<p><Link to="/report-problem">گزارش مشکل</Link> · <Link to="/contact">تماس با تیم میکزی</Link></p></Prose></ContentPage>; }