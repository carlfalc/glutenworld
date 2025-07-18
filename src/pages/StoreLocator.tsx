import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import GlutenFreeStoreLocator from '@/components/GlutenFreeStoreLocator';
import { TrialRestrictionModal } from '@/components/TrialRestrictionModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTrialRestriction } from '@/hooks/useTrialRestriction';

const StoreLocator = () => {
  const { user } = useAuth();
  const { canUseStoreLocator, hasUsedTrial } = useTrialRestriction();
  const [showTrialRestriction, setShowTrialRestriction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user can access the store locator when page loads
    if (!canUseStoreLocator()) {
      setShowTrialRestriction(true);
    }
  }, [canUseStoreLocator]);

  // If user has used trial and is not authenticated, show restriction modal
  if (!user && hasUsedTrial()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue/5 via-brand-blue-light/20 to-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              <span className="text-brand-blue">Gluten-Free</span> Store Locator
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              You've already used your free trial. Sign up to continue using our premium features!
            </p>
          </div>
        </div>
        <TrialRestrictionModal 
          open={showTrialRestriction} 
          onOpenChange={setShowTrialRestriction} 
          featureName="Global Store Locator" 
        />
      </div>
    );
  }

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
      <TrialRestrictionModal 
        open={showTrialRestriction} 
        onOpenChange={setShowTrialRestriction} 
        featureName="Global Store Locator" 
      />
    </div>
  );
};

export default StoreLocator;