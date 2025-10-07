-- Create storage bucket for banner images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for banners bucket
CREATE POLICY "Banner images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'banners');

CREATE POLICY "Users can upload their own banner images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own banner images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own banner images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
