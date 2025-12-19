import useDrawerStore from "@/shared/store/useDrawerStore";
/**
 * ProfileCompletionCard Component
 * Renders a card showing the user's profile completion progress.
 * Displays sections with their fields, completion percentage, and status icons.
 * Provides a button to navigate to incomplete sections and shows estimated time remaining.
 * Utilizes `useDrawerStore` for state management and navigation control.
 */
const getStatusIcon = (status: string) => {
  if (status === "complete") return "✓";
  if (status === "pending") return "⏳";
  return "❌";
};

const getStatusColor = (status: string) => {
  if (status === "complete") return "text-green-600";
  if (status === "pending") return "text-orange-500";
  return "text-red-600";
};

const ProfileCompletionCard = () => {
  const {
    profileData,
    setActiveKey,
    setISOpenSidebar,
    setNavigationSource,
  } = useDrawerStore();

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Complete Your Profile</h2>
      {/* Five Sections mentioned in user story */}
      {profileData.map((section) => { 
        const total = section.fields.length;
        const completed = section.fields.filter(
          (f) => f.status === "complete"
        ).length;

        const percentage = Math.round((completed / total) * 100);
        const remaining = total - completed;
        const estimatedTime = remaining * section.estimatedMinutesPerField;

        return (
          <div
            key={section.key}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Header for the section */}
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
                  key={i}
                  className={getStatusColor(field.status)}
                >
                  {getStatusIcon(field.status)} {field.label}
                  {field.status === "pending" && " (Awaiting Approval)"}
                </li>
              ))}
            </ul>

            {/* Complete this Section for easily access the form */}
            {percentage < 100 && (
              <div className="flex justify-between items-center mt-4 text-sm">
                <button
                  onClick={() => {
                    // Navigation for specific form according to the section
                    setNavigationSource("profilecompletion","profileCompletion");
                    setActiveKey(section.navigateTo);
                    setISOpenSidebar(true);
                  }}
                  className="text-teal-700 font-medium hover:underline"
                >
                  Complete This Section
                </button>

                <span className="text-gray-500">
                  {estimatedTime} minutes remaining
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileCompletionCard;
