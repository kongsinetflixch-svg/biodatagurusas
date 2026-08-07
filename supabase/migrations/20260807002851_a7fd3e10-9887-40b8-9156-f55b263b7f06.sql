-- Add columns for storage paths to the teachers table
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS school_logo_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- RLS Policies for storage.objects
-- Note: Using 'teacher-assets' bucket name

-- Allow users to see all assets (we want them to be viewable if we use signed URLs or if they're public-ish)
-- Since the bucket is private, we will use signed URLs or the app will be authenticated.
CREATE POLICY "Users can view assets" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'teacher-assets');

-- Allow authenticated users to upload to their own user-scoped folder
CREATE POLICY "Users can upload assets to their folder" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'teacher-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own assets
CREATE POLICY "Users can update their own assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'teacher-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own assets
CREATE POLICY "Users can delete their own assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'teacher-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- If the app uses "IC Login" (pseudo-session), we need to ensure the user is actually logged in to Supabase.
-- The prompt mentions "Jangan simpan dalam React state... Gunakan Supabase".
-- It also mentions "log keluar dan log masuk semula pada peranti lain".
-- This implies real authentication should be used if possible, or at least RLS that allows the pseudo-user.
-- For now, we grant access to authenticated roles.
