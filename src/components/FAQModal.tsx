import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FAQModal = ({ open, onOpenChange }: FAQModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Frequently Asked Questions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <Accordion type="single" collapsible className="w-full space-y-2">
            
            {/* Getting Started */}
            <AccordionItem value="getting-started" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How do I get started with Gluten World?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply sign up for a free account and you'll get access to our basic features. You can start by exploring our recipe database, using the AI recipe converter, or browsing the community marketplace. Premium features like unlimited AI conversions and advanced ingredient analysis are available with a subscription.
              </AccordionContent>
            </AccordionItem>

            {/* AI Recipe Generator */}
            <AccordionItem value="ai-recipe" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How does the AI Recipe Generator work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our AI analyzes your recipe ingredients and automatically suggests gluten-free alternatives. It considers texture, flavor, and nutritional balance to provide the best substitutions. You can input recipes by typing, pasting, or even using voice commands. The AI learns from our community's feedback to continuously improve suggestions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai-accuracy" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How accurate are the AI recipe conversions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our AI has been trained on thousands of successful gluten-free conversions and community feedback. While we strive for high accuracy, we always recommend reviewing suggestions and testing recipes. The AI provides detailed explanations for each substitution, and you can rate results to help improve future recommendations.
              </AccordionContent>
            </AccordionItem>

            {/* Ingredient Analysis */}
            <AccordionItem value="ingredient-scanner" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How does the ingredient scanner work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can scan product labels using your device's camera or manually input ingredient lists. Our system analyzes each ingredient for gluten content, cross-contamination risks, and hidden gluten sources. It also checks for derivatives and provides detailed safety ratings with explanations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hidden-gluten" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                Can the app detect hidden gluten sources?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Our database includes over 200 hidden gluten sources and derivatives like maltodextrin, modified food starch, and various flavorings. We also identify potential cross-contamination risks and manufacturing warnings that might not be obvious on labels.
              </AccordionContent>
            </AccordionItem>

            {/* Store Locator */}
            <AccordionItem value="store-locator" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How does the Global Store Locator work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our store locator uses your location to find nearby gluten-free friendly stores, restaurants, and specialty shops. You can filter by store type, distance, and user ratings. The database includes both major chains and local businesses, with community-contributed reviews and recommendations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="add-stores" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                Can I add stores to the locator?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! Community contributions help keep our database current and comprehensive. You can add new stores, update information, and leave reviews about your experiences. All submissions are reviewed to ensure accuracy.
              </AccordionContent>
            </AccordionItem>

            {/* Recipe Management */}
            <AccordionItem value="save-recipes" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How do I save and organize my recipes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Use the heart icon to favorite recipes, and organize them into custom collections like "Quick Dinners" or "Holiday Treats." You can rate recipes, add personal notes, and share your favorites with the community. Your recipe history is automatically saved for easy access.
              </AccordionContent>
            </AccordionItem>

            {/* Community Features */}
            <AccordionItem value="community" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How can I participate in the Gluten World community?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Join discussions, share your own recipes, post product recommendations, and connect with others who understand your dietary needs. You can create posts, comment on others' content, and follow community members whose content you enjoy. The community is moderated to ensure a supportive, helpful environment.
              </AccordionContent>
            </AccordionItem>

            {/* Subscription & Billing */}
            <AccordionItem value="subscription-features" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                What's included in the premium subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Premium includes unlimited AI recipe conversions, advanced ingredient analysis, priority customer support, early access to new features, ad-free experience, and enhanced community features. You also get access to premium recipe collections and detailed nutritional analysis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="free-trial" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                Is there a free trial available?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! New users get a 7-day free trial of premium features. No credit card required to start. During the trial, you have full access to all premium features. You can cancel anytime before the trial ends with no charges.
              </AccordionContent>
            </AccordionItem>

            {/* Technical Support */}
            <AccordionItem value="mobile-app" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                Is there a mobile app available?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Gluten World is a progressive web app that works seamlessly on all devices. You can add it to your home screen for app-like functionality. We're developing dedicated iOS and Android apps with enhanced camera features and offline capabilities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="offline-access" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                Can I use Gluten World offline?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Currently, most features require an internet connection for the latest data and AI processing. However, your saved recipes and favorites are cached for offline viewing. We're working on expanded offline capabilities for future updates.
              </AccordionContent>
            </AccordionItem>

            {/* Data & Privacy */}
            <AccordionItem value="data-privacy" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How is my personal data protected?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We use industry-standard encryption and security measures to protect your data. We never sell personal information to third parties. Your recipes and dietary preferences are private unless you choose to share them with the community. You can delete your account and all associated data at any time.
              </AccordionContent>
            </AccordionItem>

            {/* Dietary Restrictions */}
            <AccordionItem value="other-allergies" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                Does Gluten World support other dietary restrictions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                While our primary focus is gluten-free living, we also provide information about common allergens like dairy, nuts, soy, and eggs. Our AI can suggest alternatives for multiple dietary restrictions simultaneously. We're continuously expanding our database to support more dietary needs.
              </AccordionContent>
            </AccordionItem>

            {/* Troubleshooting */}
            <AccordionItem value="not-working" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                What should I do if a feature isn't working?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                First, try refreshing your browser or restarting the app. Check your internet connection and clear your browser cache if needed. If the problem persists, contact our support team at glutenworldhelp@gmail.com with details about the issue, including your device and browser information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="feedback" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold">
                How can I provide feedback or suggest new features?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We love hearing from our community! Send feedback and feature requests to glutenworldhelp@gmail.com. You can also participate in community discussions where other users and our team can vote on and discuss potential improvements. Premium subscribers get priority consideration for feature requests.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};