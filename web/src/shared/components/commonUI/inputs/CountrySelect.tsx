import { useState, useRef, useEffect } from "react";
import type { CountrySelectProps } from "./type";
import { MdKeyboardArrowDown } from "react-icons/md";


export const CountrySelect = ({
  countries,
  value,
  onChange,
  disabled = false,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentCountry = countries.find((c) => c.code === value);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center min-w-[5rem] gap-1 px-3 py-3 border-r border-gray-300 dark:border-gray-600 cursor-pointer ${
          disabled
            ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed rounded-md"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100  rounded-md"
        }`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        {currentCountry && (
          <>
          
            <img
              src={currentCountry.flag}
              alt={currentCountry.name}
              className="w-5 h-5 object-contain"
            />
            <span>{currentCountry.code}</span>
            <MdKeyboardArrowDown size={20} className={`text-gray-500 ${isOpen ? "rotate-180" : ""}`}/>

          </>
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600">
          {countries.map((country) => (
            <div
              key={country.code}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => {
                onChange(country.code);
                setIsOpen(false);
              }}
            >
              <img
                src={country.flag}
                alt={country.name}
                className="w-5 h-5 object-contain"
              />
              <span>
                {country.name} ({country.code})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
