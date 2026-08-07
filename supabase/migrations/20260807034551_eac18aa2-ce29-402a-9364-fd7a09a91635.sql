-- Policies for storage.objects
-- Note: Storage policies are in the storage schema
DO $$ 
BEGIN
    -- Only create if they don't exist to avoid errors in this environment
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'teacher-assets');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload') THEN
        CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'teacher-assets');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Delete') THEN
        CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'teacher-assets');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update') THEN
        CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'teacher-assets');
    END IF;
END $$;

-- Fix teachers table RLS
-- DROP existing update policy to re-create it more robustly if needed, 
-- but let's just make sure we have a clear one for IC mode
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Enable update for all users based on ic') THEN
        DROP POLICY "Enable update for all users based on ic" ON teachers;
    END IF;
    
    CREATE POLICY "Allow update by IC" ON teachers 
    FOR UPDATE 
    USING (true) -- Simplified for the current "IC login" model where users aren't fully auth'd via Supabase
    WITH CHECK (true);
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Enable read access for all users') THEN
        DROP POLICY "Enable read access for all users" ON teachers;
    END IF;
    
    CREATE POLICY "Allow read by all" ON teachers 
    FOR SELECT 
    USING (true);

    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Enable insert for all users') THEN
        DROP POLICY "Enable insert for all users" ON teachers;
    END IF;
    
    CREATE POLICY "Allow insert by all" ON teachers 
    FOR INSERT 
    WITH CHECK (true);
END $$;
