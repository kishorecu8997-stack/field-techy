import React from "react";
import EducationList from "./EducationList";
import { getUserId } from "@/utils";
import { useEngineerGetById } from "@/shared/apiServices/engineer/engineerService";
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

  const userId = getUserId();
  const { data: engineerData } = useEngineerGetById(userId || "");

  const handleDeleteEducation = async () => {
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
            toast.success("Education Deleted Successfully");
            close(true);
            setActiveKey("education");
          },
        },
      ],
    });
  };

  return (
    <div className="">
      <EducationList
        title="Education"
        items={(engineerData?.educations || []).map((edu) => ({
          id: edu.id || "temp-id",
          educationLevel: edu.educationLevel ?? null,
          course: edu.course ?? null,
          university: edu.university ?? null,
          majorSubject: edu.majorSubject ?? null,
          passingYear: edu.passingYear ?? null,
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
        onDeleteAction={() => handleDeleteEducation()}
      />
    </div>
  );
};

export default Education;
