import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Settings, Shield } from 'lucide-react';

interface CookieConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptAll: () => void;
  onAcceptSelected: (preferences: CookiePreferences) => void;
  onRejectAll: () => void;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const CookieConsentModal = ({ 
  open, 
  onOpenChange, 
  onAcceptAll, 
  onAcceptSelected, 
  onRejectAll 
}: CookieConsentModalProps) => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    onAcceptAll();
    onOpenChange(false);
  };

  const handleAcceptSelected = () => {
    onAcceptSelected(preferences);
    onOpenChange(false);
  };

  const handleRejectAll = () => {
    onRejectAll();
    onOpenChange(false);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-primary">
            <Cookie className="w-6 h-6" />
            Cookie Preferences
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {!showDetails ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🍪 We use cookies to enhance your experience</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  We use cookies to provide you with the best possible experience on Gluten World. Some cookies are essential for the website to function, while others help us understand how you use our platform and improve our services.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">What cookies do we use?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Essential:</strong> Required for basic functionality and security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 bg-blue-600 rounded-full mt-1 flex-shrink-0"></span>
                    <span><strong>Analytics:</strong> Help us understand how you use our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 bg-purple-600 rounded-full mt-1 flex-shrink-0"></span>
                    <span><strong>Marketing:</strong> Show you relevant content and promotions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 bg-orange-600 rounded-full mt-1 flex-shrink-0"></span>
                    <span><strong>Functional:</strong> Remember your preferences and settings</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <Label className="font-semibold">Essential Cookies</Label>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      These cookies are necessary for the website to function and cannot be disabled. They include authentication, security, and basic functionality cookies.
                    </p>
                  </div>
                  <Switch checked={true} disabled className="ml-4" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                      <Label className="font-semibold">Analytics Cookies</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.analytics} 
                    onCheckedChange={(value) => updatePreference('analytics', value)}
                    className="ml-4" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-4 h-4 bg-purple-600 rounded-full"></span>
                      <Label className="font-semibold">Marketing Cookies</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Used to track visitors across websites to display relevant advertisements and promotional content.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.marketing} 
                    onCheckedChange={(value) => updatePreference('marketing', value)}
                    className="ml-4" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-4 h-4 bg-orange-600 rounded-full"></span>
                      <Label className="font-semibold">Functional Cookies</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Remember your preferences and settings to provide enhanced, personalized features.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.functional} 
                    onCheckedChange={(value) => updatePreference('functional', value)}
                    className="ml-4" 
                  />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className="flex flex-col gap-3">
          {!showDetails && (
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Customize Settings
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRejectAll}
              className="flex-1"
            >
              Reject All
            </Button>
            {showDetails ? (
              <Button 
                onClick={handleAcceptSelected}
                className="flex-1 bg-gluten-primary hover:bg-gluten-primary/90"
              >
                Save Preferences
              </Button>
            ) : (
              <Button 
                onClick={handleAcceptAll}
                className="flex-1 bg-gluten-primary hover:bg-gluten-primary/90"
              >
                Accept All Cookies
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};