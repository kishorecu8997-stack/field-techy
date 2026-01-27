import { useState, useRef, useEffect } from "react";
import type { CountrySelectProps } from "./type";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "../Buttons";
/**
 * CountrySelect is a reusable dropdown component for selecting a country.
 *
 * It displays the currently selected country’s flag and country code, and
 * allows the user to choose a different country from a dropdown list.
 * The dropdown automatically closes when the user clicks outside of it.
 *
 * The component supports a disabled state, which prevents user interaction
 * and visually indicates that the field is inactive.
 *
 * @param {CountrySelectProps} props - The props for the CountrySelect component.
 * @param {Array} props.countries - A list of available countries, each containing
 * a country code, name, and flag URL.
 * @param {string} props.value - The currently selected country code.
 * @param {(code: string) => void} props.onChange - Callback invoked when a new
 * country is selected. The selected country code is passed as an argument.
 * @param {boolean} [props.disabled=false] - Whether the dropdown is disabled.
 *
 * @returns {JSX.Element} A dropdown UI for selecting a country.
 */

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
        variant="dropdown"
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
        <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-600">
          {countries.map((country) => (
            <div
              key={country.code}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
