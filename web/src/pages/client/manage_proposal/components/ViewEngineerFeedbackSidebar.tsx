import { FaStar } from "react-icons/fa";
import { useGetUserRatingAndReviews } from "@/shared/apiServices/commonOpenApiService";

/**
 * ViewEngineerFeedbackSidebar Component
 *
 * Displays a sidebar showing feedback received from engineers.
 * Shows engineer profiles, ratings, and review messages.
 */
const ViewEngineerFeedbackSidebar = () => {
  const {
    data: feedbackData,
    isLoading,
    isError,
  } = useGetUserRatingAndReviews();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load feedback. Please try again later.
      </div>
    );
  }

  const feedbackList = feedbackData || [];
  return (
    <div className="">
      <div className="space-y-6">
        {feedbackList.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No feedback available yet.
          </p>
        ) : (
          feedbackList.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
            >
              {/* Engineer Info */}
              <div className="flex items-start gap-3 mb-3">
                {feedback.reviewerProfilePictureUrl && (
                  <img
                    src={feedback.reviewerProfilePictureUrl}
                    alt={feedback.reviewerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {feedback.reviewerName}
                  </h3>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          (feedback.rating ?? 0) > i
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {feedback.review}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewEngineerFeedbackSidebar;
