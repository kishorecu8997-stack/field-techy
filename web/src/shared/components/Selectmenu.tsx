import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

/**
 * Option represents a single dropdown choice.
 * @typedef {{ value: string, label: string }} Option
 * @property {string} value - The unique string value for the option.
 * @property {string} label - The display label shown in the list.
 */
interface Option {
  value: string;
  label: string;
  bg?:string;
  icon?:any;

}

/**
 * Props for the SimpleSelect component.
 *
 * - options: available choices for the dropdown
 * - placeholder: label shown when no option is selected
 * - onChange: callback invoked with the selected option value or null
 * - value: currently selected value
 * - className: optional extra CSS classes applied to the root wrapper
 */
interface SimpleSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
  className?: string;
  badge?:boolean
}

/**
 * SimpleSelect
 *
 * A small, keyboard/mouse accessible select component that renders a custom
 * dropdown. It keeps internal open/close state and notifies the parent via
 * `onChange` with the selected option's `value` (string) or `null`.
 *
 * Note: this component intentionally restricts option values to strings to
 * keep the API simple and avoid complex identity comparisons.
 *
 * @param {SimpleSelectProps} props
 * @returns {JSX.Element}
 */
const SelectMenu = ({
  options,
  placeholder = "Select an option",
  onChange,
  value: selectedValue,
  className = "",
  badge
}: SimpleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /**
   * Handle selection of an option.
   * Calls the onChange prop with the option value and closes the dropdown.
   * @param {Option} option
   * @returns {void}
   */
  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
const[selectbadge,isSelectBadge]=useState<any>('')
const[icons,isIcon]=useState<any>('')
console.log(icons);

  return (
    <div className={`relative inline-block ${className}`} ref={wrapperRef}>
      <div
        onClick={toggleDropdown}
        className={`flex space-x-2 items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-800 rounded-md
         ${badge ? `${selectbadge}`:'bg-white text-white'} dark:bg-gray-800 cursor-pointer hover:border-gray-400 min-w-[120px]`}
      >
        <span className={` ${badge ? `${selectbadge}`:' text-gray-700'} truncate text-sm dark:text-[#979ba2]`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

 {badge ? <span className=" w-4 h-4">{selectedOption ? icons:<MdKeyboardArrowDown
          className={`text-xl text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />}</span>:<MdKeyboardArrowDown
          className={`text-xl text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />}
        
      </div>

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white border text-gray-800 dark:text-white dark:bg-gray-800 
        border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {options.map((option) => ( 
            <li
              key={option.value}
              onClick={() =>{handleSelect(option),isSelectBadge(option.bg),isIcon(option.icon)} }
              className={`flex items-center gap-x-1 px-3 py-2 cursor-pointer text-sm ${badge ?`${option?.bg}`:
                option.value === selectedValue
                  ? "bg-emerald-100 text-gray-900 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-blue-400"
              }`}
            >
             {badge && <option.icon className="inline w-4 h-4 ml-2" />}
             
              {option.label}
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectMenu;