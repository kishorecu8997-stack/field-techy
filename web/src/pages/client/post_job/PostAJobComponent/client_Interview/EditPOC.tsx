import { pointOfContact } from "@/dummy_data/admin/postAJob";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { pointOfContentTypes } from "../../types";
import PointOfContent from "./PointOfContent";
import { usePopupStore } from "@/shared/store/popupStore";

const EditPOC = () => {
  const { selectedId } = useDrawerStore();
  const { showPopup } = usePopupStore();
  const value = pointOfContact.find((item) => item.id === selectedId);

  const formCtx = useForm<pointOfContentTypes>({
    defaultValues: {
      firstName: value?.firstName,
      lastName: value?.lastName,
      email: value?.email,
      mobile: value?.mobile,
      contactType: value?.contactType,
    },
  });

  const handleSubmit = async (data: any) => {
    await showPopup({
      title: "Update Point of Contact",
      body: "Are you sure you want to update this Point of Contact?",
      actionButtons: [
        {
          label: "cancel",
          value: "cancel",
          variant: "outline",
        },
        {
          label: "yes, update",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            console.log("Submitted data:", data);
            toast.success("Point of Contact Updated Successfully");
            close(true);
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <PointOfContent />
    </FormContainer>
  );
};

export default EditPOC;
