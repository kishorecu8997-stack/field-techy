import { pointOfContent } from "@/dummy_data/admin/PostAJob";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { pointOfContentTypes } from "../../types";
import PointOfContent from "./PointOfContent";

const EditPOC = () => {
  const { selectedId } = useDrawerStore();
  const value = pointOfContent.find((item) => item.id === selectedId);

  const formCtx = useForm<pointOfContentTypes>({
    defaultValues: {
      firstName: value?.firstName,
      lastName: value?.lastName,
      email: value?.email,
      mobile: value?.mobile,
      contactType: value?.contactType,
    },
  });

  const handleSubmit = (data: any) => {
    console.log(data);
    toast.success("Point of content updated successfully");
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
