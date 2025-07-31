
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthProviderDetection } from '@/hooks/useAuthProviderDetection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordModal = ({ open, onOpenChange }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [checkingProviders, setCheckingProviders] = useState(false);
  const { toast } = useToast();
  
  // Use provider detection hook
  const providerInfo = useAuthProviderDetection(email);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Password reset email sent",
          description: "Check your email for instructions to reset your password.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            {emailSent
              ? "We've sent you a password reset link. Check your email and follow the instructions."
              : "Enter your email address and we'll send you a link to reset your password."}
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Show provider-specific messaging */}
            {email && !providerInfo.loading && providerInfo.providers.length > 0 && (
              <div className="space-y-3">
                {(providerInfo.hasGoogleOAuth || providerInfo.hasAppleOAuth) && !providerInfo.hasEmailPassword && (
                  <Alert className="border-amber-500 bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">
                          This account uses {providerInfo.hasGoogleOAuth ? 'Google' : 'Apple'} OAuth
                        </p>
                        <p className="text-sm">
                          You signed up with {providerInfo.hasGoogleOAuth ? 'Google' : 'Apple'}, so you don't have a password to reset. 
                          Please use the "Continue with {providerInfo.hasGoogleOAuth ? 'Google' : 'Apple'}" button on the sign-in page instead.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleClose}
                          className="mt-2"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Back to Sign In
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {providerInfo.hasEmailPassword && (
                  <Alert className="border-blue-500 bg-blue-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="text-sm">
                        This account uses email and password authentication. You can proceed with the password reset.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {providerInfo.loading && email && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Checking authentication method...
                </AlertDescription>
              </Alert>
            )}

            {/* Only show reset form if user has email/password auth or we haven't detected providers yet */}
            {(!email || providerInfo.loading || providerInfo.hasEmailPassword || providerInfo.providers.length === 0) && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading || 
                      !email || 
                      providerInfo.loading || 
                      (providerInfo.providers.length > 0 && !providerInfo.hasEmailPassword)
                    }
                    className="flex-1 bg-gluten-primary hover:bg-gluten-primary/90"
                  >
                    {loading ? 'Sending...' : 'Send reset link'}
                  </Button>
                </div>
              </form>
            )}

            {/* If only OAuth providers and no email/password, just show close button */}
            {email && !providerInfo.loading && providerInfo.providers.length > 0 && !providerInfo.hasEmailPassword && (
              <div className="flex justify-end">
                <Button onClick={handleClose} variant="outline">
                  Close
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-end">
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
