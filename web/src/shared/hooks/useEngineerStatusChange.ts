import { toast } from "react-toastify";
import type {
  ManageEngineerProps,
  EngineerStatusType,
} from "@/pages/admin/engineer/types";
import { EngineerStatus } from "@/pages/admin/engineer/types";
import type { UseEngineerStatusChangeProps } from "./types";

/**
 * Hook to handle engineer status changes with popup confirmation and optimistic UI
 */
export const useEngineerStatusChange = ({
  rowStatuses,
  setRowStatuses,
  mutateAsync,
  showPopup,
  refetch,
}: UseEngineerStatusChangeProps) => {
  const onStatusChange = async (
    row: ManageEngineerProps,
    status: EngineerStatusType | null,
  ) => {
    if (!status) return;

    const previousStatus =
      rowStatuses[row.id] ??
      ((row.profileStatus as EngineerStatusType) ?? "pending");

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
              await mutateAsync({ userId: row.userId, profileStatus: status });
              isSuccess = true;
              toast.success(`Engineer status updated to ${status} successfully!`);            } catch (error) {
              toast.error(`Failed to update engineer status: ${error}`);
              close(true);
              return;
            }

            try {
              await refetch?.();
            } catch {
              toast.error(
                "Engineer status updated, but failed to refresh the list.",
              );
            }
            close(true);
          },
        },
      ],
    });

    // rollback if failed
    if (result !== true || !isSuccess) {
      setRowStatuses((prev) => ({ ...prev, [row.id]: previousStatus }));
    }
  };

  return { onStatusChange };
};
