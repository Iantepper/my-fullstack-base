import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function RatingStars({ 
  rating, 
  onRatingChange, 
  readOnly = false, 
  size = 'medium' 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readOnly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 28;
      case 'large': return 36;
      default: return 28;
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <Box display="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readOnly}
          sx={{ 
            p: size === 'small' ? 0.5 : 1,
            color: star <= displayRating ? 'gold' : 'text.disabled'
          }}
        >
          {star <= displayRating ? (
            <Star sx={{ fontSize: getStarSize() }} />
          ) : (
            <StarBorder sx={{ fontSize: getStarSize() }} />
          )}
        </IconButton>
      ))}
    </Box>
  );
}