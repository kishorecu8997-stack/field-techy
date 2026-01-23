import { Search } from "lucide-react"; // lucide-react provides nice icons

/**
 * Renders a styled search input field with an icon.
 *
 * @component
 * @example
 * return (
 *   <SearchInput />
 * );
 *
 * @returns {JSX.Element} A search input with an integrated search icon and hover shadow effect.
 */
type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="flex items-center border border-gray-300 my-2 rounded-lg px-3 py-1.5 w-80 bg-white dark:bg-gray-800 shadow-sm hover:shadow transition">
      <Search className="text-gray-400 dark:text-white w-4 h-4 mr-2" />
      <input
        type="text"
        placeholder="Search keyword"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm outline-none text-gray-700 dark:text-white placeholder-gray-400"
      />
    </div>
  );
};
