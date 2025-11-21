import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ClientFieldsTypes } from "../../types";
import ClientFields from "./ClientFields";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { interviewerData } from "@/dummy_data/admin/PostAJob";

/**
 *
 */
const EditClient = () => {
  return (
    <div className="h-full">
      <EditClientFields />
    </div>
  );
};

export default EditClient;

const EditClientFields = () => {

  const { selectedId} = useDrawerStore();
  const value = interviewerData.find((item) => item.id === selectedId);

  const formCtx = useForm<ClientFieldsTypes>({
    defaultValues:{
      firstName: value?.firstName,
      lastName: value?.lastName,
      email: value?.email,
      mobile: value?.mobile,
      startDate: new Date(value?.startDate),
      startTime: value?.startTime,
    },
  });



  const handleSubmit = (data: ClientFieldsTypes) => {
    console.log("Submitted data:", data);
    toast.success("Client Added successfully!");
  };

  return (
    <FormContainer
      methods={formCtx}
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
