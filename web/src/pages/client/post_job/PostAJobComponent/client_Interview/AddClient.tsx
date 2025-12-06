import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ClientFieldsTypes } from "../../types";
import ClientFields from "./ClientFields";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 *    Add Client Page
 *    - Displays a form to add client details
 *    - Uses react-hook-form for form state management
 *    - Submits form data to the server
 * @returns {JSX.Element} The rendered Add Client page
 * @constructor
 */
const AddClient = () => {
  const FormCtx = useForm<ClientFieldsTypes>();
  const { showPopup } = usePopupStore();
  const {setISOpenSidebar} = useDrawerStore()

  const handleSubmit = async (data: ClientFieldsTypes) => {
    await showPopup({
      title: "Add Client Interviewer",
      body: "Are you sure you want to add this client interviewer?",
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
            toast.success("Client Interviewer Added Successfully");
            close(true);
            setISOpenSidebar(false);
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={FormCtx}
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <ClientFields />
    </FormContainer>
  );
};

export default AddClient;
