
import { useState, useRef } from 'react';
import { Camera, Upload, Image, AlertCircle, Smartphone, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageCaptureProps {
  onImageCapture: (imageBase64: string, source: 'camera' | 'upload' | 'screenshot') => void;
  onClose: () => void;
  type: 'recipe' | 'ingredient';
}

const ImageCapture = ({ onImageCapture, onClose, type }: ImageCaptureProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showScreenshotHelp, setShowScreenshotHelp] = useState(false);
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
    try {
      cameraInputRef.current?.click();
    } catch (error) {
      console.error('Camera access error:', error);
      setError('Unable to access camera. Please try uploading an image instead.');
    }
  };

  const handleUploadPhoto = () => {
    setError('');
    try {
      fileInputRef.current?.click();
    } catch (error) {
      console.error('File upload error:', error);
      setError('Unable to open file picker. Please try again.');
    }
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

      {/* Screenshot Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-blue-900">Screenshots</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScreenshotHelp(!showScreenshotHelp)}
                className="p-1 h-auto text-blue-600 hover:text-blue-800"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Take a screenshot using your device's buttons, then upload it here
            </p>
            
            {showScreenshotHelp && (
              <div className="mt-3 p-3 bg-blue-100 rounded-md text-sm text-blue-800">
                <p className="font-medium mb-2">How to take screenshots:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Android:</strong> Power + Volume Down buttons</li>
                  <li><strong>iPhone:</strong> Side button + Volume Up</li>
                  <li><strong>Alternative:</strong> Use your device's screenshot gesture or assistant</li>
                </ul>
                <p className="mt-2 text-xs">
                  After taking a screenshot, use the "Upload Image" button above to select it from your gallery.
                </p>
              </div>
            )}
          </div>
        </div>
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Help text */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
        <p><strong>Camera:</strong> Opens your device's camera for taking photos</p>
        <p><strong>Upload:</strong> Select an image from your device's gallery</p>
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
