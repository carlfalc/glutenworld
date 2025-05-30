
import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CameraCaptureProps {
  onImageCapture: (imageBase64: string) => void;
  onClose: () => void;
}

const CameraCapture = ({ onImageCapture, onClose }: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        onImageCapture(imageBase64);
        stopCamera();
        onClose();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageCapture(result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {!showCamera ? (
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={startCamera}
            className="flex flex-col items-center gap-2 h-20 bg-gluten-primary"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Take Photo</span>
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
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
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
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
            <Button onClick={capturePhoto} className="flex-1 bg-gluten-primary">
              Capture Recipe
            </Button>
            <Button onClick={stopCamera} variant="outline">
              Cancel
            </Button>
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

export default CameraCapture;
