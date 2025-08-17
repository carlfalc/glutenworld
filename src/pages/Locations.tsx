import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import LocationHero from '@/components/locations/LocationHero';
import LocationCategories from '@/components/locations/LocationCategories';
import TopCountriesSection from '@/components/locations/TopCountriesSection';
import UniqueFeatures from '@/components/locations/UniqueFeatures';
import LiveDemo from '@/components/locations/LiveDemo';
import TravelSection from '@/components/locations/TravelSection';
import SocialProof from '@/components/locations/SocialProof';
import CityGuides from '@/components/locations/CityGuides';
import RestaurantOwners from '@/components/locations/RestaurantOwners';
import LocationFAQ from '@/components/locations/LocationFAQ';
import FinalLocationCTA from '@/components/locations/FinalLocationCTA';

const Locations = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GlutenWorld Location Finder",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "iOS, Android, Web",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "8439"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "description": "5-day free trial"
    },
    "featureList": "Restaurant finder, Bakery locator, Grocery stores, Dedicated GF kitchens, User reviews, Offline maps"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Find Gluten-Free Restaurants & Bakeries in 190+ Countries | GlutenWorld</title>
        <meta name="description" content="Locate 50,000+ verified gluten-free restaurants, bakeries, cafes & shops worldwide. Real celiac reviews. Dedicated GF kitchens marked. Try free." />
        <meta name="keywords" content="gluten free restaurants, celiac safe dining, gluten free bakery, GF restaurant finder, celiac restaurant app" />
        <link rel="canonical" href="https://glutenworld.app/locations" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <Header />
      
      <main>
        <LocationHero />
        <LocationCategories />
        <TopCountriesSection />
        <UniqueFeatures />
        <LiveDemo />
        <TravelSection />
        <SocialProof />
        <CityGuides />
        <RestaurantOwners />
        <LocationFAQ />
        <FinalLocationCTA />
      </main>
    </div>
  );
};

export default Locations;