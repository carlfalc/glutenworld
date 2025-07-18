import Header from '@/components/Header';
import GlutenFreeStoreLocator from '@/components/GlutenFreeStoreLocator';

const StoreLocator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue/5 via-brand-blue-light/20 to-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-brand-blue">Gluten-Free</span> Store Locator
            </h1>
            <p className="text-muted-foreground text-lg">
              Find gluten-free restaurants, cafes, bakeries, and health food stores near you
            </p>
          </div>
          <div className="store-locator-theme">
            <GlutenFreeStoreLocator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;