import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CountrySelect } from "./CountrySelect";
import { COUNTRIES } from "./PhoneInputField";
import { usePhoneCountries } from "@/shared/apiServices/client/clientService";

// TODO: Uncomment when user availability check API is ready for production
// import { useDebouncedUserExists } from "@/shared/apiServices/user";
// import { MdCheckCircle, MdCancel } from "react-icons/md";

interface PhoneInputWithValidationProps {
  name?: string;
  label?: string;
  placeholder?: string;
}

/**
 * Phone input component with real-time availability validation
 * Handles country code selection, phone number validation, and availability checking
 * 
 * NOTE: User availability API is currently commented out.
 * When ready, uncomment the useDebouncedUserExists hook and related UI elements.
 */
export const PhoneInputWithValidation = ({
  name = "phone",
  label = "Phone Number",
  placeholder = "Enter mobile number",
}: PhoneInputWithValidationProps) => {
  const { control, watch, trigger, getValues, setValue, clearErrors } =
    useFormContext();
  const phoneValue = watch(name);

  // Fetch phone countries from API
  const { data: phoneCountries = [], isLoading: phoneCountriesLoading } =
    usePhoneCountries();

  // Initialize phone field with default country code if empty
  useEffect(() => {
    const currentValue = getValues(name);
    if (!currentValue && phoneCountries.length > 0) {
      setValue(name, `${phoneCountries[0].code} `, {
        shouldValidate: false,
      });
    }
  }, [getValues, setValue, phoneCountries, name]);

  // Extract full phone number (country code + number) for API validation
  const getFullPhoneNumber = (
    value: string | undefined,
  ): string | undefined => {
    if (!value?.trim()) return undefined;
    const trimmed = value.trim();
    const parts = trimmed.split(" ");
    if (parts.length < 2) return undefined;
    const phoneNumber = parts.slice(1).join("").trim();
    if (!phoneNumber || phoneNumber.length === 0) return undefined;
    return trimmed;
  };

  const fullPhoneNumber = getFullPhoneNumber(phoneValue);

  // Validate phone format
  const validatePhoneFormat = (fullValue: string): boolean => {
    if (!fullValue?.trim()) return false;
    const parts = fullValue.trim().split(" ");
    if (parts.length < 2) return false;
    const countryCode = parts[0];
    const phoneNumber = parts.slice(1).join("").trim();
    const selectedCountry = phoneCountries.find((c) => c.code === countryCode);
    if (!selectedCountry) return false;
    if (!/^\d+$/.test(phoneNumber)) return false;
    return true;
  };

  const isValidPhoneFormat = phoneValue && validatePhoneFormat(phoneValue);

  // TODO: Uncomment when user availability check API is ready for production
  // Debounced user exists check
  // const {
  //   isAvailable,
  //   isUnavailable,
  //   isValidating,
  //   hasError,
  //   data: queryData,
  //   isSuccess,
  // } = useDebouncedUserExists(
  //   isValidPhoneFormat && fullPhoneNumber ? fullPhoneNumber : undefined,
  //   500,
  //   { enabled: isValidPhoneFormat && !!fullPhoneNumber },
  // );

  // Mock values while API is disabled
  const isAvailable = false;
  const isUnavailable = false;
  const isValidating = false;
  const hasError = false;
  const queryData = null;
  const isSuccess = false;

  // Suppress unused variable warnings
  void isAvailable;
  void isUnavailable;
  void isValidating;
  void hasError;
  void queryData;
  void isSuccess;
  void fullPhoneNumber;
  void isValidPhoneFormat;

  // Phone validation function
  const validatePhone = (fullValue: string): true | string => {
    if (!fullValue?.trim()) {
      return "Phone number is required";
    }

    const parts = fullValue.trim().split(" ");
    if (parts.length < 2) {
      return "Please enter a valid mobile number";
    }

    const countryCode = parts[0];
    const phoneNumber = parts.slice(1).join("").trim();

    const selectedCountry = phoneCountries.find((c) => c.code === countryCode);
    if (!selectedCountry) {
      return "Invalid country code";
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return "Mobile number must contain only digits (0-9)";
    }

    const { validationKey } = selectedCountry;

    if (validationKey === COUNTRIES.india) {
      if (phoneNumber.length !== 10) {
        return "India mobile number must be exactly 10 digits long";
      }
      if (!/^[6-9]/.test(phoneNumber)) {
        return "India mobile numbers must start with 6, 7, 8, or 9";
      }
    } else if (validationKey === COUNTRIES.uk) {
      if (phoneNumber.length !== 10) {
        return "UK mobile number must be exactly 10 digits long";
      }
      if (!/^[789]/.test(phoneNumber)) {
        return "UK mobile numbers must start with 7, 8, or 9";
      }
    } else if (validationKey === COUNTRIES.australia) {
      if (phoneNumber.length !== 9) {
        return "Australia mobile number must be exactly 9 digits long";
      }
    } else if (validationKey === COUNTRIES.brazil) {
      if (phoneNumber.length !== 11) {
        return "Brazil mobile number must be exactly 11 digits long";
      }
    } else if (validationKey === COUNTRIES.china) {
      if (phoneNumber.length !== 11) {
        return "China mobile number must be exactly 11 digits long";
      }
    } else if (validationKey === COUNTRIES.egypt) {
      if (phoneNumber.length !== 10) {
        return "Egypt mobile number must be exactly 10 digits long";
      }
    } else if (validationKey === COUNTRIES.france) {
      if (phoneNumber.length !== 9) {
        return "France mobile number must be exactly 9 digits long";
      }
      if (!/^[67]/.test(phoneNumber)) {
        return "France mobile numbers must start with 6 or 7";
      }
    } else if (validationKey === COUNTRIES.germany) {
      if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        return "Germany mobile number must be 10 to 11 digits long";
      }
    } else if (validationKey === COUNTRIES.japan) {
      if (phoneNumber.length !== 10) {
        return "Japan mobile number must be exactly 10 digits long";
      }
    } else if (validationKey === COUNTRIES.spain) {
      if (phoneNumber.length !== 9) {
        return "Spain mobile number must be exactly 9 digits long";
      }
    } else if (validationKey === COUNTRIES.usa) {
      if (phoneNumber.length !== 10) {
        return "United States mobile number must be exactly 10 digits long";
      }
    } else if (validationKey === COUNTRIES.uae) {
      if (phoneNumber.length !== 9) {
        return "UAE mobile number must be exactly 9 digits long";
      }
    }

    return true;
  };

  return (
    <div className="flex flex-col py-1 w-full">
      <label className="block mb-1 text-md font-semibold text-gray-700 dark:text-gray-300">
        {label} <span className="text-red-600">*</span>
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: "Phone number is required",
          validate: (value: string) => {
            const formatError = validatePhone(value);
            if (formatError !== true) return formatError;

            // Only check availability if phone format is valid and we have a result
            if (isValidating) {
              return true; // Don't show error while validating
            }

            if (hasError) {
              return true; // Don't block on API errors, let user continue
            }

            if (isUnavailable) {
              return "This phone number is already taken. Please use a different phone number.";
            }

            return true;
          },
        }}
        render={({ field, fieldState: { error } }) => {
          const [countryCode = phoneCountries[0]?.code || "+91", ...rest] = (
            field.value || ""
          ).split(" ");
          const numberValue = rest.join(" ");

          const selectedCountry = phoneCountries.find(
            (c) => c.code === countryCode,
          );

          let maxLength = 20;

          if (selectedCountry) {
            if (
              selectedCountry.validationKey === COUNTRIES.india ||
              selectedCountry.validationKey === COUNTRIES.uk ||
              selectedCountry.validationKey === COUNTRIES.japan ||
              selectedCountry.validationKey === COUNTRIES.egypt ||
              selectedCountry.validationKey === COUNTRIES.usa
            ) {
              maxLength = 10;
            } else if (
              selectedCountry.validationKey === COUNTRIES.australia ||
              selectedCountry.validationKey === COUNTRIES.uae ||
              selectedCountry.validationKey === COUNTRIES.spain ||
              selectedCountry.validationKey === COUNTRIES.france
            ) {
              maxLength = 9;
            } else if (
              selectedCountry.validationKey === COUNTRIES.brazil ||
              selectedCountry.validationKey === COUNTRIES.china
            ) {
              maxLength = 11;
            } else if (selectedCountry.validationKey === COUNTRIES.germany) {
              maxLength = 11;
            }
          }

          // Check if phone number passes full validation (format + country-specific rules)
          // const phoneValidationResult = validatePhone(field.value || "");
          // const isPhoneFullyValid =
          //   phoneValidationResult === true && isValidPhoneFormat;

          // Only show check icon when phone is fully valid AND API confirms availability
          // const shouldShowCheck =
          //   !isValidating &&
          //   isPhoneFullyValid &&
          //   isAvailable &&
          //   isSuccess &&
          //   queryData;

          // Show cancel icon when phone is valid but unavailable
          // const shouldShowCancel =
          //   !isValidating &&
          //   isPhoneFullyValid &&
          //   isUnavailable &&
          //   isSuccess &&
          //   queryData;

          return (
            <div className="flex flex-col gap-1">
              <div className="relative">
                <div
                  className={`flex w-full rounded-md border ${error
                    ? "border-red-500"
                    : isAvailable
                      ? "border-green-500"
                      : isUnavailable
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                  <CountrySelect
                    countries={phoneCountries}
                    value={countryCode}
                    onChange={(newCode) => {
                      field.onChange(`${newCode} ${numberValue}`);
                      clearErrors(name);
                    }}
                    disabled={phoneCountriesLoading}
                  />
                  <input
                    type="tel"
                    value={numberValue}
                    onChange={async (e) => {
                      let newValue = e.target.value;

                      // Apply maxLength if specified
                      if (maxLength && newValue.length > maxLength) {
                        newValue = newValue.slice(0, maxLength);
                      }

                      // Sanitize to only allow numbers
                      const cleaned = newValue.replace(/[^0-9]/g, "");

                      if (cleaned.length <= maxLength) {
                        field.onChange(`${countryCode} ${cleaned}`);
                        // Trigger validation after a short delay to allow debounce
                        setTimeout(() => {
                          trigger(name);
                        }, 600);
                      }
                    }}
                    onBlur={(e) => {
                      const trimmed = e.target.value.trim();
                      field.onChange(`${countryCode} ${trimmed}`);
                      field.onBlur();
                    }}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none pr-10 border-0 rounded-none focus:ring-0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {/* TODO: Uncomment when user availability check API is ready for production */}
                    {/* {isValidating && isValidPhoneFormat && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                    )}
                    {shouldShowCheck && (
                      <MdCheckCircle className="text-green-500 text-xl" />
                    )}
                    {shouldShowCancel && (
                      <MdCancel className="text-red-500 text-xl" />
                    )} */}
                  </div>
                </div>
              </div>

              {/* Error and status messages - consolidated to avoid clashing */}
              <div className="min-h-[20px]">
                {error && (
                  <span className="text-red-500 text-xs">{error.message}</span>
                )}
                {/* TODO: Uncomment when user availability check API is ready for production */}
                {/* {!error && shouldShowCheck && (
                  <span className="text-green-500 text-xs">
                    This phone number is available
                  </span>
                )}
                {!error && shouldShowCancel && (
                  <span className="text-red-500 text-xs">
                    This phone number is already taken. Please use a different
                    phone number.
                  </span>
                )} */}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default PhoneInputWithValidation;
