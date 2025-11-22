import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PointOfContent from "./PointOfContent";

const AddPOC = () => {

  const { showPopup } = usePopupStore();

  const formCtx = useForm();
  const handleSubmit = async (data: any) => {
    await showPopup({
      title: "Add Point Of Content",
      body: "Are you sure you want to add this point of content?",
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
            toast.success("Point of Content Added Successfully");
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
      className="space-y-2 flex flex-col h-full"
    >
      <PointOfContent />
    </FormContainer>
  );
};

export default AddPOC;
