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
import { toast } from "react-toastify";
import { useEffect } from "react";
import {
  NotificationSendTo,
  NotificationTypes,
  NotificationUsers,
} from "@/dummy_data/admin/manageNotification";
import { useGetNotificationById, useEditNotification } from "@/shared/apiServices/admin/adminService";
interface EditNotificationForm {
  title: string;
  notificationType: string;
  sendTo: string;
  users?: string;
  notificationMessage: string;
}

/**
 * EditNotification lets admins view and update a notification.
 * It loads the notification by ID API, populates a form,
 * and submits updates via PUT after user confirmation. On success, it
 * navigates back and shows a success toast.
 *
 * @returns {JSX.Element} Form UI for editing a notification.
 */

export default function EditNotification() {
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
  const { data, isLoading, isError } = useGetNotificationById(id!);
  const updateNotification = useEditNotification({
    onSuccess: () => {
      toast.success("Notification updated successfully!");
      navigate(absoluteUrls.admin.home.manage_notification);
    },
    onError: () => {
      toast.error("Failed to update notification");
    },
  });
  useEffect(() => {
    if (!data) return;
    methods.reset({
      title: data.title,
      notificationType: data.type,
      sendTo:
      NotificationSendTo.find((o) => o.value.toLowerCase() === data.sendTo.toLowerCase())?.value || "",
      users: data.users,
      notificationMessage: data.message,
    });
  }, [data, methods]);
const onSubmit = async (formData: EditNotificationForm) => {
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
          updateNotification.mutate({
            id: id!,
            title: formData.title,
            message: formData.notificationMessage,
            type: formData.notificationType,
            sendTo: formData.sendTo,
            users: formData.users,
          });
          close(true);
        },
      },
    ],
  });
};
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-10">
        <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <span className="ml-3 text-sm text-gray-600">
          Loading notification...
        </span>
      </div>
    );
  }
  if (isError) {
    toast.error("Notification not found");
    navigate(absoluteUrls.admin.home.manage_notification);
    return null;
  }
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
