import { createFileRoute } from "@tanstack/react-router";
import { AdminSalonEdit } from "@/components/mk/admin-pages";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/salons/$id")({
  head: () => seo("ویرایش سالن", "ویرایش اطلاعات سالن — میکزی", { noindex: true }),
  component: function EditRoute() {
    const { id } = Route.useParams();
    return <AdminSalonEdit id={id} />;
  },
});
