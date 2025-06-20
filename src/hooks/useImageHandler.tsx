
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ImageHandlerOptions {
  maxSize?: number; // Maximum file size in bytes
  allowedTypes?: string[];
  quality?: number; // JPEG quality (0-1)
}

export const useImageHandler = (options: ImageHandlerOptions = {}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    quality = 0.8
  } = options;

  const validateImage = useCallback((file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please select a valid image file (${allowedTypes.join(', ')})`,
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Image must be smaller than ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [allowedTypes, maxSize, toast]);

  const processImage = useCallback(async (file: File): Promise<string> => {
    if (!validateImage(file)) {
      throw new Error('Invalid image file');
    }

    setIsProcessing(true);
    
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const result = e.target?.result as string;
          console.log(`Image processed: ${file.name}, size: ${Math.round(result.length * 3/4 / 1024)}KB`);
          resolve(result);
        };
        
        reader.onerror = () => {
          console.error('Failed to read image file:', file.name);
          reject(new Error('Failed to read image file'));
        };
        
        reader.readAsDataURL(file);
      });
    } finally {
      setIsProcessing(false);
    }
  }, [validateImage]);

  const compressImage = useCallback(async (file: File, targetQuality: number = quality): Promise<string> => {
    if (!validateImage(file)) {
      throw new Error('Invalid image file');
    }

    setIsProcessing(true);

    try {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions (max 1024px on longer side)
          const maxDimension = 1024;
          let { width, height } = img;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedImage = canvas.toDataURL('image/jpeg', targetQuality);
            console.log(`Image compressed: ${file.name}, original: ${Math.round(file.size/1024)}KB, compressed: ${Math.round(compressedImage.length * 3/4 / 1024)}KB`);
            resolve(compressedImage);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    } finally {
      setIsProcessing(false);
    }
  }, [validateImage, quality]);

  return {
    processImage,
    compressImage,
    validateImage,
    isProcessing
  };
};
