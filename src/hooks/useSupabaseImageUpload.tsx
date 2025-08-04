import { useState } from 'react';
import { uploadImageToSupabase } from '@/utils/imageUpload';
import { toast } from '@/hooks/use-toast';

export const useSupabaseImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = 'ingredient-scanner'): Promise<string | null> => {
    setIsUploading(true);
    try {
      const url = await uploadImageToSupabase(file, 'product-images', folder);
      if (url) {
        toast({
          title: "Image uploaded successfully",
          description: "Your image has been uploaded to Supabase Storage.",
        });
        return url;
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload image to Supabase Storage.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload error",
        description: "An error occurred while uploading the image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
  };
};