import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Star, Navigation, ExternalLink, Clock } from 'lucide-react';

interface StoreLocatorInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocatorInfoModal = ({ isOpen, onClose }: StoreLocatorInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
            <MapPin className="w-7 h-7" />
            Global Store Locator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Find Gluten-Free Places Worldwide
            </h3>
            <p className="text-muted-foreground mb-4">
              Discover gluten-free restaurants, bakeries, and food stores in 195 countries with our comprehensive global database.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Smart Location Search</h4>
                <p className="text-sm text-muted-foreground">
                  Search by address, city, or landmark to find gluten-free establishments near you or your travel destination.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Navigation className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Directions & Navigation</h4>
                <p className="text-sm text-muted-foreground">
                  Get turn-by-turn directions to any location with integrated mapping and GPS navigation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <ExternalLink className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Restaurant Details</h4>
                <p className="text-sm text-muted-foreground">
                  Access websites, menus, contact information, and opening hours for each establishment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Star className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Verified Reviews & Ratings</h4>
                <p className="text-sm text-muted-foreground">
                  Read authentic reviews from the gluten-free community to make informed dining decisions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Real-Time Information</h4>
                <p className="text-sm text-muted-foreground">
                  Access up-to-date information about hours, availability, and special gluten-free offerings.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              🌍 Coverage Includes
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Restaurants • Bakeries • Grocery Stores • Cafes • Food Trucks • Specialty Shops • Health Food Stores
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🔒 Premium Feature
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Store Locator is available with your subscription. Start your free trial to explore gluten-free places worldwide.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700" 
              onClick={onClose}
            >
              Try Store Locator
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};