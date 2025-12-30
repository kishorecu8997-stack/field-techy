import useDrawerStore from "@/shared/store/useDrawerStore";
import { getProfileCompletion } from "@/utils/profileCompletion";
import {
  getStatusIcon,
  getStatusColor,
  getComparisonUI,
  profilePriorityGuide,
} from "@/utils/profileStatus";

/**
 * ProfileCompletionCard Component
 * Displays user's profile completion progress with sections, fields, completion percentage, and status icons.
 * Provides navigation buttons to incomplete sections and shows estimated time remaining.
 */
const ProfileCompletionCard = () => {
  const {
    profileData,
    setActiveKey,
    setISOpenSidebar,
    setNavigationSource,
    setImmediateParentKey,
  } = useDrawerStore();

  const overallCompletion = getProfileCompletion(profileData);
  const comparisonUI = getComparisonUI(overallCompletion);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Complete Your Profile</h2>

      {/* Priority Guide */}
      <div className="rounded-xl border bg-gray-50 p-4 text-sm space-y-2">
        <h4 className="font-semibold text-gray-700">Priority Guide</h4>
        <ul className="space-y-1">
          {profilePriorityGuide.map((item) => (
            <li key={item.label}>
              <span className={`font-medium ${item.color}`}>{item.label}:</span>{" "}
              {item.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Comparison Info */}
      <div
        className={`rounded-xl border p-4 text-sm ${comparisonUI.containerClass}`}
      >
        <p className="font-semibold">{comparisonUI.title}</p>
        <p className="mt-1">{comparisonUI.description}</p>
        <p className="mt-1 font-medium">{comparisonUI.comparisonText}</p>
      </div>

      {/* Profile Sections */}
      {profileData.map((section) => {
        const total = section.fields.length;
        const completed = section.fields.filter((f) => f.status === "complete")
          .length;
        const percentage = Math.round((completed / total) * 100);
        const remaining = total - completed;
        const estimatedTime = remaining * section.estimatedMinutesPerField;

        return (
          <div
            key={section.key}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Section Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{section.title}</h3>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>

            {/* Progress Bar Showing Status With Percentage */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-teal-600 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Fields Those are under the specific section with their status*/}
            <ul className="space-y-1 text-sm">
              {section.fields.map((field, i) => (
                <li
                  key={`${section.key}-${field.label}-${i}`}
                  className={getStatusColor(field.status)}
                >
                  {getStatusIcon(field.status)} {field.label}
                  {field.status === "pending" && " (Awaiting Approval)"}
                </li>
              ))}
            </ul>

            {/* Complete Section Button */}
            {percentage < 100 && (
              <div className="flex justify-between items-center mt-4 text-sm">
                <button
                  onClick={() => {
                    setNavigationSource("profilecompletion", "profileCompletion");
                    setImmediateParentKey("profileCompletion");
                    setActiveKey(section.navigateTo);
                    setISOpenSidebar(true);
                  }}
                  className="text-teal-700 font-medium hover:underline"
                >
                  Complete This Section
                </button>
                <span className="text-gray-500">{estimatedTime} minutes remaining</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileCompletionCard;
