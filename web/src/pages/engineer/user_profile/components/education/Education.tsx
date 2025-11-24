import React from "react";
import DrawerCard from "@/shared/components/DrawerCard";
import { toast } from "react-toastify";
import { educationList } from "@/dummy_data/engineer_profile/education-data";

/**
 * Props for the Education component, typically used for components
 * rendered within a drawer that require navigation and close actions.
 */
interface DrawerMenuProps {
  /** Callback to navigate to a different view within the drawer (e.g., 'addEducation'). */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the parent drawer or sidebar. */
  onClose: () => void;
}

/**
 * The Education component renders a list of a user's educational qualifications.
 * It provides UI for viewing the list and triggers callback functions to handle
 * adding, editing, and deleting entries.
 * @param {DrawerMenuProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Education component.
 */
const Education: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  return (
    <>
      <DrawerCard
        title="Education"
        items={educationList}
        onAddAction={() => onMenuItemClick(`addEducation`)}
        onEditAction={(id) => {
          localStorage.setItem("editEducationId", id.toString());
          onMenuItemClick("editEducation");
        }}
        // TODO: Implement a proper confirmation modal for deletion.
        onDeleteAction={(id) => toast.info(`Delete education at index ${id}`)}
      />
    </>
  );
};

export default Education;
