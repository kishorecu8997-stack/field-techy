// utils/validation.ts
export const MIN_REVIEW_LENGTH = 10;

export const validateReview = (rating: number, review: string) => {
  if (rating <= 0) return "Rating is required";
  if (!review || review.trim().length < MIN_REVIEW_LENGTH)
    return `Review must be at least ${MIN_REVIEW_LENGTH} characters`;
  return null; // no error
};
