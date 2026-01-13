import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  label?: string;
};

const sizes = {
  sm: "h-4 w-4 sm:h-5 sm:w-5",
  md: "h-5 w-5 sm:h-6 sm:w-6",
  lg: "h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10",
};

/**
 * StarRating
 *
 * Accessible star-based rating component.
 * Supports mouse and keyboard interaction and optional read-only mode.
 */
export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = "md",
  readOnly = false,
  label,
}) => {
  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (readOnly) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(idx + 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onChange(Math.min(5, value + 1));
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(Math.max(0, value - 1));
    }
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={label || "Star rating"}
      >
        {[0, 1, 2, 3, 4].map((idx) => {
          const filled = idx < value;
          return (
            <Button
              key={idx}
              variant="no_style"
              size={size}
              aria-disabled={readOnly}
              onClick={() => !readOnly && onChange(idx + 1)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`transition-transform ${
                readOnly ? "cursor-default" : "hover:scale-110"
              } p-0`}
              role="radio"
              aria-checked={filled}
              aria-label={`Rate ${idx + 1} star${idx + 1 !== 1 ? "s" : ""}`}
              tabIndex={readOnly ? -1 : 0}
            >
              <Star
                className={`${sizes[size]} ${
                  filled
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                fill={filled ? "currentColor" : "none"}
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
