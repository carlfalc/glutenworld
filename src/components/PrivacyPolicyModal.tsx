import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Information We Collect</h3>
              <p className="mb-2">
                GlutenWorld collects the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Account Information:</strong> Email address, name, and profile details when you create an account</li>
                <li><strong>Recipe Data:</strong> Recipes you create, save, or interact with</li>
                <li><strong>Usage Data:</strong> How you use our app, including features accessed and search queries</li>
                <li><strong>Location Data:</strong> Approximate location for store locator features (with your permission)</li>
                <li><strong>Camera/Photos:</strong> Images you capture or upload for recipe analysis (processed locally when possible)</li>
                <li><strong>Voice Data:</strong> Voice recordings for recipe input (processed and not stored permanently)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide personalized gluten-free recipe recommendations</li>
                <li>Enable recipe conversion and AI-powered features</li>
                <li>Locate nearby gluten-free stores and restaurants</li>
                <li>Improve our services and develop new features</li>
                <li>Send service-related notifications and updates</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Information Sharing</h3>
              <p className="mb-2">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Service Providers:</strong> Third-party services that help us operate our app (OpenAI for AI features, Google for maps)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information, including encryption 
                in transit and at rest, secure authentication, and regular security assessments.
              </p>
            </section>

            <section>
              <h3 className="font-semibent text-base mb-2">Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of certain communications</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Medical Disclaimer</h3>
              <p>
                GlutenWorld provides information for educational purposes only. Our app is not intended to 
                provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare 
                professionals before making dietary changes, especially if you have celiac disease or 
                severe gluten sensitivity.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Children's Privacy</h3>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy, please contact us at privacy@glutenworld.app
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};