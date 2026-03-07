import type { LookupItem } from "@/shared/hooks/useLookup";
import { FaChevronDown, FaTimes } from "react-icons/fa";

export type DropdownId = "country" | "state" | "city" | null;

export interface InlineDropdownProps {
    id: DropdownId;
    activeId: DropdownId;
    placeholder: string;
    value: string;
    options: LookupItem[];
    onToggle: (id: DropdownId) => void;
    onSelect: (item: LookupItem) => void;
    onClear: () => void;
    disabled?: boolean;
    loading?: boolean;
}

/**
 * A dropdown component used within the `JobSearchBar`.
 * It displays a list of options and allows the user to select one.
 * It also supports clearing the selected value.
 * 
 * @param {InlineDropdownProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered dropdown component.
 */
export const InlineDropdown = ({
    id,
    activeId,
    placeholder,
    value,
    options,
    onToggle,
    onSelect,
    onClear,
    disabled = false,
    loading = false,
}: InlineDropdownProps) => {
    const isOpen = activeId === id;

    return (
        <div className="relative flex-shrink-0">
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={disabled || loading}
                    onClick={() => onToggle(isOpen ? null : id)}
                    className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm transition-colors bg-transparent border-none outline-none cursor-pointer
            ${(disabled || loading) ? "opacity-40 cursor-not-allowed" : "hover:text-indigo-600"}
            ${value ? "text-gray-800 font-medium" : "text-gray-400"}`}
                >
                    <span className="truncate max-w-[80px] xl:max-w-[120px] inline-block">
                        {loading ? "Loading..." : (value || placeholder)}
                    </span>
                    <FaChevronDown
                        className={`flex-shrink-0 transition-transform text-gray-400 text-[10px] ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {/* Clear button — only shown when a value is selected */}
                {value && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-colors flex-shrink-0 -ml-1 mr-1"
                        title={`Clear ${id}`}
                    >
                        <FaTimes className="text-[8px]" />
                    </button>
                )}
            </div>

            {isOpen && !disabled && !loading && (
                <>
                    {/* click-away backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => onToggle(null)}
                    />
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[176px] max-h-52 overflow-y-auto">
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400 italic">
                                No options
                            </div>
                        ) : (
                            options.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item);
                                        onToggle(null);
                                    }}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === item.name
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                        }`}
                                >
                                    {item.name}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
