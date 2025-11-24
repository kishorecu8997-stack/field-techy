import React, { useState } from 'react';

interface FeedbackFormProps {
  onSubmit?: (rating: number, feedback: string) => void;
  initialRating?: number;
  className?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  initialRating = 0,
  className = '',
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [feedback, setFeedback] = useState<string>('');

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(rating, feedback);
    }
    // Optionally reset form after submission
    // setRating(0);
    // setFeedback('');
  };

  return (
    <div className={`bg-gray-100 p-6 rounded-lg ${className}`}>
      {/* Star Rating */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className={`text-2xl transition-colors duration-200 ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="feedback" className="block font-bold text-gray-800 mb-2">
          Add Feedback<span className="text-red-500">*</span>
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add your feedback here..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 text-gray-600"
          required
        />
        
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Submit Rating
        </button>
       
      </form>
    </div>
  );
};

export default FeedbackForm;