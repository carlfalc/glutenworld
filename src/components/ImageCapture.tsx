
import { useState, useRef } from 'react';
import { Camera, Upload, Image, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCaptureProps {
  onImageCapture: (imageBase64: string, source: 'camera' | 'upload') => void;
  onClose: () => void;
  type: 'recipe' | 'ingredient';
}

const ImageCapture = ({ onImageCapture, onClose, type }: ImageCaptureProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileCapture = (event: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'upload') => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError('');
      
      console.log(`${source} file selected:`, file.name, file.type);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setIsLoading(false);
        onImageCapture(result, source);
        onClose();
      };
      
      reader.onerror = () => {
        setError('Failed to read the image file. Please try again.');
        setIsLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
    
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleTakePhoto = () => {
    setError('');
    cameraInputRef.current?.click();
  };

  const handleUploadPhoto = () => {
    setError('');
    fileInputRef.current?.click();
  };

  const actionText = type === 'recipe' ? 'Recipe' : 'Ingredient';

  return (
    <div className="space-y-4">
      {/* Main action buttons */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={handleTakePhoto}
          className="flex items-center justify-center gap-3 h-16 bg-gluten-primary hover:bg-gluten-secondary text-white"
          disabled={isLoading}
        >
          <Camera className="w-6 h-6" />
          <span className="text-base font-medium">
            {isLoading ? 'Processing...' : `Take Photo of ${actionText}`}
          </span>
        </Button>
        
        <Button
          onClick={handleUploadPhoto}
          variant="outline"
          className="flex items-center justify-center gap-3 h-16 border-2 hover:bg-accent/50"
          disabled={isLoading}
        >
          <Upload className="w-6 h-6" />
          <span className="text-base font-medium">
            Upload {actionText} Image
          </span>
        </Button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-700 font-medium">Processing...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
        <p><strong>Camera:</strong> Opens your device's camera for taking photos</p>
        <p><strong>Upload:</strong> Select an image from your device's gallery</p>
        <p><strong>Screenshots:</strong> Use your device's native screenshot buttons, then upload the image</p>
        {type === 'recipe' && (
          <p className="text-yellow-600"><strong>Tip:</strong> Take a screenshot of recipes from websites or apps, then upload it here!</p>
        )}
      </div>
      
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileCapture(e, 'camera')}
        className="hidden"
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileCapture(e, 'upload')}
        className="hidden"
      />
    </div>
  );
};

export default ImageCapture;
