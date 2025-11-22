import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PointOfContent from "./PointOfContent";

const AddPOC = () => {
  const formCtx = useForm();
  const handleSubmit = (data: any) => {
    console.log(data);
    toast.success("Point of content added successfully");
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
