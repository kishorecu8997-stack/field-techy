import { toast } from "react-toastify";
import type { ManageClientProps } from "@/pages/admin/client/types";
import type { PopupConfig } from "../store/popupStore";

/**
 * Custom hook to handle client status changes with
 * confirmation popup and toast notifications.
 *
 * @returns An object containing the handleStatusChange function
 */
export const useClientStatusChange = () => {
  /**
   * Triggers a confirmation popup and updates client status.
   *
   * @param row - Selected client data
   * @param status - Status to apply (approve / pending / reject)
   * @param showPopup - Function to show confirmation popup
   */
  const handleStatusChange = async (
    _row: ManageClientProps,
    status: string | null,
    showPopup: (config: PopupConfig) => Promise<unknown>,
    onConfirm?: (row: ManageClientProps, status: string) => Promise<void>
  ) => {
    if (!status) return;

    return await showPopup({
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
          variant:
            status === "approve"
              ? "primary"
              : status === "pending"
                ? "warning"
                : "danger",
          action: async (close: (v: boolean) => void) => {
            if (onConfirm && status) {
              await onConfirm(_row, status);
            }
            if (status === "approved") {
              toast.success("Client approved successfully!");
            } else if (status === "pending") {
              toast.warning("Client marked as pending!");
            } else if (status === "rejected") {
              toast.error("Client Status Rejected !");
            }
            close(true);
          },
        },
      ],
    });
  };

  return { handleStatusChange };
};
