import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ClientFieldsTypes } from "../../types";
import ClientFields from "./ClientFields";
import { usePopupStore } from "@/shared/store/popupStore";
import { interviewerData } from "@/dummy_data/admin/post_a_Job";

/**
 *  Edit Client Page
 *    - Displays a form to edit client details
 *    - Uses react-hook-form for form state management
 *    - Submits form data to the server
 * @returns {JSX.Element} The rendered Edit Client page
 * @constructor
 */
const EditClient = () => {
  const { selectedId, setISOpenSidebar } = useDrawerStore();
  const { showPopup } = usePopupStore();
  const value = interviewerData.find((item) => item.id === selectedId);

  const formCtx = useForm<ClientFieldsTypes>({
    defaultValues: {
      firstName: value?.firstName,
      lastName: value?.lastName,
      email: value?.email,
      mobile: value?.mobile,
      startDate: value?.startDate ? new Date(value.startDate) : undefined,
      startTime: value?.startTime,
    },
  });

  const handleSubmit = async (data: ClientFieldsTypes) => {
    await showPopup({
      title: "Update Client Interviewer",
      body: "Are you sure you want to update this client interviewer?",
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
            toast.success("Client Interviewer Updated Successfully");
            close(true);
            setISOpenSidebar(false);
          },
        },
      ],
    });
  };

  return (
    <div className="h-full">
      <FormContainer
        methods={formCtx}
        onSubmit={handleSubmit}
        className=" flex-col h-full"
      >
        <ClientFields />
      </FormContainer>
    </div>
  );
};

export default EditClient;
