import type { PopupConfig } from "@/shared/store/popupStore";
import type { UseMutationResult } from "@tanstack/react-query";
import type { EngineerStatusType } from "@/pages/admin/engineer/types";

/**
 * Props for engineer status hook
 */
export interface UseEngineerStatusChangeProps {
  rowStatuses: Record<number, EngineerStatusType>;
  setRowStatuses: React.Dispatch<
    React.SetStateAction<Record<number, EngineerStatusType>>
  >;
  mutateAsync: UseMutationResult<
    unknown,
    unknown,
    { userId: number; profileStatus: EngineerStatusType }
  >["mutateAsync"];
  showPopup: (config: PopupConfig) => Promise<unknown>;
  refetch?: () => void | Promise<unknown>;
}
