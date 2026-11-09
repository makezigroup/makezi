REVOKE EXECUTE ON FUNCTION public.validate_verified_review() FROM PUBLIC,anon,authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_partnership() FROM PUBLIC,anon,authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_admin_change() FROM PUBLIC,anon,authenticated;