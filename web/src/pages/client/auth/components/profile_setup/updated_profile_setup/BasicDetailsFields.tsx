import countries from "@/dummy_data/countries";
import { validateCompany } from "@/pages/engineer/auth/components/profile_setup/profileValidators";
import {
  validateAddress,
  validateName,
  validateVatNumber,
  validateZipcode,
} from "@/pages/engineer/user_profile/Validate";
import {
  validateEmail,
  validateEmailRules,
} from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { PhoneInputWithValidation } from "@/shared/components/commonUI/inputs/PhoneInputWithValidation";
import { useFormContext, Controller } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { TbFileText } from "react-icons/tb";
import { MdCheckCircle, MdCancel, MdOutlineMailOutline } from "react-icons/md";
import {
  useStates,
  useCities,
  useIndustries,
  useVatOptions,
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
  const ctx = useFormContext();
  const { watch, setValue } = ctx;
  const watchedRole = watch("businessType");
  // Default to URL role if set, otherwise fallback to watched value or "home"
  const urlRole = window.location.pathname.includes("corporate")
    ? "CORPORATE"
    : undefined;
  const role = urlRole || watchedRole || "HOME";

  const country = watch("country");
  const selectedState = watch("state");

  // Fetch dropdown data from API
  const { data: states = [], isLoading: statesLoading } = useStates(
    country?.value,
  );
  const { data: cities = [], isLoading: citiesLoading } = useCities(
    selectedState?.value || selectedState,
  );
  const { data: industries = [], isLoading: industriesLoading } =
    useIndustries();
  const { data: vatOptions = [], isLoading: vatLoading } = useVatOptions();
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      {/* Account Type Selection (if not fixed by URL) */}
      {!urlRole && (
        <div className="flex gap-2 text-center justify-center mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm dark:border dark:border-[#4a5565] font-medium transition-all duration-200
      ${
        role === "HOME"
          ? "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-900 border border-teal-300 dark:from-teal-900/30 dark:to-teal-800/30 dark:text-teal-300 dark:border-teal-700"
          : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-900 hover:border hover:border-teal-200 dark:text-gray-400 dark:hover:from-teal-900/20 dark:hover:to-teal-800/20"
      }`}
            onClick={() => setValue("businessType", "HOME")}
          >
            Home Client
          </div>

          <div
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-sm dark:border dark:border-[#4a5565] font-medium transition-all duration-200
      ${
        role === "CORPORATE"
          ? "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-900 border border-teal-300 dark:from-teal-900/30 dark:to-teal-800/30 dark:text-teal-300 dark:border-teal-700"
          : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-900 hover:border hover:border-teal-200 dark:text-gray-400 dark:hover:from-teal-900/20 dark:hover:to-teal-800/20"
      }`}
            onClick={() => setValue("businessType", "CORPORATE")}
          >
            Corporate Client
          </div>
        </div>
      )}

      {role === "CORPORATE" ? (
        <>
          <InputField
            required
            name="companyName"
            type="text"
            placeholder="Company Name"
            leftIcon={<FaRegUser className="text-lg text-gray-500" />}
            label="Company Name"
            rules={{ validate: (v: string) => validateCompany(v) }}
          />

          <InputField
            name="contactPersonName"
            type="text"
            placeholder="Contact Person Name"
            leftIcon={<FaRegUser className="text-lg text-gray-500" />}
            required
            label="Contact Person Name"
            rules={{ validate: (v: string) => validateName(v) }}
          />
        </>
      ) : (
        <InputField
          name="fullName"
          type="text"
          placeholder="Full Name"
          leftIcon={<FaRegUser className="text-lg text-gray-500" />}
          required
          label="Full Name"
          rules={{ validate: (v: string) => validateName(v) }}
        />
      )}

      {/* Phone and email */}
      <PhoneInputWithValidation />

      <EmailFieldWithValidation />

      {/* Country, state, city, postal */}
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
        disabled={statesLoading}
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
        type="text"
        placeholder="Postal Code"
        required
        label="Postal Code"
        rules={{
          validate: (value: string) =>
            validateZipcode(
              value,
              typeof country === "string" ? country : country?.value,
            ),
        }}
      />

      {/* Corporate-only fields */}
      {role === "CORPORATE" && (
        <>
          <SelectField
            name="businessType"
            placeholder="Business Type"
            label="Business Type"
            disabled={!!urlRole} // Disable if fixed by URL
            options={[
              { value: "CORPORATE", label: "Corporate" },
              { value: "HOME", label: "Home" },
            ]}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
          />
          <SelectField
            name="industry"
            placeholder={
              industriesLoading ? "Loading industries..." : "Select Industry"
            }
            options={industries}
            leftIcon={<TbFileText className="text-lg text-gray-500" />}
            required
            label="Industry"
            disabled={industriesLoading}
          />

          <InputField
            name="address"
            type="text"
            placeholder="Address"
            required
            label="Address"
            rules={{ validate: (v: string) => validateAddress(v) }}
          />

          <SelectField
            name="vat"
            placeholder={
              vatLoading ? "Loading VAT options..." : "Select VAT Document"
            }
            options={vatOptions}
            required
            label="VAT"
            disabled={vatLoading}
          />
          <InputField
            name="vatRegistrationNumber"
            type="text"
            placeholder="VAT Registration Number"
            required
            label="VAT Registration Number"
            rules={{ validate: (v: string) => validateVatNumber(v) }}
          />
        </>
      )}
    </div>
  );
};

export default BasicDetailsFields;
