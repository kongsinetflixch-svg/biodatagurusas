-- Grant access to anon for the teachers table since we are using IC login without full auth session
GRANT ALL ON public.teachers TO anon;
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.teachers TO service_role;
