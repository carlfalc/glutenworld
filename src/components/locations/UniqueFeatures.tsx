import { Shield, Star, MapPin, Menu, AlertTriangle, Globe } from 'lucide-react';
import FreeTrialButton from '@/components/FreeTrialButton';

const UniqueFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: 'Dedicated GF Kitchen Filter',
      description: 'Find restaurants with 100% gluten-free kitchens - zero cross-contamination risk',
      highlight: 'Zero Cross-Contamination',
      color: 'text-green-600'
    },
    {
      icon: Star,
      title: 'Verified Celiac Reviews',
      description: 'Real reviews from diagnosed celiacs who\'ve eaten there safely',
      highlight: 'Real Celiac Reviews',
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Offline Maps',
      description: 'Download entire cities for travel - works without internet',
      highlight: 'Works Offline',
      color: 'text-purple-600'
    },
    {
      icon: Menu,
      title: 'Menu Details',
      description: 'See exact GF options, prices, and preparation methods',
      highlight: 'Detailed Menus',
      color: 'text-orange-600'
    },
    {
      icon: AlertTriangle,
      title: 'Safety Ratings',
      description: 'Our algorithm rates cross-contamination risk at each venue',
      highlight: 'AI Safety Scores',
      color: 'text-red-600'
    },
    {
      icon: Globe,
      title: 'Local Language Support',
      description: 'Menus and reviews in 47 languages',
      highlight: '47 Languages',
      color: 'text-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Not Just Another Restaurant Finder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built specifically for celiacs, by celiacs. Every feature designed to keep you safe and confident while dining out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20 h-full">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm mb-6 ${feature.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${feature.color} bg-current/10`}>
                      {feature.highlight}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature highlight section */}
        <div className="mt-20 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                The Only App That Understands Celiac Disease
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-primary m-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Medical-Grade Safety Standards</h4>
                    <p className="text-muted-foreground text-sm">Every location verified against celiac dietary requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-primary m-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Community-Driven Updates</h4>
                    <p className="text-muted-foreground text-sm">Real-time updates from celiac community members</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 mt-1">
                    <AlertTriangle className="w-4 h-4 text-primary m-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Risk Assessment AI</h4>
                    <p className="text-muted-foreground text-sm">Machine learning analyzes contamination risk at each venue</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-left">
              <div className="bg-background rounded-2xl p-8 shadow-sm border border-border">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-4xl font-bold text-primary">500,000+</div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Celiacs trust GlutenWorld to keep them safe while dining out. Join them today.
                </p>
                <FreeTrialButton className="w-full" size="lg">
                  Start Free Trial
                </FreeTrialButton>
                <p className="text-xs text-muted-foreground mt-3">
                  No credit card • Instant access • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueFeatures;