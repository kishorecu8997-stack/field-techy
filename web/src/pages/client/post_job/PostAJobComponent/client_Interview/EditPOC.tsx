

import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PointOfContent from "./PointOfContent";

const EditPOC = () => {
  const formCtx = useForm();

  const handleSubmit = (data: any) => {
    console.log(data);
    toast.success("Point of content updated successfully");
  };

  return (
    <div>
      <FormContainer methods={formCtx} onSubmit={handleSubmit} className="space-y-2">
        <PointOfContent />
        <Button type="submit" className="w-full">Save</Button>
      </FormContainer>
    </div>
  );
};

export default EditPOC;
