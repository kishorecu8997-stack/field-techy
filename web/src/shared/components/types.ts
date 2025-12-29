import type { SortOption } from "@/pages/engineer/search_result/types";

export interface SortDropdownProps {
  currentSort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}
