
CREATE TABLE public.site_visits (
  visitor_id text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.site_visits TO anon, authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a visit"
  ON public.site_visits FOR INSERT
  TO anon, authenticated
  WITH CHECK (length(visitor_id) BETWEEN 8 AND 128);

CREATE POLICY "Admins can read visits"
  ON public.site_visits FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_total_users()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN public.has_role(auth.uid(), 'admin')
      THEN (SELECT count(*) FROM auth.users)
    ELSE 0::bigint
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_total_visitors()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN public.has_role(auth.uid(), 'admin')
      THEN (SELECT count(*) FROM public.site_visits)
    ELSE 0::bigint
  END;
$$;

GRANT EXECUTE ON FUNCTION public.get_total_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_visitors() TO authenticated;
