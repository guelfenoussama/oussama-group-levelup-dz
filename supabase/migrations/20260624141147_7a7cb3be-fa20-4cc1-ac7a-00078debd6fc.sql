REVOKE EXECUTE ON FUNCTION public.get_total_users() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_total_visitors() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_users() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_total_visitors() TO service_role;