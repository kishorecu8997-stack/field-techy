import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import React from "react";
import { toast } from "react-toastify";
import { WorkExperienceList } from "./components/WorkExperienceList";
import { getUserId } from "@/utils";
import { useEngineerGetById } from "@/shared/apiServices/engineer/engineerService";
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
  const { showPopup } = usePopupStore();
  const { setActiveKey, setImmediateParentKey, setSelectedId } =
    useDrawerStore();

  const handleDeleteExperience = async (id: string) => {
    await showPopup({
      title: "Delete Experience",
      body: "Are you sure you want to delete this experience?",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: async (close) => {
            console.log("No button clicked");
            close(true);
          },
        },
        {
          label: "Yes, delete",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            toast.success("Experience Deleted Successfully");
            console.log("Yes button clicked", id);
            close(true);
            setActiveKey("experiences");
          },
        },
      ],
    });
  };

  const userId = getUserId();
  const { data: engineerData } = useEngineerGetById(userId || "");

  return (
    <div className="">
      <WorkExperienceList
        title="Experiences"
        items={engineerData?.experiences}
        onAddAction={() => {
          setImmediateParentKey("experiences");
          onMenuItemClick(`addExperiences`);
        }}
        onEditAction={(id) => {
          setSelectedId(id);
          setImmediateParentKey("experiences");
          onMenuItemClick("editExperiences");
        }}
        onDeleteAction={(id) => handleDeleteExperience(id)}
      />
    </div>
  );
};

export default Experiences;
