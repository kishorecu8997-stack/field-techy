import React from "react";
import EducationList from "./EducationList";
import {
  useEngineerGetEducation,
  useEngineerDeleteEducation,
  useLookupData,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";

interface DrawerMenuProps {
  onMenuItemClick: (key: string) => void;
}

const Education: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  const { showPopup } = usePopupStore();
  const { setActiveKey, setImmediateParentKey, setSelectedId } =
    useDrawerStore();

  const { data: educations, isLoading: isEduLoading } =
    useEngineerGetEducation();
  const { data: levels, isLoading: isLevelsLoading } =
    useLookupData("educationLevels");
  const deleteMutation = useEngineerDeleteEducation();

  console.log("Education Component Render:", {
    isEduLoading,
    isLevelsLoading,
    educationsCount: educations?.length,
    levelsCount: levels?.length,
  });

  const handleDeleteEducation = async (id: string) => {
    await showPopup({
      title: "Delete Education",
      body: "Are you sure you want to delete this education?",
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "danger",
          action: (close) => close(true),
        },
        {
          label: "Yes, delete",
          value: "delete",
          variant: "primary",
          action: async (close) => {
            try {
              await deleteMutation.mutateAsync({ path: { id: String(id) } });
              toast.success("Education Deleted Successfully");
              close(true);
              setActiveKey("education");
            } catch (error) {
              toast.error("Failed to delete education");
              close(true);
            }
          },
        },
      ],
    });
  };

  const getLevelLabel = (levelId: number) => {
    const level = levels?.find((l) => l.id === levelId);
    return level ? level.name : `Level ${levelId}`;
  };

  if (isEduLoading || isLevelsLoading) return <div>Loading...</div>;

  return (
    <div className="">
      <EducationList
        title="Education"
        items={(educations || []).map((edu) => ({
          id: String(edu.id),
          educationLevel: getLevelLabel(edu.level),
          course: edu.course,
          university: edu.university,
          majorSubject: edu.majorSubject,
          passingYear: edu.passingYear,
        }))}
        onAddAction={() => {
          setImmediateParentKey("education");
          onMenuItemClick("addEducation");
        }}
        onEditAction={(id) => {
          setSelectedId(id);
          setImmediateParentKey("education");
          onMenuItemClick("editEducation");
        }}
        onDeleteAction={(id) => handleDeleteEducation(id)}
      />
    </div>
  );
};

export default Education;
