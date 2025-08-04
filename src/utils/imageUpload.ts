import { supabase } from "@/integrations/supabase/client";

export const uploadImageToSupabase = async (
  file: File,
  bucketName: string = 'product-images',
  folder: string = 'ingredient-scanner'
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return null;
  }
};

export const uploadImageFromUrl = async (
  imageUrl: string,
  fileName: string,
  bucketName: string = 'product-images',
  folder: string = 'ingredient-scanner'
): Promise<string | null> => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    
    return await uploadImageToSupabase(file, bucketName, folder);
  } catch (error) {
    console.error('Error in uploadImageFromUrl:', error);
    return null;
  }
};