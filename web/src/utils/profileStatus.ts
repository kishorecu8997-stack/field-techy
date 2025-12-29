/** Returns the icon for a given profile field status */
export const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    complete: "✓",
    pending: "⏳",
    incomplete: "❌",
  };
  return icons[status] || "❌";
};

/** Returns the color class for a given profile field status */
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    complete: "text-green-600",
    pending: "text-orange-500",
    incomplete: "text-red-600",
  };
  return colors[status] || "text-red-600";
};

/** ComparisonUI represents the title, description, comparison text, and styling for profile completion comparison */
export type ComparisonUI = {
  title: string;
  description: string;
  comparisonText: string;
  containerClass: string;
};

/** Returns the comparison UI object based on overall profile completion percentage */
export const getComparisonUI = (percentage: number): ComparisonUI => {
  if (percentage < 40) {
    return {
      title: "Profile needs improvement",
      description:
        "Your profile completion is low. Completing key sections will improve visibility.",
      comparisonText: "Better than 25% of engineers",
      containerClass: "bg-red-50 border-red-200 text-red-700",
    };
  }
  if (percentage < 70) {
    return {
      title: "Good progress",
      description:
        "You're on the right track. Completing a few more sections will strengthen your profile.",
      comparisonText: "Better than 50% of engineers",
      containerClass: "bg-orange-50 border-orange-200 text-orange-700",
    };
  }
  return {
    title: "You’re doing great!",
    description:
      "Your profile is strong and stands out among other engineers.",
    comparisonText: "Better than 65% of engineers",
    containerClass: "bg-teal-50 border-teal-200 text-teal-700",
  };
};

/** ProfilePriorityGuideItem represents an item in the profile priority guide */
export const profilePriorityGuide = [
  { label: "High impact", description: "Basic details & identity", color: "text-red-600" },
  { label: "Medium impact", description: "Skills & experience", color: "text-orange-500" },
  { label: "Low impact", description: "Optional information", color: "text-green-600" },
];
