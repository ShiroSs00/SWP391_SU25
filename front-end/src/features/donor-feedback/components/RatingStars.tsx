import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showLabel = false,
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const getRatingText = (rating: number): string => {
    if (rating >= 4.5) return 'Rất hài lòng';
    if (rating >= 3.5) return 'Hài lòng';
    if (rating >= 2.5) return 'Bình thường';
    if (rating >= 1.5) return 'Không hài lòng';
    return 'Rất không hài lòng';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            disabled={readonly}
            className={`
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded
              ${!readonly ? 'hover:drop-shadow-md' : ''}
            `}
          >
            <Star
              className={`
                ${sizeClasses[size]}
                ${star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
                }
                transition-colors duration-200
              `}
            />
          </button>
        ))}
      </div>
      
      {showLabel && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {rating.toFixed(1)}
          </span>
          {label && (
            <span className="text-sm text-gray-500">
              ({label})
            </span>
          )}
          <span className="text-sm text-gray-600">
            {getRatingText(rating)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RatingStars;