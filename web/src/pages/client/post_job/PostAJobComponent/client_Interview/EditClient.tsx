import { interviewerData } from "@/dummy_data/admin/PostAJob";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ClientFieldsTypes } from "../../types";
import ClientFields from "./ClientFields";

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
  const { selectedId } = useDrawerStore();
  const value = interviewerData.find((item) => item.id === selectedId);

  const formCtx = useForm<ClientFieldsTypes>({
    defaultValues: {
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
      className="flex flex-col h-full"
    >
      <ClientFields />
    </FormContainer>
  );
};
