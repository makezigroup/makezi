ALTER POLICY categories_read ON public.directory_categories TO anon, authenticated USING (NOT archived);
ALTER POLICY locations_read ON public.directory_locations TO anon, authenticated USING (NOT archived);
ALTER POLICY content_public ON public.site_content TO anon, authenticated USING (id = 'homepage');
ALTER POLICY product_media_read ON storage.objects TO authenticated USING (
  bucket_id = 'makezi-media' AND (
    ((storage.foldername(name))[1] = 'avatars' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text))
    OR ((storage.foldername(name))[1] = 'salons' AND EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'admin'::public.app_role
    ))
  )
);
ALTER POLICY product_media_delete ON storage.objects TO authenticated USING (
  bucket_id = 'makezi-media' AND (
    ((storage.foldername(name))[1] = 'avatars' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text))
    OR ((storage.foldername(name))[1] = 'salons' AND EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'admin'::public.app_role
    ))
  )
);
ALTER POLICY product_media_insert ON storage.objects TO authenticated WITH CHECK (
  bucket_id = 'makezi-media' AND owner_id = (SELECT auth.uid()::text)
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  AND (
    ((storage.foldername(name))[1] = 'avatars' AND (storage.foldername(name))[2] = (SELECT auth.uid()::text))
    OR ((storage.foldername(name))[1] = 'salons' AND EXISTS (
      SELECT 1 FROM public.user_roles r WHERE r.user_id = (SELECT auth.uid()) AND r.role = 'admin'::public.app_role
    ))
  )
);