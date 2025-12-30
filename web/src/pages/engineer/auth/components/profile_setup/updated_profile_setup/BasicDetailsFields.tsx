import countries from "@/dummy_data/countries";
import {
  validateName,
  validateAddress,
  validateZipcode,
  validateAmount,
  validateCompany,
  validateDesignation,
  validateExperience,
} from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import { validatePortfolioLink } from "@/shared/libs/utils";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import { useFormContext, Controller } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoUnlinkSharp, IoWalletOutline } from "react-icons/io5";
import { MdCheckCircle, MdCancel, MdOutlineMailOutline } from "react-icons/md";
import { serviceCategories } from "@/dummy_data/serviceCategories";
import skills from "@/dummy_data/skills";
import {
  useStates,
  useCities,
  usePhoneCountries,
} from "@/shared/apiServices/client/clientService"; // Reusing location hooks from client service if generic, or check if engineer has them
import { useDebouncedUserExists } from "@/shared/apiServices/user";
import { CountrySelect } from "@/shared/components/commonUI/inputs/CountrySelect";
import { COUNTRIES } from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useEffect } from "react";

/**
 * Phone field component with real-time availability validation
 */
const PhoneFieldWithValidation = () => {
  const { control, watch, trigger, getValues, setValue, clearErrors } =
    useFormContext();
  const phoneValue = watch("phone");

  // Fetch phone countries from API
  const { data: phoneCountries = [], isLoading: phoneCountriesLoading } =
    usePhoneCountries();

  // Initialize phone field with default country code if empty
  useEffect(() => {
    const currentValue = getValues("phone");
    if (!currentValue && phoneCountries.length > 0) {
      setValue("phone", `${phoneCountries[0].code} `, {
        shouldValidate: false,
      });
    }
  }, [getValues, setValue, phoneCountries]);

  // Extract full phone number (country code + number) for API validation
  const getFullPhoneNumber = (
    value: string | undefined
  ): string | undefined => {
    if (!value?.trim()) return undefined;
    const trimmed = value.trim();
    // Phone format is "{countryCode} {number}", so we use the full value
    const parts = trimmed.split(" ");
    if (parts.length < 2) return undefined;
    const phoneNumber = parts.slice(1).join("").trim();
    if (!phoneNumber || phoneNumber.length === 0) return undefined;
    // Return full phone number with country code
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

  // Debounced user exists check
  const { isAvailable, isUnavailable, isValidating, hasError } =
    useDebouncedUserExists(
      isValidPhoneFormat && fullPhoneNumber ? fullPhoneNumber : undefined,
      500,
      { enabled: isValidPhoneFormat && !!fullPhoneNumber }
    );

  // Phone validation function (same as PhoneInputField)
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
        Phone Number <span className="text-red-600">*</span>
      </label>
      <Controller
        name="phone"
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
            (c) => c.code === countryCode
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

          return (
            <>
              <div className="relative">
                <div
                  className={`flex w-full rounded-md border ${
                    error
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
                      clearErrors("phone");
                    }}
                    disabled={phoneCountriesLoading}
                  />
                  <input
                    type="tel"
                    value={numberValue}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (
                        /^\d*$/.test(newValue) &&
                        newValue.length <= maxLength
                      ) {
                        field.onChange(`${countryCode} ${newValue}`);
                        // Trigger validation after a short delay to allow debounce
                        setTimeout(() => {
                          trigger("phone");
                        }, 600);
                      }
                    }}
                    onBlur={(e) => {
                      const trimmed = e.target.value.trim();
                      field.onChange(`${countryCode} ${trimmed}`);
                    }}
                    placeholder="Enter mobile number"
                    className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidating && isValidPhoneFormat && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                    )}
                    {!isValidating && isValidPhoneFormat && isAvailable && (
                      <MdCheckCircle className="text-green-500 text-xl" />
                    )}
                    {!isValidating && isValidPhoneFormat && isUnavailable && (
                      <MdCancel className="text-red-500 text-xl" />
                    )}
                  </div>
                </div>
              </div>
              {error && (
                <span className="text-red-500 text-xs mt-1">
                  {error.message}
                </span>
              )}
              {!error && isValidPhoneFormat && isAvailable && (
                <span className="text-green-500 text-xs mt-1">
                  This phone number is available
                </span>
              )}
              {!error && isValidPhoneFormat && isUnavailable && (
                <span className="text-red-500 text-xs mt-1">
                  This phone number is already taken. Please use a different
                  phone number.
                </span>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

/**
 * Email field component with real-time availability validation
 */
const EmailFieldWithValidation = () => {
  const { control, watch, trigger } = useFormContext();
  const emailValue = watch("email");

  // Email validation regex
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const isValidEmailFormat = emailValue && emailRegex.test(emailValue);

  // Debounced user exists check
  const { isAvailable, isUnavailable, isValidating, hasError } =
    useDebouncedUserExists(isValidEmailFormat ? emailValue : undefined, 500, {
      enabled: isValidEmailFormat,
    });

  return (
    <div className="flex flex-col py-1 w-full">
      <label className="block text-md font-semibold text-gray-700 dark:text-gray-300">
        Email Address <span className="text-red-600">*</span>
      </label>
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email address is required",
          pattern: {
            value: emailRegex,
            message: "Invalid email address",
          },
          validate: (value: string) => {
            if (!value) return "Email address is required";
            if (!emailRegex.test(value)) return "Invalid email address";

            // Only check availability if email format is valid and we have a result
            if (isValidating) {
              return true; // Don't show error while validating
            }

            if (hasError) {
              return true; // Don't block on API errors, let user continue
            }

            if (isUnavailable) {
              return "This email is already taken. Please use a different email address.";
            }

            return true;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <MdOutlineMailOutline className="text-lg" />
              </div>
              <input
                {...field}
                id="email"
                type="email"
                placeholder="Email Address"
                onChange={async (e) => {
                  field.onChange(e);
                  // Trigger validation after a short delay to allow debounce
                  setTimeout(() => {
                    trigger("email");
                  }, 600);
                }}
                className={`w-full rounded-md border py-3 px-5 pl-10 pr-10 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition bg-white dark:bg-gray-800
                                    ${
                                      error
                                        ? "border-red-500 focus:ring-1 focus:ring-red-400"
                                        : isAvailable
                                        ? "border-green-500 focus:ring-1 focus:ring-green-400"
                                        : isUnavailable
                                        ? "border-red-500 focus:ring-1 focus:ring-red-400"
                                        : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
                                    }
                                `}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating && isValidEmailFormat && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                )}
                {!isValidating && isValidEmailFormat && isAvailable && (
                  <MdCheckCircle className="text-green-500 text-xl" />
                )}
                {!isValidating && isValidEmailFormat && isUnavailable && (
                  <MdCancel className="text-red-500 text-xl" />
                )}
              </div>
            </div>
            {error && (
              <span className="text-red-500 text-xs mt-1">{error.message}</span>
            )}
            {!error && isValidEmailFormat && isAvailable && (
              <span className="text-green-500 text-xs mt-1">
                This email is available
              </span>
            )}
            {!error && isValidEmailFormat && isUnavailable && (
              <span className="text-red-500 text-xs mt-1">
                This email is already taken. Please use a different email
                address.
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};

const BasicDetailsFields = () => {
  const { watch } = useFormContext();
  const country = watch("country");
  const selectedState = watch("state");

  // Fetch dropdown data - assuming these hooks are shared or available
  const { data: states = [], isLoading: statesLoading } = useStates(
    country?.value || country
  );
  const { data: cities = [], isLoading: citiesLoading } = useCities(
    selectedState?.value || selectedState
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <InputField
        name="fullName"
        type="text"
        placeholder="Full Name"
        leftIcon={<FaRegUser className="text-lg text-gray-500" />}
        required
        label="Full Name"
        rules={{ validate: (v: string) => validateName(v, "Full Name") }}
      />

      <PhoneFieldWithValidation />

      <EmailFieldWithValidation />

      {/* Location Section */}
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
        Location Details
      </div>

      <InputField
        name="address"
        label="Address"
        type="text"
        placeholder="Address"
        required
        leftIcon={<CiLocationOn className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAddress(v) }}
      />

      <SelectField
        name="country"
        label="Country"
        placeholder="Select Country"
        options={countries}
        required
      />

      <SelectField
        name="state"
        placeholder={statesLoading ? "Loading states..." : "Select State"}
        options={states}
        required
        label="State"
        disabled={statesLoading || !country}
      />

      <SelectField
        name="city"
        placeholder={citiesLoading ? "Loading cities..." : "Select City"}
        options={cities}
        required
        label="City"
        disabled={citiesLoading || !selectedState}
      />

      <InputField
        name="postalCode"
        label="Postal Code"
        type="text"
        placeholder="Postal Code"
        required
        leftIcon={<HiOutlineLocationMarker className="text-lg text-gray-500" />}
        rules={{
          validate: (value: string) =>
            validateZipcode(
              value,
              typeof country === "string" ? country : country?.value
            ),
        }}
      />

      {/* Professional Details Section */}
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
        Professional Details
      </div>

      <TagSelectField
        name="skills"
        label="Skills"
        placeholder="Add your skills"
        required
        options={skills}
        maxTags={15}
      />

      <SelectField
        name="serviceCategory"
        label="Service Category"
        placeholder="Select Category"
        options={serviceCategories}
        required
      />

      <InputField
        name="amount"
        label="Hourly Rate / Budget"
        type="text"
        placeholder="$50/hr"
        required
        leftIcon={<IoWalletOutline className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validateAmount(v) }}
      />

      <InputField
        name="portfolioLink"
        label="Portfolio Link"
        type="text"
        placeholder="https://..."
        leftIcon={<IoUnlinkSharp className="text-lg text-gray-500" />}
        rules={{ validate: (v: string) => validatePortfolioLink(v) }}
      />

      <InputField
        name="designation"
        label="Current Designation"
        type="text"
        placeholder="Current Designation"
        required
        rules={{ validate: (v: string) => validateDesignation(v) }}
      />

      <InputField
        name="company"
        label="Company/Employer"
        type="text"
        placeholder="Company/Employer"
        required
        rules={{ validate: (v: string) => validateCompany(v) }}
      />

      <InputField
        name="experienceYears"
        label="Years of Experience"
        type="text"
        placeholder="e.g. 5"
        required
        rules={{ validate: (v: string) => validateExperience(v) }}
      />
    </div>
  );
};

export default BasicDetailsFields;
