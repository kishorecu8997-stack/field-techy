import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ClientFieldsTypes } from "../../types";
import ClientFields from "./ClientFields";

/**
 *
 */
const AddClient = () => {
  return (
    <div className="h-full">
      <AddClientFields />
    </div>
  );
};

export default AddClient;

const AddClientFields = () => {
  const FormCtx = useForm<ClientFieldsTypes>();

  const handleSubmit = (data: ClientFieldsTypes) => {
    console.log("Submitted data:", data);
    toast.success("Client Added successfully!");
  };

  return (
    <FormContainer
      methods={FormCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <ClientFields />
      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded w-full"
        >
          Add Client
        </Button>
      </div>
    </FormContainer>
  );
};
