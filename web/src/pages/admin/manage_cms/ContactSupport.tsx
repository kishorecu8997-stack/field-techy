import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ContactSupportFormData } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * @component ContactSupport
 * @description This component renders a form for updating contact support information,
 * including an email address and a phone number. It uses react-hook-form for form handling
 * and displays a success message upon submission.
 *
 * @returns {JSX.Element} The rendered contact support form.
 *
 * @example
 * return <ContactSupport />;
 */
export default function ContactSupport() {
  const methods = useForm<ContactSupportFormData>({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
  });

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: ContactSupportFormData) => {
    console.log("data :", data);
    await showPopup({
      title: "Add Contact Support",
      body: "Are you sure you want to add this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Contact Support added successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = (data: ContactSupportFormData) => {
    console.log("Contact Support Form Submitted", data);
    handleSaveConfirmation(data);
  };
  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <InputField
              name="email"
              label="Email Address"
              type="text"
              required
              rules={validateEmailRules}
            />
          </div>

          <div className="flex-1">
            <PhoneInputField
              name="phoneNumber"
              label="Mobile Number"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
