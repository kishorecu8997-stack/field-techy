import { toast } from "react-toastify";
import type { ManageClientProps } from "@/pages/admin/client/types";
import type { PopupConfig } from "../store/popupStore";
export const useClientStatusChange = () => {
  const handleStatusChange = async (
    row: ManageClientProps,
    status: string | null,
    showPopup: (config: PopupConfig) => Promise<void>,
  ) => {
    if (!status) return;

    await showPopup({
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} Client`,
      body: `Are you sure you want to ${status} this client?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: status === "approve" ? "primary" : "danger",
          action: async (close: (v: boolean) => void) => {
            toast.success(
              `Client ${
                status === "approve"
                  ? "approved"
                  : status === "pending"
                    ? "pending"
                    : "rejected"
              } successfully!`,
            );
            close(true);
          },
        },
      ],
    });
  };

  return { handleStatusChange };
};
