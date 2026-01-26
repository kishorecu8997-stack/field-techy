import { useState, useRef, useEffect } from "react";
import type { CountrySelectProps } from "./type";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "../Buttons";

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
      <Button
        variant="secondary"
        onClick={toggleDropdown}
        disabled={disabled}
        leftIcon={
          currentCountry ? (
            <img
              src={currentCountry.flag}
              alt={currentCountry.name}
              className="w-5 h-5 object-contain"
            />
          ) : null
        }
        rightIcon={
          <MdKeyboardArrowDown
            size={20}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            } text-gray-500 dark:text-gray-400`}
          />
        }
      >
        {currentCountry ? (
          currentCountry.code
        ) : (
          <span className="text-gray-400">Select</span>
        )}
      </Button>

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
