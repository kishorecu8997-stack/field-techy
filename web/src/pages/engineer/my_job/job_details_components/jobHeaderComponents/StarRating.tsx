import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";

type StarRatingProps = {
  value: number; // 0-5
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  label?: string;
};

const sizes = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = "md",
  readOnly = false,
  label,
}) => {
  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLButtonElement>
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
              disabled={readOnly}
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
              <svg
                className={`${sizes[size]} ${
                  filled
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0L6.615 15.285c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
