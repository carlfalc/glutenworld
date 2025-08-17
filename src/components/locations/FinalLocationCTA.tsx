import { Download, Search, CheckCircle } from 'lucide-react';
import FreeTrialButton from '@/components/FreeTrialButton';
import { Button } from '@/components/ui/button';

const FinalLocationCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Never Eat Unsafely Again
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Download now and find your first safe restaurant in seconds
          </p>

          {/* Three-step process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">1. Download App</h3>
              <p className="text-muted-foreground">Get instant access to 50,000+ verified gluten-free locations worldwide</p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">2. Search Your Location</h3>
              <p className="text-muted-foreground">Find restaurants, bakeries, and cafes with dedicated GF options nearby</p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">3. Eat Safely</h3>
              <p className="text-muted-foreground">Dine with confidence knowing every location is verified by celiacs</p>
            </div>
          </div>

          {/* Main CTA */}
          <div className="mb-12">
            <FreeTrialButton size="lg" className="px-12 py-4 text-xl mb-4">
              Start 5-Day Free Trial
            </FreeTrialButton>
            <p className="text-lg text-muted-foreground">
              No credit card • Works offline • 50,000+ locations
            </p>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">App Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.7%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">190</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalLocationCTA;