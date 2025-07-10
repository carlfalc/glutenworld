import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  ratingCount?: number;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'sm',
  showCount = false,
  ratingCount = 0
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= Math.round(rating);
    
    if (interactive && onRatingChange) {
      return (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className="p-0 h-auto hover:bg-transparent"
          onClick={() => onRatingChange(starValue)}
        >
          <Star 
            className={`${sizeClasses[size]} ${
              isFilled 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground hover:text-yellow-400'
            } transition-colors`}
          />
        </Button>
      );
    }

    return (
      <Star 
        key={index}
        className={`${sizeClasses[size]} ${
          isFilled 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-muted-foreground'
        }`}
      />
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars}
      </div>
      {showCount && (
        <span className="text-sm text-muted-foreground ml-1">
          ({ratingCount})
        </span>
      )}
      {!interactive && rating > 0 && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;