import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">GlutenWorld - Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-8 text-sm pr-4">
            <section>
              <h2 className="font-semibold text-xl mb-4">Information We Collect</h2>
              <p className="mb-4">
                GlutenWorld collects the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address, name, and profile details when you create an account</li>
                <li><strong>Recipe Data:</strong> Recipes you create, save, or interact with</li>
                <li><strong>Usage Data:</strong> How you use our app, including features accessed and search queries</li>
                <li><strong>Location Data:</strong> Approximate location for store locator features (with your permission)</li>
                <li><strong>Camera/Photos:</strong> Images you capture or upload for recipe analysis (processed locally when possible)</li>
                <li><strong>Voice Data:</strong> Voice recordings for recipe input (processed and not stored permanently)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide personalized gluten-free recipe recommendations</li>
                <li>Enable recipe conversion and AI-powered features</li>
                <li>Locate nearby gluten-free stores and restaurants</li>
                <li>Improve our services and develop new features</li>
                <li>Send service-related notifications and updates</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Information Sharing</h2>
              <p className="mb-4">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party services that help us operate our app (OpenAI for AI features, Google for maps)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information, including encryption 
                in transit and at rest, secure authentication, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of certain communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Medical Disclaimer</h2>
              <p className="mb-4">
                GlutenWorld provides information for educational purposes only. Our app is not intended to 
                provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare 
                professionals before making dietary changes, especially if you have celiac disease or 
                severe gluten sensitivity.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Children's Privacy</h2>
              <p className="mb-4">
                Our service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-xl mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> privacy@glutenworld.app</p>
                <p><strong>Address:</strong> GlutenWorld Privacy Team</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}