
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import StarRating from '@/components/StarRating';
import { Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Food Blogger & Celiac Patient',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: "Gluten World has completely transformed my cooking! The AI recipe conversion is incredibly accurate, and I've discovered so many new gluten-free favorites. The store locator saved me hours when traveling.",
    verified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Chef & Restaurant Owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: "As a professional chef, I was skeptical about AI recipe conversion. But Gluten World's accuracy is outstanding! I now use it to create gluten-free versions of my signature dishes for customers.",
    verified: true
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    role: 'Busy Mom of 3',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: "The ingredient scanner is a game-changer! No more spending 20 minutes reading every label at the grocery store. My kids love the converted recipes too - they can't tell the difference!",
    verified: true
  },
  {
    id: '4',
    name: 'David Park',
    role: 'Fitness Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: "Perfect for my gluten-free lifestyle! The recipe library has amazing variety, and the global store locator helped me find great spots during my travels. Worth every penny!",
    verified: true
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Nutritionist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: "I recommend Gluten World to all my celiac clients. The nutritional accuracy is impressive, and the community features help them connect with others on similar journeys.",
    verified: true
  },
  {
    id: '6',
    name: 'James Wilson',
    role: 'Food Photographer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: "The converted recipes look and taste incredible! I've photographed dozens of gluten-free dishes created with Gluten World - they're indistinguishable from the originals.",
    verified: true
  }
];

const ReviewsSection = () => {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-gluten-primary/5 via-background to-gluten-secondary/5">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-foreground mb-4">
          Loved by Thousands of Gluten-Free Enthusiasts
        </h3>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join our community of happy users who've transformed their gluten-free cooking experience
        </p>
        
        {/* Overall Rating Display */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="lg" />
            <span className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {reviews.map((review) => (
          <Card key={review.id} className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-gluten-primary mb-4 opacity-20 absolute top-4 right-4" />
              
              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={review.rating} size="sm" />
              </div>
              
              {/* Review Text */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{review.review}"
              </p>
              
              {/* Reviewer Info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback className="bg-gluten-primary text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    {review.verified && (
                      <div className="inline-flex items-center gap-1 bg-gluten-primary/10 text-gluten-primary px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span>Verified Reviews Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🛡️</span>
            </div>
            <span>100% Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⭐</span>
            </div>
            <span>5.0/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
