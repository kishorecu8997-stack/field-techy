/**
 * @file Experiences.tsx
 * @description This component displays a summary of the user's work experiences.
 * It uses a `WorkExperienceList` to render each entry and provides actions
 * to add, edit, or delete experiences by invoking callbacks.
 */

import React from "react";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { experienceData } from "@/dummyData";
import { WorkExperienceList } from "./components/WorkExperienceList";

/**
 * Props for components rendered within a drawer that require navigation and close actions.
 */
interface DrawerMenuProps {
  /** Callback to navigate to a different view within the drawer (e.g., 'addExperiences'). */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the parent drawer or sidebar. */
  onClose: () => void;
}

/**
 * The Experiences component renders a list of a user's work experiences.
 * It fetches data from a dummy source, processes it, and passes it to the
 * `WorkExperienceList` component for display. It also handles navigation for
 * add, edit, and delete actions.
 * @param {DrawerMenuProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Experiences component.
 */
const Experiences: React.FC<DrawerMenuProps> = ({
  onMenuItemClick,
  onClose,
}) => {
  /**
   * The dummy experience data has string IDs, but the child component expects numbers.
   * This maps the data to ensure the `id` property is a number.
   * This transformation should be removed when data is fetched from a real API.
   */
  const itemsWithNumericId = experienceData.map((exp) => ({
    ...exp,
    id: Number(exp.id),
  }));

  return (
    <div className="">
      {/* Header */}
      <DrawerHeader
        title="Experiences"
        onClose={onClose}
        onBack={() => {
          // Navigate back to the main profile view.
          onMenuItemClick("profile");
        }}
      />

      <WorkExperienceList
        title="Experiences"
        items={itemsWithNumericId}
        onAddAction={() => onMenuItemClick(`addExperiences`)}
        onEditAction={(id) => onMenuItemClick(`editExperiences-${id}`)}
        // TODO: Implement a proper confirmation modal for deletion instead of a browser alert.
        onDeleteAction={(id) => alert(`Delete experience at index ${id}`)}
      />
    </div>
  );
};

export default Experiences;
