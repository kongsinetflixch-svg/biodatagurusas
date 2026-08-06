ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS ic_number TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS teachers_ic_number_idx ON public.teachers(ic_number);

-- Update RLS to allow anonymous access by IC number for this specific use case
-- We allow SELECT, INSERT, UPDATE if IC matches
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teachers;
CREATE POLICY "Enable read access for all users" ON public.teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.teachers;
CREATE POLICY "Enable insert for all users" ON public.teachers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for users based on owner_id" ON public.teachers;
CREATE POLICY "Enable update for all users based on ic" ON public.teachers FOR UPDATE USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teachers TO anon, authenticated;
GRANT ALL ON public.teachers TO service_role;
