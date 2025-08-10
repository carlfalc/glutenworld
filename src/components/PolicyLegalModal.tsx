import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsOfServiceModal } from './TermsOfServiceModal';

interface PolicyLegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PolicyLegalModal = ({ open, onOpenChange }: PolicyLegalModalProps) => {
  const navigate = useNavigate();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Policies & Legal</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Privacy Policy</h3>
                <p className="text-muted-foreground mb-4">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/privacy-policy')}
                  className="w-full"
                >
                  View Full Privacy Policy
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Terms of Service</h3>
                <p className="text-muted-foreground mb-4">
                  By using GlutenWorld, you agree to our terms of service and acceptable use policies.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setTermsOpen(true)}
                  className="w-full"
                >
                  View Terms of Service
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Medical Disclaimer</h3>
                <p className="text-muted-foreground mb-4">
                  <strong>IMPORTANT:</strong> GlutenWorld provides information for educational purposes only and is not a substitute for professional medical advice.
                </p>
                <p className="text-sm text-muted-foreground">
                  Always consult with qualified healthcare professionals before making dietary changes, 
                  especially if you have celiac disease or other medical conditions requiring gluten-free diets.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Data Usage & Compliance</h3>
                <p className="text-muted-foreground mb-4">
                  We use your data to improve our AI recipe recommendations and provide personalized experiences.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your recipe data helps train our models to provide better gluten-free alternatives. 
                  All data processing complies with GDPR, CCPA, and other applicable privacy regulations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Liability Limitations</h3>
                <p className="text-muted-foreground mb-4">
                  GlutenWorld is provided "as is" without warranties of any kind.
                </p>
                <p className="text-sm text-muted-foreground">
                  We are not liable for any damages arising from the use of our service. Users are responsible 
                  for verifying all ingredient and nutritional information before consumption.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Contact</h3>
                <p className="text-muted-foreground">
                  For questions about our policies or legal matters, contact us at legal@glutenworld.app
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};