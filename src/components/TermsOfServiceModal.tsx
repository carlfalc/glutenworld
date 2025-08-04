import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal = ({ isOpen, onClose }: TermsOfServiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Acceptance of Terms</h3>
              <p>
                By accessing and using GlutenWorld, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Description of Service</h3>
              <p>
                GlutenWorld is a mobile application that provides gluten-free recipe recommendations, 
                recipe conversion tools, ingredient analysis, and store locator services for users 
                following gluten-free diets.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">User Accounts</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Acceptable Use</h3>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the service for any illegal purpose</li>
                <li>Upload harmful or malicious content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' experience</li>
                <li>Share copyrighted content without permission</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Content and Intellectual Property</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>You retain ownership of content you create</li>
                <li>You grant us license to use your content to provide our services</li>
                <li>Our service and its original content are protected by copyright and other laws</li>
                <li>You may not reproduce, modify, or distribute our content without permission</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Medical Disclaimer</h3>
              <p>
                <strong>IMPORTANT:</strong> GlutenWorld is for informational purposes only and is not 
                intended to provide medical advice, diagnosis, or treatment. The information provided 
                should not replace professional medical advice. Always consult with qualified healthcare 
                professionals before making dietary changes, especially if you have celiac disease, 
                gluten sensitivity, or other medical conditions.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Accuracy of Information</h3>
              <p>
                While we strive to provide accurate information about gluten-free products and recipes, 
                we cannot guarantee the accuracy or completeness of all information. Users are responsible 
                for verifying ingredient information and consulting healthcare providers as needed.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Subscription and Billing</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Subscription fees are charged in advance on a recurring basis</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are subject to our refund policy</li>
                <li>We may change subscription prices with notice</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Limitation of Liability</h3>
              <p>
                GlutenWorld shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Termination</h3>
              <p>
                We may terminate or suspend your account and access to the service immediately, without 
                prior notice, for conduct that we believe violates these Terms or is harmful to other 
                users, us, or third parties.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes via email or through the app.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Contact Information</h3>
              <p>
                If you have any questions about these Terms of Service, please contact us at 
                legal@glutenworld.app
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