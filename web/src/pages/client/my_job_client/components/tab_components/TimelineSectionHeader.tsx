import React from "react";
import TimelineList from "@/shared/components/TimelineList";

interface TimelineSectionHeaderProps {
  items: Array<{ title: string; timestamp: string }>;
}

/**
 * TimelineSectionHeader - Renders the activity timeline header and list
 */
const TimelineSectionHeader: React.FC<TimelineSectionHeaderProps> = ({ items }) => {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Activity Timeline
      </h3>
      <TimelineList items={items} />
    </div>
  );
};

export default TimelineSectionHeader;
