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
import {
  validateEmail,
  validateEmailRules,
} from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import { PhoneInputWithValidation } from "@/shared/components/commonUI/inputs/PhoneInputWithValidation";
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
} from "@/shared/apiServices/client/clientService";
import { useDebouncedUserExists } from "@/shared/apiServices/user";

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
          ...validateEmailRules,
          validate: (value: string) => {
            // First run the shared email validation
            const emailValidationResult = validateEmail(value);
            if (emailValidationResult !== true) {
              return emailValidationResult;
            }

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
    country?.value || country,
  );
  const { data: cities = [], isLoading: citiesLoading } = useCities(
    selectedState?.value || selectedState,
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

      <PhoneInputWithValidation />

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
        label="State/Region"
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
              typeof country === "string" ? country : country?.value,
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
        allowedCharacters="numbers-dot"
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
