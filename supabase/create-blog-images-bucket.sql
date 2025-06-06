-- Create a storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow public access to blog images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Create a policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Create a policy to allow authenticated users to update their images
CREATE POLICY "Authenticated users can update blog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Create a policy to allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);