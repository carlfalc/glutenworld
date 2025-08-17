import { Star, Quote, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SocialProof = () => {
  const reviews = [
    {
      name: 'Emma S.',
      location: 'London',
      rating: 5,
      text: 'Found a 100% GF bakery in Prague I never would have discovered. The offline maps saved my vacation!',
      verified: true
    },
    {
      name: 'Carlos M.',
      location: 'Mexico City',
      rating: 5,
      text: 'As a celiac living abroad, this app helps me find safe restaurants in every new city I visit for work.',
      verified: true
    },
    {
      name: 'Sarah L.',
      location: 'New York',
      rating: 5,
      text: 'The dedicated GF kitchen filter is a game-changer. No more anxiety about cross-contamination!',
      verified: true
    },
    {
      name: 'Ahmed R.',
      location: 'Dubai',
      rating: 5,
      text: 'Traveling for business used to be stressful. Now I can find safe options in any city within minutes.',
      verified: true
    }
  ];

  const mediaLogos = [
    'Celiac Travel',
    'Gluten-Free Globetrotter',
    'Nomadic Matt',
    'Travel + Leisure',
    'Celiac Disease Foundation',
    'Beyond Celiac'
  ];

  const stats = [
    { number: '500K+', label: 'Happy Celiacs' },
    { number: '2.4M+', label: 'Safe Meals' },
    { number: '190', label: 'Countries' },
    { number: '99.7%', label: 'Accuracy Rate' }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Celiacs Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of thousands of people who've found food freedom with GlutenWorld
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Reviews carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {reviews.map((review, index) => (
            <div key={index} className="bg-background rounded-xl p-8 shadow-sm border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="mb-6">
                <Quote className="w-6 h-6 text-primary/40 mb-2" />
                <p className="text-foreground leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {review.location}
                    </p>
                  </div>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Verified Celiac</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Media mentions */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-bold text-foreground mb-8">
            Featured In
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {mediaLogos.map((logo, index) => (
              <div key={index} className="bg-background rounded-lg p-4 border border-border flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground text-center">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Community showcase */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Join the Community
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with fellow celiacs, share discoveries, and never eat alone again
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-background/80 rounded-xl p-6">
              <div className="text-2xl mb-2">🤝</div>
              <h4 className="font-semibold text-foreground mb-2">Support Network</h4>
              <p className="text-sm text-muted-foreground">Get advice from experienced celiacs worldwide</p>
            </div>
            <div className="bg-background/80 rounded-xl p-6">
              <div className="text-2xl mb-2">📍</div>
              <h4 className="font-semibold text-foreground mb-2">Local Discoveries</h4>
              <p className="text-sm text-muted-foreground">Share and discover hidden gems in your area</p>
            </div>
            <div className="bg-background/80 rounded-xl p-6">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-foreground mb-2">Real Reviews</h4>
              <p className="text-sm text-muted-foreground">Trust reviews from people who truly understand</p>
            </div>
          </div>
          
          <Button size="lg" className="px-8">
            Join Community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;