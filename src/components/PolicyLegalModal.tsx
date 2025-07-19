import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PolicyLegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PolicyLegalModal = ({ open, onOpenChange }: PolicyLegalModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Policies & Legal</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <Tabs defaultValue="liability" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="liability">Liability</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="liability" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Liability Disclaimer</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    <strong className="text-foreground">Important Medical Disclaimer:</strong> Gluten World is an informational platform designed to assist individuals with gluten intolerance and celiac disease. However, we are not medical professionals, and our services should not replace professional medical advice, diagnosis, or treatment.
                  </p>
                  
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">⚠️ Critical Safety Notice</h4>
                    <p className="text-orange-700 dark:text-orange-300">
                      Always consult with healthcare professionals before making dietary changes. Individual sensitivities vary, and what works for one person may not be safe for another.
                    </p>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Limitation of Liability</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Gluten World provides information and tools as-is, without warranties of any kind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>We are not liable for any health consequences resulting from the use of our platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Recipe conversions and ingredient analysis are suggestions based on available data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Users are responsible for verifying ingredient safety and consulting appropriate professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Cross-contamination risks may not be fully captured in our analysis</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Third-Party Content</h4>
                  <p>
                    Our platform includes user-generated content and community recommendations. Gluten World does not endorse or guarantee the accuracy of content provided by users. All community contributions should be independently verified.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Service Availability</h4>
                  <p>
                    While we strive for continuous service availability, Gluten World may experience downtime for maintenance, updates, or technical issues. We are not liable for any inconvenience or consequences resulting from temporary service interruptions.
                  </p>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Payment Policy</h3>
                <div className="space-y-4 text-muted-foreground">
                  <h4 className="font-semibold text-foreground mb-3">Subscription Plans</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Free Tier:</strong> Basic access to core features with usage limitations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Monthly Premium:</strong> Full access to all features, billed monthly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Annual Premium:</strong> Full access with significant savings, billed annually</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Payment Processing</h4>
                  <p>
                    All payments are processed securely through Stripe, a leading payment processor. We do not store your credit card information on our servers. Accepted payment methods include major credit cards, debit cards, and digital wallets where available.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Billing Cycle</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Monthly subscriptions are billed every 30 days from your signup date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Annual subscriptions are billed every 12 months from your signup date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Billing date remains consistent unless you change your subscription plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>You will receive email notifications before each billing cycle</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Failed Payments</h4>
                  <p>
                    If a payment fails, we will attempt to process it again within 3 business days. If all retry attempts fail, your subscription will be downgraded to the free tier. You can update your payment method at any time through your account settings.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Price Changes</h4>
                  <p>
                    Existing subscribers will be notified at least 30 days in advance of any price changes. New prices will not affect your current billing cycle but will apply to subsequent renewals unless you cancel before the new rate takes effect.
                  </p>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="refunds" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Refund Policy</h3>
                <div className="space-y-4 text-muted-foreground">
                  <h4 className="font-semibold text-foreground mb-3">Free Trial Period</h4>
                  <p>
                    New users receive a 5-day free trial of premium features. No credit card is required to start the trial. You can cancel anytime during the trial period with no charges applied to your account.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Subscription Refunds</h4>
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">15-Day Satisfaction Guarantee</h5>
                    <p className="text-blue-700 dark:text-blue-300">
                      If you're not satisfied with Gluten World Premium within the first 15 days of your subscription, we offer a full refund with no questions asked.
                    </p>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Refund Eligibility</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Eligible:</strong> Requests made within 15 days of initial subscription or renewal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Eligible:</strong> Technical issues preventing use of paid features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Eligible:</strong> Accidental duplicate charges or billing errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span><strong>Not Eligible:</strong> Requests after 15 days from billing date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span><strong>Not Eligible:</strong> Violation of terms of service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span><strong>Not Eligible:</strong> Partial refunds for partial billing periods</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Refund Process</h4>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">1.</span>
                      <span>Contact our support team at glutenworldhelp@gmail.com with your refund request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">2.</span>
                      <span>Include your account email, reason for refund, and any relevant details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">3.</span>
                      <span>We will review your request within 2-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">4.</span>
                      <span>Approved refunds are processed within 5-7 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">5.</span>
                      <span>Refunds appear on your original payment method within 1-2 billing cycles</span>
                    </li>
                  </ol>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Annual Subscription Refunds</h4>
                  <p>
                    Annual subscriptions are eligible for full refunds within 15 days of purchase. After this period, we do not offer partial refunds for unused portions of annual subscriptions, but you can cancel to prevent future renewals.
                  </p>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Terms of Service</h3>
                <div className="space-y-4 text-muted-foreground">
                  <h4 className="font-semibold text-foreground mb-3">Acceptance of Terms</h4>
                  <p>
                    By accessing and using Gluten World, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our service.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">User Responsibilities</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Provide accurate account information and keep it updated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Use the service responsibly and in accordance with its intended purpose</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Respect other community members and maintain a supportive environment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Not share your account credentials with others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Verify all recipe and ingredient information independently</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Prohibited Activities</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">×</span>
                      <span>Posting harmful, offensive, or inappropriate content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">×</span>
                      <span>Attempting to reverse engineer or hack our systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">×</span>
                      <span>Using automated tools to scrape or abuse our services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">×</span>
                      <span>Providing medical advice or making health claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">×</span>
                      <span>Violating intellectual property rights</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Account Termination</h4>
                  <p>
                    We reserve the right to terminate or suspend accounts that violate these terms. Users may also delete their accounts at any time through account settings. Upon termination, access to premium features ceases immediately, though basic account data may be retained as required by law.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Intellectual Property</h4>
                  <p>
                    The Gluten World platform, including its AI algorithms, database, and original content, is protected by intellectual property laws. Users retain ownership of content they create but grant us license to use it within our platform. Users may not reproduce or distribute our proprietary content without permission.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Privacy & Data Protection</h4>
                  <p>
                    We are committed to protecting user privacy and comply with applicable data protection regulations. Personal information is collected and used only as described in our Privacy Policy. Users have the right to access, modify, or delete their personal data.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Changes to Terms</h4>
                  <p>
                    These terms may be updated periodically to reflect changes in our service or legal requirements. Users will be notified of significant changes via email or platform notifications. Continued use of the service after changes constitutes acceptance of the new terms.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg mt-6">
                    <p className="text-sm">
                      <strong>Last Updated:</strong> January 2024<br />
                      <strong>Contact:</strong> For questions about these terms, contact glutenworldhelp@gmail.com
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};