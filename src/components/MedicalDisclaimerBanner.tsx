import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
  onLearnMore?: () => void;
}

export const MedicalDisclaimerBanner = ({ onLearnMore }: MedicalDisclaimerBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800 mb-4">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800 dark:text-orange-200 flex items-center justify-between">
        <div className="flex-1">
          <strong>Medical Disclaimer:</strong> This platform provides information only. 
          Always consult healthcare professionals before making dietary changes.
          {onLearnMore && (
            <Button 
              variant="link" 
              className="p-0 h-auto ml-1 text-orange-700 dark:text-orange-300 underline"
              onClick={onLearnMore}
            >
              Learn more
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </AlertDescription>
    </Alert>
  );
};