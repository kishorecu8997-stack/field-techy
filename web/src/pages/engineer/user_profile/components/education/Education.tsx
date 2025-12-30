import React from "react";
import DrawerCard from "@/shared/components/DrawerCard";
import { toast } from "react-toastify";
import { educationList } from "@/dummy_data/engineer_profile/education-data";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

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
  const { showPopup } = usePopupStore();
  const { setActiveKey, setImmediateParentKey } = useDrawerStore();

  const handleDeleteEducation = async (id: number) => {
    await showPopup({
      title: "Delete Education",
      body: "Are you sure you want to delete this education?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            close(true);
          },
        },
        {
          label: "Yes, delete",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Education Deleted Successfully");
            close(true);
            console.log("Yes button clicked", id);
            setActiveKey("education");
          },
        },
      ],
    });
  };

  return (
    <>
      <DrawerCard
        title="Education"
        items={educationList}
        onAddAction={() => { 
          setImmediateParentKey("education");
          onMenuItemClick(`addEducation`)}
        }
        onEditAction={(id) => {
          localStorage.setItem("editEducationId", id.toString());
          setImmediateParentKey("education");
          onMenuItemClick("editEducation");
        }}
        // TODO: Implement a proper confirmation modal for deletion.
        onDeleteAction={(id) => handleDeleteEducation(id)}
      />
    </>
  );
};

export default Education;
