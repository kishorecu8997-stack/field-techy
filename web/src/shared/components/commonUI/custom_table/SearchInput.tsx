import { Search } from "lucide-react"; // lucide-react provides nice icons
import type { SearchInputProps } from "./type";

/**
 * SearchInput Component
 *
 * A reusable styled search input field with an integrated search icon.
 * It supports light and dark modes, hover effects, and updates parent
 * components via the `onChange` callback whenever the input value changes.
 *
 * @component
 * @param {SearchInputProps} props - Component props
 * @param {string} [props.value] - Current value of the search input
 * @param {(value: string) => void} [props.onChange] - Callback invoked on input change
 *
 * @example
 * <SearchInput
 *   value={searchValue}
 *   onChange={(val) => setSearchValue(val)}
 * />
 *
 * @returns {JSX.Element} A search input with an integrated search icon
 */

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="flex items-center border border-gray-300 my-2 rounded-lg px-3 py-1.5 w-80 bg-white dark:bg-gray-800 shadow-sm hover:shadow transition">
      <Search className="text-gray-400 dark:text-white w-4 h-4 mr-2" />
      <input
        type="text"
        placeholder="Search keyword"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full text-sm outline-none text-gray-700 dark:text-white placeholder-gray-400"
      />
    </div>
  );
};
