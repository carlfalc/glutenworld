import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CityGuides = () => {
  const [openCities, setOpenCities] = useState<string[]>(['nyc']);

  const cities = [
    {
      id: 'nyc',
      name: 'New York City',
      emoji: '🗽',
      locations: '1,234',
      dedicatedGF: '47',
      topAreas: ['Manhattan', 'Brooklyn'],
      mustTry: ['Senza Gluten', "Friedman's"],
      description: 'The gluten-free capital of America with incredible diversity and dedicated celiac-friendly establishments.',
      highlights: [
        'Largest concentration of 100% GF restaurants in the US',
        'Excellent hospital network for emergencies',
        'Multiple dedicated GF bakeries and pizzerias',
        'Strong celiac community and support groups'
      ]
    },
    {
      id: 'la',
      name: 'Los Angeles',
      emoji: '☀️',
      locations: '987',
      dedicatedGF: '38',
      topAreas: ['Venice', 'Santa Monica'],
      mustTry: ["Erin McKenna's", 'Shojin'],
      description: 'Health-conscious city with amazing gluten-free options and celebrity chef GF creations.',
      highlights: [
        'Health-focused restaurants with GF awareness',
        'Great weather for outdoor dining',
        'Celebrity chef GF menu innovations',
        'Strong vegan-GF crossover options'
      ]
    },
    {
      id: 'london',
      name: 'London',
      emoji: '🇬🇧',
      locations: '876',
      dedicatedGF: '29',
      topAreas: ['Shoreditch', 'Camden'],
      mustTry: ['Beyond Bread', 'Wheats'],
      description: 'Historic city embracing gluten-free dining with traditional and modern options.',
      highlights: [
        'Strong NHS support for celiac patients',
        'Traditional pubs with GF fish & chips',
        'Excellent gluten-free afternoon tea options',
        'Growing number of certified GF establishments'
      ]
    },
    {
      id: 'paris',
      name: 'Paris',
      emoji: '🥐',
      locations: '654',
      dedicatedGF: '23',
      topAreas: ['Marais', 'Montmartre'],
      mustTry: ['Chambelland', 'Helmut Newcake'],
      description: 'The city of love now loves celiacs too, with incredible GF bakeries and bistros.',
      highlights: [
        'World-class gluten-free patisseries',
        'Growing awareness in traditional bistros',
        'Beautiful GF croissants and macarons',
        'Excellent wine knowledge helps with pairings'
      ]
    }
  ];

  const toggleCity = (cityId: string) => {
    setOpenCities(prev => 
      prev.includes(cityId) 
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Gluten-Free Cities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides to help you eat safely and confidently in the world's top destinations
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {cities.map((city) => (
            <Collapsible 
              key={city.id} 
              open={openCities.includes(city.id)}
              onOpenChange={() => toggleCity(city.id)}
            >
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <CollapsibleTrigger className="w-full p-6 text-left hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{city.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {city.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {city.locations} GF locations
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-green-600" />
                            {city.dedicatedGF} dedicated GF kitchens
                          </span>
                        </div>
                      </div>
                    </div>
                    {openCities.includes(city.id) ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="pt-6">
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {city.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Top Areas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {city.topAreas.map((area, index) => (
                              <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Must-Try Places
                          </h4>
                          <div className="space-y-1">
                            {city.mustTry.map((place, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                • {place}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">
                          Why Celiacs Love {city.name}
                        </h4>
                        <ul className="space-y-2">
                          {city.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1">
                          Explore {city.name} →
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Travel Guide
                        </Button>
                        <Button variant="ghost" className="flex-1">
                          Download Offline Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>

        {/* Additional cities CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Don't See Your City?
            </h3>
            <p className="text-muted-foreground mb-6">
              We cover 190 countries and add new detailed city guides every month. Request your city or explore our global database.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-6">Request City Guide</Button>
              <Button variant="outline" className="px-6">Browse All Locations</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityGuides;