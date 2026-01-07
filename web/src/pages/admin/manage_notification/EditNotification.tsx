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
import { useEffect, useState } from "react";
import {
  notifications,
  type NotificationProps,
  NotificationSendTo,
  NotificationTypes,
  NotificationUsers,
} from "@/dummy_data/admin/manageNotification";
import { useRef } from "react";

/**
 * EditNotification lets admins view and update a notification.
 * It loads the notification by ID API, populates a form,
 * and submits updates via PUT after user confirmation. On success, it
 * navigates back and shows a success toast.
 *
 * @returns {JSX.Element} Form UI for editing a notification.
 */
interface EditNotificationProps {
  title: string;
  notificationType: string;
  sendTo: string;
  users?: string;
  notificationMessage: string;
}
export default function EditNotification() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const errorToastShown = useRef(false);
  const methods = useForm<EditNotificationProps>({
    defaultValues: {
      title: "",
      notificationType: "",
      sendTo: "",
      users: "",
      notificationMessage: "",
    },
  });
  useEffect(() => {
    const fetchNotification = async () => {
      if (!id) return;
      let notification: NotificationProps | null =
        notifications.find((n) => n.id === id || n.id === Number(id)) ?? null;
      try {
        const res = await fetch(`/api/notifications/${id}`);
        if (res.ok) {
          const data = await res.json();
          notification = data;
        }
      } catch (err) {
        console.warn("Failed to fetch from API, falling back to dummy data.", err);
        const FETCH_ERROR_MSG = "Failed to fetch notification from server. Showing local data if available.";
        if (!errorToastShown.current) {
          toast.error(FETCH_ERROR_MSG);
          errorToastShown.current = true;
        }
      }
      if (notification) {
        const sendToValue = NotificationSendTo.find((o) => o.label === notification.sendTo)?.value ?? "";
        methods.reset({
          title: notification.title,
          notificationType: notification.type,
          sendTo: sendToValue,
          notificationMessage: notification.message,
        });
      } else {
        toast.error("Notification not found");
        navigate(absoluteUrls.admin.home.manage_notification);
      }
      setLoading(false);
    };
    fetchNotification();
  }, [id, navigate]);

  const handleUpdateConfirmation = async (data: EditNotificationProps) => {
    await showPopup({
      title: "Update Notification",
      body: "Are you sure you want to save the changes?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Update",
          value: "update",
          variant: "primary",
          action: async (close: any) => {
            try {
              const res = await fetch(`/api/notifications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (!res.ok) throw new Error("Failed to update");
              toast.success("Notification updated successfully!");
              navigate(absoluteUrls.admin.home.manage_notification);
            } catch (err) {
              toast.error("Failed to update notification");
            }
            close(true);
          },
        },
      ],
    });
  };
  const handleSubmit = (data: EditNotificationProps) => {
    handleUpdateConfirmation(data);
  };
  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center py-10">
        <div
          className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        ></div>
        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
          Loading notification...
        </span>
      </div>
    );
  return (
    <div className="w-full h-full flex flex-col px-4 py-2 gap-3">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Edit Notification</p>
        <Button
          type="button"
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
              <SelectField
                label="Select Users"
                name="users"
                placeholder="Select Users"
                options={NotificationUsers}
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
              Update
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
