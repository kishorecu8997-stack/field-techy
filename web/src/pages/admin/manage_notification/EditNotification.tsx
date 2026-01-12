import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  validateNotificationMessage,
  validateNotificationTitle,
} from "@/utils/validate";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  NotificationSendTo,
  NotificationTypes,
  NotificationUsers,
} from "@/dummy_data/admin/manageNotification";

interface EditNotificationForm {
  title: string;
  notificationType: string;
  sendTo: string;
  users?: string;
  notificationMessage: string;
}

export default function EditNotificationUIOnly() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { id } = useParams<{ id: string }>();

  const methods = useForm<EditNotificationForm>({
    defaultValues: {
      title: "",
      notificationType: "",
      sendTo: "",
      users: "",
      notificationMessage: "",
    },
  });

  const onSubmit = async (formData: EditNotificationForm) => {
    // Only UI
    await showPopup({
      title: "Update Notification",
      body: "Are you sure you want to save the changes?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Update",
          value: "update",
          variant: "primary",
          action: (close) => {
            console.log("Form submitted:", { id, ...formData });
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-2 gap-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Edit Notification</p>
        <Button
          onClick={() => navigate(absoluteUrls.admin.home.manage_notification)}
        >
          Back
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <FormContainer
          methods={methods}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 mt-2 px-2 pb-4 w-full"
        >
          {/* Row 1: Title + Notification Type */}
          <div className="grid md:grid-cols-2 gap-4 w-full">
            <InputField
              name="title"
              label="Notification Title"
              placeholder="Enter Notification Title"
              rules={{ validate: validateNotificationTitle }}
              required
            />
            <SelectField
              name="notificationType"
              label="Notification Type"
              options={NotificationTypes}
              required
            />
          </div>

          {/* Row 2: Send To + Users */}
          <div className="grid md:grid-cols-2 gap-4 w-full">
            <SelectField
              name="sendTo"
              label="Send To"
              options={NotificationSendTo}
              required
            />
            <SelectField
              name="users"
              label="Select Users"
              options={NotificationUsers}
            />
          </div>

          {/* Message */}
          <TextareaInput
            name="notificationMessage"
            label="Notification Message"
            placeholder="Enter Notification Message"
            rules={{ validate: validateNotificationMessage }}
            required
          />

          {/* Submit */}
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Update
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
