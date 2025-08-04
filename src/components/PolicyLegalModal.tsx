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
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="liability">Liability</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
              <TabsTrigger value="accessibility">Access</TabsTrigger>
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
                      <span><strong>Quarterly Premium:</strong> Full access to all features, billed quarterly</span>
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
                      <span>Quarterly subscriptions are billed every 3 months from your signup date</span>
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
                  
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-4 rounded-lg mt-4">
                    <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">⚠️ Trial Billing Notice</h5>
                    <p className="text-orange-700 dark:text-orange-300">
                      If you do not cancel before your trial ends, you will be automatically charged for a quarterly subscription.
                    </p>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Subscription Refunds</h4>
                  <p>
                    All subscription payments are final. We do not offer refunds for subscription fees once charged, except in cases of technical issues preventing use of paid features or billing errors.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Refund Eligibility</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Eligible:</strong> Technical issues preventing use of paid features if not resolved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Eligible:</strong> Accidental duplicate charges or billing errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span><strong>Not Eligible:</strong> Dissatisfaction with service or change of mind</span>
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

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Subscription Cancellation</h4>
                  <p>
                    You can cancel your subscription at any time through your account settings. Cancellation prevents future renewals but does not result in refunds for the current billing period. You will retain access to premium features until your current subscription period expires.
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

            <TabsContent value="privacy" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Privacy Policy & GDPR Compliance</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔒 Your Privacy is Our Priority</h4>
                    <p className="text-green-700 dark:text-green-300">
                      We are committed to protecting your personal data and respecting your privacy rights under GDPR and other applicable data protection laws.
                    </p>
                  </div>

                  <h4 className="font-semibold text-foreground mb-3">Data We Collect</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Account Information:</strong> Email, name, subscription details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Usage Data:</strong> Recipes converted, features used, app interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Content Data:</strong> Recipes you save, photos you upload, community posts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Technical Data:</strong> Device info, IP address, cookies, analytics</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">How We Use Your Data</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Provide and improve our recipe conversion and store locator services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Personalize your experience and remember your preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Process payments and manage your subscription</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Send important updates about your account and our services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Analyze usage patterns to improve our AI algorithms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span>Ensure security and prevent fraud or abuse</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Legal Basis for Processing</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p><strong>Contract Performance:</strong> Processing necessary to provide our services</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p><strong>Legitimate Interest:</strong> Improving services, security, and communications</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p><strong>Consent:</strong> Marketing communications, analytics cookies, optional features</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <p><strong>Legal Obligation:</strong> Compliance with laws, tax requirements, safety</p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Data Sharing</h4>
                  <p className="mb-3">We do not sell your personal data. We may share data with:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Service Providers:</strong> Stripe (payments), cloud hosting, email services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Legal Requirements:</strong> When required by law or to protect rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">International Data Transfers</h4>
                  <p>
                    Your data may be processed in countries outside your region. We ensure appropriate safeguards are in place, including adequacy decisions, standard contractual clauses, or other approved transfer mechanisms.
                  </p>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Data Retention</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Account Data:</strong> Until you delete your account or as required by law</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Usage Analytics:</strong> Aggregated and anonymized data may be retained longer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Financial Records:</strong> 7 years for tax and legal compliance</span>
                    </li>
                  </ul>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="cookies" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Cookie Policy</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🍪 What are Cookies?</h4>
                    <p className="text-orange-700 dark:text-orange-300">
                      Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience and understand how our platform is used.
                    </p>
                  </div>

                  <h4 className="font-semibold text-foreground mb-3">Types of Cookies We Use</h4>
                  
                  <div className="space-y-4">
                    <div className="border border-green-200 dark:border-green-800 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Essential Cookies (Required)</h5>
                      <p className="text-sm mb-2">These cookies are necessary for the website to function properly:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Authentication and login sessions</li>
                        <li>• Security and fraud prevention</li>
                        <li>• Basic website functionality</li>
                        <li>• Your cookie preferences</li>
                      </ul>
                    </div>

                    <div className="border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Analytics Cookies (Optional)</h5>
                      <p className="text-sm mb-2">Help us understand how you use our platform:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Page views and user interactions</li>
                        <li>• Popular features and content</li>
                        <li>• Error tracking and performance monitoring</li>
                        <li>• Aggregated usage statistics</li>
                      </ul>
                    </div>

                    <div className="border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Marketing Cookies (Optional)</h5>
                      <p className="text-sm mb-2">Used to show you relevant content and advertisements:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Personalized content recommendations</li>
                        <li>• Targeted promotions and offers</li>
                        <li>• Social media integration</li>
                        <li>• Third-party advertising networks</li>
                      </ul>
                    </div>

                    <div className="border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
                      <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Functional Cookies (Optional)</h5>
                      <p className="text-sm mb-2">Remember your preferences and enhance functionality:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Language and region preferences</li>
                        <li>• UI customizations and settings</li>
                        <li>• Saved recipes and favorites</li>
                        <li>• Chat history and AI interactions</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Managing Your Cookie Preferences</h4>
                  <p className="mb-3">You can control your cookie preferences in several ways:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Cookie Banner:</strong> Accept or reject cookies when you first visit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Account Settings:</strong> Update preferences anytime in your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Browser Settings:</strong> Configure cookie settings in your browser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Contact Us:</strong> Email us at glutenworldhelp@gmail.com for assistance</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Third-Party Cookies</h4>
                  <p className="mb-3">Some cookies are set by third-party services we use:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Stripe:</strong> Payment processing and fraud prevention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Analytics Services:</strong> Website usage and performance tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>CDN Services:</strong> Content delivery and caching</span>
                    </li>
                  </ul>

                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-6">
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      <strong>Note:</strong> Disabling certain cookies may affect your experience on our platform. Essential cookies cannot be disabled as they are required for basic functionality.
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-6 mt-6">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary">Accessibility Statement</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">♿ Commitment to Accessibility</h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      Gluten World is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
                    </p>
                  </div>

                  <h4 className="font-semibold text-foreground mb-3">Accessibility Standards</h4>
                  <p className="mb-3">We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, which include:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Perceivable:</strong> Information presented in ways users can perceive</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Operable:</strong> Interface components that users can operate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Understandable:</strong> Information and UI operation must be understandable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Robust:</strong> Content must be robust enough for assistive technologies</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Accessibility Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm">Keyboard Navigation</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Full keyboard accessibility</li>
                        <li>• Logical tab order</li>
                        <li>• Visible focus indicators</li>
                        <li>• Skip navigation links</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm">Screen Reader Support</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Semantic HTML structure</li>
                        <li>• Alt text for images</li>
                        <li>• ARIA labels and descriptions</li>
                        <li>• Proper heading hierarchy</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm">Visual Design</h5>
                      <ul className="text-sm space-y-1">
                        <li>• High contrast color ratios</li>
                        <li>• Scalable text and UI elements</li>
                        <li>• Dark/light mode toggle</li>
                        <li>• Clear visual hierarchy</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm">Content</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Clear, simple language</li>
                        <li>• Descriptive link text</li>
                        <li>• Error identification</li>
                        <li>• Form labels and instructions</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Assistive Technology Compatibility</h4>
                  <p className="mb-3">Our platform is designed to work with common assistive technologies, including:</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    <ul className="space-y-1 text-sm">
                      <li>• JAWS (Windows)</li>
                      <li>• NVDA (Windows)</li>
                      <li>• VoiceOver (macOS/iOS)</li>
                      <li>• TalkBack (Android)</li>
                    </ul>
                    <ul className="space-y-1 text-sm">
                      <li>• Dragon NaturallySpeaking</li>
                      <li>• Switch navigation devices</li>
                      <li>• Eye-tracking systems</li>
                      <li>• Voice control software</li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Known Limitations</h4>
                  <p className="mb-3">We are actively working to address the following accessibility challenges:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">⚠</span>
                      <span>Some AI-generated recipe images may lack detailed alt text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">⚠</span>
                      <span>Complex data visualizations may need additional description</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">⚠</span>
                      <span>Camera capture features require manual operation</span>
                    </li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Feedback and Support</h4>
                  <p className="mb-3">We welcome your feedback on accessibility. If you encounter barriers or have suggestions for improvement:</p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Email:</strong> glutenworldhelp@gmail.com</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Subject Line:</strong> "Accessibility Feedback"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Response Time:</strong> We aim to respond within 2 business days</span>
                      </li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-foreground mt-6 mb-3">Continuous Improvement</h4>
                  <p>
                    We regularly review and test our platform with users who have disabilities and assistive technology experts. Our accessibility efforts are ongoing, and we update this statement as we make improvements.
                  </p>

                  <p className="text-sm text-muted-foreground/80 mt-6">
                    <strong>Last Updated:</strong> January 2025
                  </p>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};