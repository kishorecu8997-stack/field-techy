/**
 * @file Education.tsx
 * @description This component displays a summary of the user's educational qualifications.
 * It uses a `DrawerCard` to list each education entry and provides actions to add,
 * edit, or delete entries by invoking callbacks.
 */
import React from "react";
import educationData from "@/dummy_data/education.json";
import DrawerCard from "@/shared/components/DrawerCard";
import { toast } from "react-toastify";

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
        items={educationData.education}
        onAddAction={() => onMenuItemClick(`addEducation`)}
        onEditAction={(id) => onMenuItemClick(`editEducation-${id}`)}
        // TODO: Implement a proper confirmation modal for deletion.
        onDeleteAction={(id) => toast.info(`Delete education at index ${id}`)}
      />
    </>
  );
};

export default Education;
