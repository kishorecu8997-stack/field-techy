import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
import type { ContactSupportFormData } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAddAndUpdateContactSupport,
  useGetCmsContent,
} from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * Form for viewing and updating contact support information
 */

export default function ContactSupport() {
  const methods = useForm<ContactSupportFormData>({
    defaultValues: {
      email: "",
      phoneNumber: "",
      address: "",
      copyright: "",
    },
  });

  const { reset } = methods;
  const { showPopup } = usePopupStore();

  const {
    data: contactResponse,
    isLoading,
    isError,
    refetch,
  } = useGetCmsContent("contact-info");

  useEffect(() => {
    if (
      contactResponse?.type === "contact-info" &&
      contactResponse.data &&
      typeof contactResponse.data === "object" &&
      !Array.isArray(contactResponse.data)
    ) {
      reset({
        email:
          (
            contactResponse.data as {
              email?: string;
              phone?: string;
              address?: string;
              copyright?: string;
            }
          ).email || "",
        phoneNumber:
          (
            contactResponse.data as {
              email?: string;
              phone?: string;
              address?: string;
              copyright?: string;
            }
          ).phone || "",
        address:
          (
            contactResponse.data as {
              email?: string;
              phone?: string;
              address?: string;
              copyright?: string;
            }
          ).address || "",
        copyright:
          (
            contactResponse.data as {
              email?: string;
              phone?: string;
              address?: string;
              copyright?: string;
            }
          ).copyright || "",
      });
    }
  }, [contactResponse, reset]);

  const mutation = useAddAndUpdateContactSupport({
    onSuccess: async (response) => {
      toast.success(
        response.message || "Contact support updated successfully!",
      );
      await refetch();
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to update contact support";
      toast.error(msg);
    },
  });

  const handleSaveConfirmation = async (formData: ContactSupportFormData) => {
    await showPopup({
      title: "Update Contact Support",
      body: "Are you sure you want to save these changes?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            try {
              await mutation.mutateAsync({
                body: {
                  email: formData.email,
                  phone: formData.phoneNumber,
                  address: formData.address,
                  copyright: formData.copyright,
                },
              });
              close(true);
            } catch {
              toast.error("Could not save. Please try again.");
            }
          },
        },
      ],
    });
  };

  const onSubmit = (data: ContactSupportFormData) => {
    handleSaveConfirmation(data);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <LoaderComponent />
        </div>
      </div>
    );
  }

  if (isError || contactResponse?.type !== "contact-info") {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-red-600 min-h-[300px] flex items-center justify-center">
        Failed to load contact support information
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <FormContainer
        methods={methods}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 mt-2 px-2 pb-4 w-full"
      >
        {/* form fields remain the same */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <InputField
              name="email"
              label="Email Address"
              type="email"
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

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <InputField name="address" label="Address" type="text" />
          </div>
          <div className="flex-1">
            <InputField name="copyright" label="Copyright Text" type="text" />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r from-teal-900 to-teal-700 text-white py-2 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
