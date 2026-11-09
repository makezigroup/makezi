DROP POLICY public_reviews ON public.reviews;
REVOKE SELECT ON public.reviews FROM anon;
CREATE VIEW public.published_reviews WITH (security_barrier=true) AS SELECT r.id,r.salon_id,r.author,r.service,r.dims,r.text,r.title,r.visit_date,r.status,r.kind,r.reply,r.created_at FROM public.reviews r JOIN public.salons s ON s.id=r.salon_id WHERE r.status='approved' AND s.published AND NOT s.archived;
GRANT SELECT ON public.published_reviews TO anon,authenticated,service_role;
COMMENT ON VIEW public.published_reviews IS 'Public approved reviews only; omits author account ID, moderation notes and private evidence. Explicit publication filter enforced by owner-executed view.';