import { Plane, Map, MapPin, Hotel, Car, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FreeTrialButton from '@/components/FreeTrialButton';

const TravelSection = () => {
  const travelFeatures = [
    {
      icon: Plane,
      title: 'Trip Planner',
      description: 'Save restaurants for your itinerary',
      color: 'text-blue-600'
    },
    {
      icon: Map,
      title: 'Offline City Guides',
      description: 'Download before you travel',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      title: 'Airport Restaurants',
      description: 'GF options at 500+ airports',
      color: 'text-green-600'
    },
    {
      icon: Hotel,
      title: 'Hotel Nearby',
      description: 'Find GF breakfast near hotels',
      color: 'text-orange-600'
    },
    {
      icon: Car,
      title: 'Road Trip Mode',
      description: 'GF stops along your route',
      color: 'text-red-600'
    },
    {
      icon: MessageSquare,
      title: 'Translation Cards',
      description: 'Explain celiac in local language',
      color: 'text-teal-600'
    }
  ];

  const popularDestinations = [
    { city: 'Paris', country: 'France', spots: '287 GF spots', image: '🥐' },
    { city: 'Rome', country: 'Italy', spots: '398 GF spots', image: '🍝' },
    { city: 'Tokyo', country: 'Japan', spots: '432 GF spots', image: '🍜' },
    { city: 'Barcelona', country: 'Spain', spots: '376 GF spots', image: '🥘' }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Essential Travel Companion
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Never worry about finding safe gluten-free food while traveling. Plan ahead, eat confidently, explore fearlessly.
          </p>
        </div>

        {/* Travel features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {travelFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border hover:border-primary/20 h-full text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm mb-4 ${feature.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular travel destinations */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-12 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Popular Travel Destinations
            </h3>
            <p className="text-lg text-muted-foreground">
              Comprehensive guides for the world's most visited cities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border cursor-pointer group">
                <div className="text-center">
                  <div className="text-4xl mb-4">{destination.image}</div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {destination.city}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-2">{destination.country}</p>
                  <p className="text-primary font-medium text-sm">{destination.spots}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Travel testimonial */}
          <div className="bg-background rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <blockquote className="text-lg italic text-foreground mb-4">
              "I traveled to 12 countries last year and never had a single gluten incident. The offline maps and translation cards were lifesavers in rural areas with no internet."
            </blockquote>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium">MK</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Maria K.</p>
                <p className="text-sm text-muted-foreground">Digital Nomad • Celiac</p>
              </div>
            </div>
          </div>

          {/* Travel CTA */}
          <div className="text-center mt-12">
            <h4 className="text-xl font-bold text-foreground mb-4">
              Plan Your Next Trip with Confidence
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <FreeTrialButton size="lg" className="px-8">
                Start Planning →
              </FreeTrialButton>
              <Button variant="outline" size="lg" className="px-8">
                View Travel Guides
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelSection;