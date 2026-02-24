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
    onError: () => {
      toast.error("Failed to load existing contact support content");
    },
  });

  const mutation = useAddAndUpdateContactSupport({
    onSuccess: async (data) => {
      toast.success(data.message || "Contact support updated successfully!");
      methods.reset();
      await refetch();
    },

    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update contact support";

      toast.error(errorMessage);
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
          action: async (close) => {
            try {
              await mutation.mutateAsync({
                body: {
                  email: data.email,
                  phone: data.phoneNumber,
                },
              });
              close(true);
            } catch {}
          },
        },
      ],
    });
  };

  const handleSubmit = (data: ContactSupportFormData) => {
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
