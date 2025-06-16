import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalReviews,
  size = 'md',
  showNumber = true,
  className = ''
}) => {
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${getStarSize()} text-yellow-400 fill-current`}
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${getStarSize()} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${getStarSize()} text-yellow-400 fill-current`} />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${getStarSize()} text-gray-300`}
        />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showNumber && (
        <div className={`flex items-center space-x-1 ${getTextSize()}`}>
          <span className="font-semibold text-gray-900">
            {rating.toFixed(1)}
          </span>
          {totalReviews && (
            <span className="text-gray-500">
              ({totalReviews})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;