"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  userRating?: number;
  totalRatings: number;
  onRate: (stars: number) => void;
  disabled?: boolean;
}

export function RatingStars({
  rating,
  userRating,
  totalRatings,
  onRate,
  disabled,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !disabled && onRate(star)}
            disabled={disabled}
            className={`transition-all ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:scale-110 cursor-pointer"
            }`}
            title={disabled ? "Sign in to rate" : `Rate ${star} stars`}
          >
            <Star
              size={20}
              className={
                star <= (userRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-beige-dark/50"
              }
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-beige-dark">
        {rating > 0 ? rating.toFixed(1) : "No ratings"} ({totalRatings})
      </span>
    </div>
  );
}

