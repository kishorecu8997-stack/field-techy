import { toast } from "react-toastify";
import type { ManageEngineerProps, EngineerStatusType } from "@/pages/admin/engineer/types";
import type { PopupConfig } from "@/shared/store/popupStore";
import type { UseMutationResult } from "@tanstack/react-query";
import { EngineerStatus } from "@/pages/admin/engineer/types";

/**
 * Props for engineer status hook
 */
export interface UseEngineerStatusChangeProps {
  rowStatuses: Record<number, EngineerStatusType>;
  setRowStatuses: React.Dispatch<React.SetStateAction<Record<number, EngineerStatusType>>>;
  mutateAsync: UseMutationResult<
    unknown,
    unknown,
    { userId: number; profileStatus: EngineerStatusType }
  >["mutateAsync"];
  showPopup: (config: PopupConfig) => Promise<unknown>;
    refetch: () => void;
}

/**
 * Hook to handle engineer status changes with popup confirmation and optimistic UI
 */
export const useEngineerStatusChange = ({
  rowStatuses,
  setRowStatuses,
  mutateAsync,
  showPopup,
  refetch
}: UseEngineerStatusChangeProps) => {
  const onStatusChange = async (
    row: ManageEngineerProps,
    status: EngineerStatusType | null
  ) => {
    if (!status) return;

    const previousStatus = rowStatuses[row.id] ?? row.approvalStatus ?? "pending";

    // Optimistic update
    setRowStatuses((prev) => ({ ...prev, [row.id]: status }));

    let isSuccess = false;

    const result = await showPopup({
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} Engineer`,
      body: `Are you sure you want to ${status} this engineer?`,
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Yes",
          value: "yes",
            variant:
            status === EngineerStatus.APPROVE
                ? "primary"
                : status === EngineerStatus.REJECT
                ? "danger"
                : "warning",
          action: async (close) => {
            try {
              await mutateAsync({ userId: row.id, profileStatus: status });
              isSuccess = true;

              try {
                refetch();
                } catch {
                    toast.warning("Status updated but failed to refresh data");
                }
            close(true);
            } catch {
              close(true);
            }
          },
        },
      ],
    });

    // rollback if failed
    if (result !== true || !isSuccess) {
      setRowStatuses((prev) => ({ ...prev, [row.id]: previousStatus }));
      toast.error("Failed to update engineer status");
    }
  };

  return { onStatusChange };
};
