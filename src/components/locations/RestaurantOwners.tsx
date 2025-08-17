import { Store, Users, Badge, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const RestaurantOwners = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Restaurant Owners: Get Listed Free
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reach 500,000+ celiac customers actively searching for safe dining options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Benefits */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Why List Your Restaurant?
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Reach 500K+ Celiac Customers</h4>
                  <p className="text-muted-foreground">Connect with a highly engaged audience actively seeking safe dining options in your area.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Free Basic Listing</h4>
                  <p className="text-muted-foreground">Get started with a completely free listing including location, hours, and basic menu information.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Badge className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Verified Badge Program</h4>
                  <p className="text-muted-foreground">Earn trust with our celiac community through our restaurant verification program.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Direct Booking Links</h4>
                  <p className="text-muted-foreground">Include reservation links to drive direct bookings and reduce commission fees.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-background rounded-2xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Get Listed Today
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Restaurant Name *
                </label>
                <Input placeholder="Enter your restaurant name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <Input placeholder="City, State/Country" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gluten-Free Options Available *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Dedicated gluten-free menu</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">100% gluten-free kitchen</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Gluten-free preparation protocols</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Information
                </label>
                <Textarea 
                  placeholder="Tell us about your gluten-free offerings, kitchen procedures, staff training, etc."
                  rows={4}
                />
              </div>

              <Button className="w-full" size="lg">
                Submit for Review
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              We'll review your submission within 2-3 business days and contact you with next steps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantOwners;