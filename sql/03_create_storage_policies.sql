-- Storage policies for profile-photos bucket
-- Run this in your Supabase SQL editor

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to upload profile photos
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Policy 2: Allow public to view profile photos
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-photos');

-- Policy 3: Allow users to update their own profile photos
CREATE POLICY "Allow users to update own photos" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow users to delete their own profile photos
CREATE POLICY "Allow users to delete own photos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
