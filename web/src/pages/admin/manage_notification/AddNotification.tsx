import { absoluteUrls } from "@/config/urls";
import {
  NotificationSendTo,
  NotificationTypes,
} from "@/dummy_data/admin/manageNotification";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import RegionCountrySelectField from "@/shared/components/commonUI/inputs/RegionCountrySelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  validateNotificationMessage,
  validateNotificationTitle,
} from "@/utils/validate";
import { regionsAndCountries } from "@/dummy_data/regionsAndCountries";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateNotification } from "@/shared/apiServices/admin/adminService";

interface AddNotificationProps {
  title: string;
  notificationType: string;
  sendTo: string;
  targetRegionsCountries: string[];
  notificationMessage: string;
}

/**
 * AddNotification Component
 *
 * Form to create a new system notification with fields for title, type, audience,
 * user group, and message (with length/validation). Uses react-hook-form and
 * dummy data for dropdown options. Shows success toast on submit.
 *
 * @component
 * @returns {JSX.Element} Notification creation form with validation.
 */
export default function AddNotification() {
  const navigate = useNavigate();
  const createNotificationMutation = useCreateNotification({
    onSuccess: (data) => {
      toast.success(`Notification ${data.title} added successfully!`);
      navigate(absoluteUrls.admin.home.manage_notification);
    },
    onError: (error) => {
      console.error("Error adding notification:", error);
      toast.error("Failed to add notification. Please try again.");
    },
  });
  const { showPopup } = usePopupStore();

  const methods = useForm<AddNotificationProps>({
    defaultValues: {
      title: "",
      notificationType: "",
      sendTo: "",
      targetRegionsCountries: [],
      notificationMessage: "",
    },
  });

  const handleSaveConfirmation = async (data: AddNotificationProps) => {
    await showPopup({
      title: "Add Notification",
      body: "Are you sure you want to save this details?",
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
            const payload = {
              title: data.title,
              type: data.notificationType,
              sendTo: data.sendTo,
              message: data.notificationMessage,
              users: data.users, // need to changed based on API later
            };
            await createNotificationMutation.mutateAsync(payload);
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = (data: AddNotificationProps) => {
    handleSaveConfirmation(data);
  };
  return (
    <div className="w-full h-full flex flex-col px-4 py-2 gap-3">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Add Notification</p>
        <Button
          type="submit"
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_notification)}
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-2 px-2 pb-4 w-full"
        >
          <div className="grid md:flex gap-4 w-full">
            <div className="md:w-1/2">
              <InputField
                name="title"
                label="Notification Title"
                type="text"
                placeholder="Enter Notification Title"
                required
                rules={{
                  validate: (v: string) => validateNotificationTitle(v),
                }}
              />
            </div>
            <div className="md:w-1/2">
              <SelectField
                label="Notification Type"
                name="notificationType"
                placeholder="Notification Type"
                options={NotificationTypes}
                required
              />
            </div>
          </div>
          <div className="grid md:flex gap-4 w-full">
            <div className="md:w-1/2">
              <SelectField
                label="Send To"
                name="sendTo"
                placeholder="Send To"
                options={NotificationSendTo}
                required
              />
            </div>
            <div className="md:w-1/2">
              <RegionCountrySelectField
                label="Select options"
                name="targetRegionsCountries"
                placeholder="Select options"
                options={regionsAndCountries}
                required
              />
            </div>
          </div>
          <div>
            <TextareaInput
              name="notificationMessage"
              label="Notification Message"
              placeholder="Enter Notification Message"
              rules={{
                validate: (v: string) => validateNotificationMessage(v),
              }}
              required
            />
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
    </div>
  );
}
