
import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCaptureProps {
  onImageCapture: (imageBase64: string, source: 'camera' | 'upload') => void;
  onClose: () => void;
  type: 'recipe' | 'ingredient';
}

const ImageCapture = ({ onImageCapture, onClose, type }: ImageCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError('');
    
    try {
      console.log('Requesting camera access...');
      
      // First try with back camera
      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let mediaStream: MediaStream;
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Back camera accessed successfully');
      } catch (backCameraError) {
        console.log('Back camera failed, trying front camera:', backCameraError);
        
        // Fallback to front camera
        constraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('Front camera accessed successfully');
        } catch (frontCameraError) {
          console.log('Front camera failed, trying basic video:', frontCameraError);
          
          // Last fallback - basic video
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('Basic camera accessed successfully');
        }
      }

      console.log('Camera stream obtained, tracks:', mediaStream.getVideoTracks());
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait for video element to be ready
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('Video playing successfully');
              setIsLoading(false);
            }).catch(error => {
              console.error('Video play failed:', error);
              setCameraError('Failed to start video playback');
              setIsLoading(false);
            });
          }
        };

        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error);
          setCameraError('Video element failed to load');
          setIsLoading(false);
        };
      }

    } catch (error) {
      console.error('Camera access error:', error);
      setIsLoading(false);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.');
        } else if (error.name === 'NotReadableError') {
          setCameraError('Camera is already in use by another application.');
        } else {
          setCameraError(`Camera error: ${error.message}`);
        }
      } else {
        setCameraError('Unknown camera error occurred.');
      }
      
      // Automatically fallback to file upload
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 2000);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.label);
        track.stop();
      });
      setStream(null);
    }
    setShowCamera(false);
    setCameraError('');
    setIsLoading(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      console.log('Capturing photo, video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setCameraError('Camera feed not ready. Please wait or try again.');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Photo captured successfully');
        onImageCapture(imageBase64, 'camera');
        stopCamera();
        onClose();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageCapture(result, 'upload');
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    startCamera();
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {!showCamera ? (
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleTakePhoto}
            className="flex flex-col items-center gap-2 h-20 bg-gluten-primary"
            disabled={isLoading}
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">
              {isLoading ? 'Starting...' : 'Take Photo'}
            </span>
          </Button>
          
          <Button
            onClick={handleUploadPhoto}
            variant="outline"
            className="flex flex-col items-center gap-2 h-20"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm">Upload Photo</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Starting camera...</p>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-black min-h-[200px]"
              style={{ objectFit: 'cover' }}
            />
            
            <Button
              onClick={stopCamera}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={capturePhoto} 
              className="flex-1 bg-gluten-primary"
              disabled={isLoading}
            >
              {type === 'recipe' ? 'Capture Recipe' : 'Capture Ingredient'}
            </Button>
            <Button onClick={stopCamera} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {cameraError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Camera Error</p>
            <p>{cameraError}</p>
            <p className="mt-1 text-xs">Will automatically switch to file upload...</p>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCapture;
