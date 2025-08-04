import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AppVersionInfoProps {
  className?: string;
}

export const AppVersionInfo = ({ className }: AppVersionInfoProps) => {
  const [version, setVersion] = useState('1.0.0');
  const [buildNumber, setBuildNumber] = useState('1');
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Check if we're in production by looking at the URL
    const isProductionBuild = !window.location.href.includes('lovableproject.com');
    setIsProduction(isProductionBuild);
    
    // Set version info based on environment
    if (isProductionBuild) {
      setVersion('1.0.0');
      setBuildNumber('1');
    } else {
      setVersion('1.0.0-dev');
      setBuildNumber('dev');
    }
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">App Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Version:</span>
          <Badge variant="secondary">{version}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Build:</span>
          <Badge variant="secondary">{buildNumber}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Environment:</span>
          <Badge variant={isProduction ? "default" : "destructive"}>
            {isProduction ? 'Production' : 'Development'}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground pt-2">
          {isProduction 
            ? 'App is ready for store submission' 
            : 'Development build - not for production'
          }
        </div>
      </CardContent>
    </Card>
  );
};