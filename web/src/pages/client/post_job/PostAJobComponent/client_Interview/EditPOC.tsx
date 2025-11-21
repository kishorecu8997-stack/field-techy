import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PointOfContent from "./PointOfContent";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { pointOfContent } from "@/dummy_data/admin/PostAJob";
import type { pointOfContentTypes } from "../../types";

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
    <div>
      <FormContainer
        methods={formCtx}
        onSubmit={handleSubmit}
        className="space-y-2"
      >
        <PointOfContent />
        <Button type="submit" className="w-full">
          Save
        </Button>
      </FormContainer>
    </div>
  );
};

export default EditPOC;
