import React from "react";
import { experienceData } from "@/dummy_data";
import { type WorkExperience, WorkExperienceList } from "./components/WorkExperienceList";
import { toast } from "react-toastify";

/**
 * Props for components rendered within a drawer that require navigation and close actions.
 */
interface DrawerMenuProps {
  /** Callback to navigate to a different view within the drawer (e.g., 'addExperiences'). */
  onMenuItemClick: (key: string) => void;
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
}) => {
  return (
    <div className="">
      <WorkExperienceList
        title="Experiences"
        items={experienceData as WorkExperience[]}
        onAddAction={() => onMenuItemClick(`addExperiences`)}
        onEditAction={(id) => onMenuItemClick(`editExperiences-${id}`)}
        // TODO: Implement a proper confirmation modal for deletion instead of a browser alert.
        onDeleteAction={(id) => toast.info(`Delete experience at index ${id}`)}
      />
    </div>
  );
};

export default Experiences;
