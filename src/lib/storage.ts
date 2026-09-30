import { supabase } from './supabase';

export type UploadImageOptions = {
  file: File;
  userId: string;
  bucket: string;
  folder?: string;
};

export async function uploadImage({
  file,
  userId,
  bucket,
  folder,
}: UploadImageOptions): Promise<{ url: string; path: string }> {
  if (!file.type.startsWith('image/')) {
    throw new Error('This file type is not supported. Please select an image.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be smaller than 5 MB.');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const prefix = folder ? `${folder}/` : '';
  const filePath = `${prefix}${userId}/image-${Date.now()}.${fileExt}`;

  const contentType = file.type === 'image/jfif' ? 'image/jpeg' : file.type || 'image/jpeg';

  console.log('Attempting upload:', {
    bucket,
    filePath,
    fileName: file.name,
    fileType: contentType,
    fileSize: file.size,
    userId,
  });

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType,
    });

  if (uploadError) {
    console.error('Image upload failed:', {
      bucket,
      filePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      error: uploadError,
    });
    throw new Error('Photo upload failed. Please try again.');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  
  if (!data || !data.publicUrl) {
    throw new Error('Failed to generate public URL for the uploaded image.');
  }

  return { url: data.publicUrl, path: filePath };
}
