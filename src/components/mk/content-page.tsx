import type { ReactNode } from "react";
import { SiteLayout, PageIntro } from "./layout";

export function ContentPage({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <PageIntro title={title} body={body} />
      <div className="container-mk">{children}</div>
    </SiteLayout>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="flex max-w-3xl flex-col gap-4 text-body-l [&_h2]:mt-6 [&_h2]:text-h3 [&_li]:ms-5 [&_li]:list-disc">{children}</div>;
}
