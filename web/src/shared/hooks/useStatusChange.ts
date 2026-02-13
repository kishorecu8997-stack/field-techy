import { toast } from "react-toastify";
import type { ManageClientProps } from "@/pages/admin/client/types";
import type {
  AdminClientsByUserIdStatusBody,
  AdminClientsByUserIdStatusResponse,
} from "@/shared/apiServices/admin/adminOpenApiService";
import type { PopupConfig } from "@/shared/store/popupStore";

export interface UseStatusChangeProps {
  rowStatuses: Record<number, string>;
  setRowStatuses: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  updateClientStatus: (variables: {
    path: { userId: number };
    body: AdminClientsByUserIdStatusBody;
  }) => Promise<AdminClientsByUserIdStatusResponse>;
  refetchClients: () => void;
  showPopup: (config: PopupConfig) => Promise<unknown>;
  handleStatusChange: (
    row: ManageClientProps,
    status: string | null,
    showPopup: (config: PopupConfig) => Promise<unknown>,
    onConfirm?: (row: ManageClientProps, status: string) => Promise<void>,
  ) => Promise<unknown>;
}

/**
 * Custom hook for handling status changes in a table.
 *
 * @param {UseStatusChangeProps} props - The properties for the hook.
 * @returns {Object} An object containing the `onStatusChange` function.
 */
export const useStatusChange = ({
  rowStatuses,
  setRowStatuses,
  updateClientStatus,
  refetchClients,
  showPopup,
  handleStatusChange,
}: UseStatusChangeProps) => {
  const onStatusChange = async (row: ManageClientProps, value: string | null) => {
    if (!value) return;

    const previousStatus = rowStatuses[row.id] ?? row.profileStatus ?? "";

    setRowStatuses((prev) => ({
      ...prev,
      [row.id]: value,
    }));

    let isSuccess = false;

    const result = await handleStatusChange(
      row,
      value,
      showPopup,
      async (confirmedRow: ManageClientProps, status: string) => {
        try {
          const payload: AdminClientsByUserIdStatusBody = {
            profileStatus: status as AdminClientsByUserIdStatusBody["profileStatus"],
          };

          await updateClientStatus({
            path: { userId: Number(confirmedRow.userId || confirmedRow.id) },
            body: payload,
          });

          isSuccess = true;
          refetchClients();
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "Failed to update status",
          );
        }
      },
    );

    // rollback if failed
    if (result !== true || !isSuccess) {
      setRowStatuses((prev) => ({
        ...prev,
        [row.id]: previousStatus,
      }));
    }
  };

  return { onStatusChange };
};
