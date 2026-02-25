import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEngineerGetProfileCompletion } from "@/shared/apiServices/engineer/engineerOpenApiService";
import {
  getStatusIcon,
  getStatusColor,
  getComparisonUI,
  profilePriorityGuide,
} from "@/utils/profileStatus";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useHeaderTitle } from "@/shared/components/useHeaderTitle";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * ProfileCompletionCard Component
 * Displays user's profile completion progress with sections, fields, completion percentage, and status icons.
 * Provides navigation buttons to incomplete sections and shows estimated time remaining.
 */
const ProfileCompletionCard = () => {
  const {
    setActiveKey,
    setISOpenSidebar,
    setNavigationSource,
    setImmediateParentKey,
  } = useDrawerStore();

  const { data: profileCompletionData, isLoading } =
    useEngineerGetProfileCompletion();

  if (isLoading) {
    return <LoaderComponent />;
  }

  const overallCompletion = profileCompletionData?.percentage ?? 0;
  const missingSections = profileCompletionData?.missing ?? [];

  const comparisonUI = getComparisonUI(overallCompletion);

  const SectionTitle = ({ section }: { section: string }) => {
    const title = useHeaderTitle(section);
    return <>{title}</>;
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Complete Your Profile</h2>

      {/* Overall Completion */}
      <div className="border rounded-xl p-4 bg-white shadow-sm dark:bg-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold dark:text-gray-300">
            Overall Profile Completion
          </h3>
          <span className="text-sm font-medium dark:text-gray-300">
            {overallCompletion}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallCompletion}%` }}
          />
        </div>
      </div>

      {/* Priority Guide */}
      <div className="rounded-xl border bg-gray-50 p-4 text-sm space-y-2 dark:bg-gray-700">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300">
          Priority Guide
        </h4>
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

      {/* Missing/Incomplete Sections */}
      {missingSections.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold">Sections to Complete</h3>
          {missingSections.map((section) => {
            const completionPercentage = 100 - section.percentage;
            const estimatedTime = Math.ceil(section.percentage / 10);

            return (
              <div
                key={section.section}
                className="border rounded-xl p-4 bg-white shadow-sm dark:bg-gray-700"
              >
                {/* Section Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold dark:text-gray-300">
                    <SectionTitle section={section.section} />
                  </h3>
                  <span className="text-sm font-medium dark:text-gray-300">
                    {completionPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                {/* Missing Percentage Display */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className={getStatusColor("incomplete")}>
                    {getStatusIcon("incomplete")} {section.percentage}%
                    incomplete
                  </span>
                </div>

                {/* Complete Section Button */}
                <div className="flex justify-between items-center mt-4 text-sm">
                  <Button
                    className="mt-2 w-200px bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
                    onClick={() => {
                      let navKey = section.section;

                      // Fix singular → plural only when needed
                      if (navKey.toLowerCase().trim() === "experience") {
                        navKey = "experiences";
                      }

                      setNavigationSource(
                        "profilecompletion",
                        "profileCompletion",
                      );
                      setImmediateParentKey("profileCompletion");
                      setActiveKey(navKey);
                      setISOpenSidebar(true);
                    }}
                  >
                    Complete This Section
                  </Button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="border rounded-xl p-6 bg-green-50 dark:bg-green-900/30 text-center">
          <div className="text-4xl mb-2" aria-hidden="true">
            🎉
          </div>
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
            Profile Complete!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400">
            Your profile is 100% complete. Great job!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionCard;
