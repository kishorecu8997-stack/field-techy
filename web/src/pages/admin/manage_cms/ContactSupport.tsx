import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ContactSupportFormData } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAddAndUpdateContactSupport,
  useGetCmsPages,
} from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * @component ContactSupport
 * @description Form for updating contact support information
 */
export default function ContactSupport() {
  const methods = useForm<ContactSupportFormData>({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
  });

  const { showPopup } = usePopupStore();

  const { refetch } = useGetCmsPages({
    onError: (error: any) => {
      console.error("Error fetching CMS pages:", error);
      toast.error("Failed to load existing content");
    },
  });

  const mutation = useAddAndUpdateContactSupport({
    onSuccess: async (data) => {
      toast.success(data.message || "Contact Support updated successfully!");

      methods.reset();

      await refetch();
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update contact support");

      console.error("Error updating contact support:", error);
    },
  });

  const handleSaveConfirmation = async (data: ContactSupportFormData) => {
    await showPopup({
      title: "Add Contact Support",

      body: "Are you sure you want to save these details?",

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
          action: async (close: any) => {
            try {
              await mutation.mutateAsync({
                body: {
                  email: data.email,
                  phone: data.phoneNumber,
                },
              });

              close(true);
            } catch (error) {
              console.error("Error saving contact support:", error);
            }
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
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
