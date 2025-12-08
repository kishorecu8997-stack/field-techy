import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PointOfContact from "./PointOfContact";

/*
 *    Add Point of Contact Page
 *    - Displays a form to add point of Contact
 *    - Uses react-hook-form for form state management
 *    - Submits form data to the server
 * @returns {JSX.Element} The rendered Add Point of Contact page
 * @constructor
 */
const AddPOC = () => {
  const { showPopup } = usePopupStore();

  const formCtx = useForm();
  const handleSubmit = async (data: any) => {
    await showPopup({
      title: "Add Point of Contact",
      body: "Are you sure you want to add this Point of Contact?",
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
            toast.success("Point of Contact Added Successfully");
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
      <PointOfContact />
    </FormContainer>
  );
};

export default AddPOC;
