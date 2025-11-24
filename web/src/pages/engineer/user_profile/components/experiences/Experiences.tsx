import React from "react";
import { WorkExperienceList } from "./components/WorkExperienceList";
import { toast } from "react-toastify";
import { workExperienceList } from "@/dummy_data/engineer_profile/work-experience";

interface DrawerMenuProps {
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
const Experiences: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  return (
    <div className="">
      <WorkExperienceList
        title="Experiences"
        items={workExperienceList}
        onAddAction={() => onMenuItemClick(`addExperiences`)}
        onEditAction={(id) => {
          localStorage.setItem("editExperiencesId", id.toString());
          onMenuItemClick("editExperiences");
        }}
        // TODO: Implement a proper confirmation modal for deletion instead of a browser alert.
        onDeleteAction={(id) => toast.info(`Delete experience at index ${id}`)}
      />
    </div>
  );
};

export default Experiences;
