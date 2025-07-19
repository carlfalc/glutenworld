import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AboutUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutUsModal = ({ open, onOpenChange }: AboutUsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">About Gluten World</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gluten World is a worldwide network of passionate developers and health advocates who have personally 
                experienced the challenges of navigating life with gluten intolerance, celiac disease, and other food 
                allergies. Our journey began from frustration with unclear food labeling, hidden gluten derivatives, 
                and the lack of comprehensive tools to help those with dietary restrictions live confidently.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As developers who struggled with understanding the implications of confusing food labels, we experienced 
                firsthand how products often don't clearly display what's actually in them. Even worse, many contain 
                derivatives or traces of gluten that aren't immediately obvious to consumers. This personal struggle 
                drove us to create a comprehensive solution that goes beyond basic ingredient lists.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We realized that the challenge wasn't just about identifying gluten-free products, but about building 
                a supportive community where people could share their experiences, discover safe recipes, and access 
                tools that truly understand the complexity of living with dietary restrictions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Community</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gluten World is more than just a platform—it's a thriving community where people with gluten intolerance, 
                celiac disease, and other allergen sensitivities can connect, share their stories, and support one another. 
                Our members span across continents, creating a global network of understanding and shared experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through our community features, members can share their favorite recipes, discuss challenges they've 
                overcome, recommend safe products and restaurants, and celebrate their journey toward better health. 
                We believe that together, we're stronger and more informed.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Features & Innovation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">AI-Powered Recipe Conversion</h4>
                  <p className="text-muted-foreground">Transform any recipe into gluten-free alternatives with our intelligent AI system.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Comprehensive Ingredient Analysis</h4>
                  <p className="text-muted-foreground">Advanced scanning and analysis of ingredients, including hidden gluten sources and cross-contamination risks.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Global Store Locator</h4>
                  <p className="text-muted-foreground">Find gluten-free friendly stores, restaurants, and specialty shops worldwide.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Community Marketplace</h4>
                  <p className="text-muted-foreground">Discover and share trusted gluten-free products and brands within our community.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Personal Recipe Management</h4>
                  <p className="text-muted-foreground">Organize, rate, and share your favorite gluten-free recipes with ease.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Commitment</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We're committed to continuously developing features that address the real-world challenges faced by 
                people with gluten intolerance, celiac disease, and other food allergies. Our development team includes 
                individuals who live with these conditions, ensuring that every feature we build is tested and validated 
                by those who need it most.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Beyond gluten-free support, we're expanding our platform to accommodate various allergen sensitivities, 
                dietary preferences, and health conditions. Our goal is to create a comprehensive ecosystem where anyone 
                with dietary restrictions can find the tools, community, and support they need to thrive.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary">Join Our Global Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're newly diagnosed with celiac disease, have been managing gluten intolerance for years, 
                or are supporting a loved one with dietary restrictions, Gluten World is here to empower your journey. 
                Join thousands of members worldwide who are transforming their relationship with food and discovering 
                that living gluten-free doesn't mean living without flavor, variety, or joy.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};