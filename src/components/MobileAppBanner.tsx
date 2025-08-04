import React, { useState, useEffect } from 'react';
import { X, Smartphone, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAppBannerProps {
  onEmailSignup?: (email: string) => void;
}

const MobileAppBanner: React.FC<MobileAppBannerProps> = ({ onEmailSignup }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('mobile-app-banner-dismissed');
    const emailStored = localStorage.getItem('app-launch-email');
    
    if (!dismissed && !emailStored && isMobile) {
      // Show banner after a delay on mobile devices
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('mobile-app-banner-dismissed', 'true');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      localStorage.setItem('app-launch-email', email);
      onEmailSignup?.(email);
      setEmailSubmitted(true);
      
      // Hide banner after successful signup
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };

  const handleGetNotified = () => {
    setShowEmailForm(true);
  };

  if (!isVisible || isDismissed || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-t-2 border-blue-500 animate-slide-in-right">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-white/10 rounded-full">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              {!showEmailForm ? (
                <>
                  <p className="font-medium text-sm">Mobile App Coming Soon!</p>
                  <p className="text-xs text-blue-100">Get early access & exclusive features</p>
                </>
              ) : emailSubmitted ? (
                <>
                  <p className="font-medium text-sm">🎉 Thanks!</p>
                  <p className="text-xs text-blue-100">You'll be the first to know!</p>
                </>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex gap-2 items-center">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-1 text-sm rounded bg-white/20 text-white placeholder:text-blue-200 border border-white/30 focus:outline-none focus:ring-1 focus:ring-white flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50 text-xs px-3 py-1"
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    Notify
                  </Button>
                </form>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!showEmailForm && !emailSubmitted && (
              <Button
                size="sm"
                onClick={handleGetNotified}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1"
              >
                Get Notified
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppBanner;