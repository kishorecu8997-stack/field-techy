import { Controller, useFormContext } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import {
    validateEmail,
    validateEmailRules,
} from "@/shared/components/commonUI/emailValidation";

// TODO: Uncomment when user availability check API is ready for production
// import { useDebouncedUserExists } from "@/shared/apiServices/user";
// import { MdCheckCircle, MdCancel } from "react-icons/md";

interface EmailFieldWithValidationProps {
    name?: string;
    label?: string;
    placeholder?: string;
}

/**
 * Email field component with real-time availability validation
 * 
 * NOTE: User availability API is currently commented out.
 * When ready, uncomment the useDebouncedUserExists hook and related UI elements.
 * 
 * @param {EmailFieldWithValidationProps} props - The props for the component
 * @param {string} props.name - Field name for form (default: "email")
 * @param {string} props.label - Label text (default: "Email Address")
 * @param {string} props.placeholder - Placeholder text (default: "Email Address")
 * 
 * @example
 * <EmailFieldWithValidation />
 * // or with custom props
 * <EmailFieldWithValidation
 *   name="userEmail"
 *   label="Your Email"
 *   placeholder="Enter your email"
 * />
 */
export const EmailFieldWithValidation = ({
    name = "email",
    label = "Email Address",
    placeholder = "Email Address",
}: EmailFieldWithValidationProps) => {
    const { control, watch, trigger } = useFormContext();
    const emailValue = watch(name);

    // Email validation regex
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValidEmailFormat = emailValue && emailRegex.test(emailValue);

    // TODO: Uncomment when user availability check API is ready for production
    // Debounced user exists check
    // const { isAvailable, isUnavailable, isValidating, hasError } =
    //   useDebouncedUserExists(isValidEmailFormat ? emailValue : undefined, 500, {
    //     enabled: isValidEmailFormat,
    //   });

    // Mock values while API is disabled
    const isAvailable = false;
    const isUnavailable = false;
    const isValidating = false;
    const hasError = false;

    // Suppress unused variable warnings
    void isAvailable;
    void isUnavailable;
    void isValidating;
    void hasError;
    void isValidEmailFormat;

    return (
        <div className="flex flex-col py-1 w-full">
            <label className="block text-md font-semibold text-gray-700 dark:text-gray-300">
                {label} <span className="text-red-600">*</span>
            </label>
            <Controller
                name={name}
                control={control}
                rules={{
                    ...validateEmailRules,
                    validate: (value: string) => {
                        // First run the shared email validation
                        const emailValidationResult = validateEmail(value);
                        if (emailValidationResult !== true) {
                            return emailValidationResult;
                        }

                        // TODO: Uncomment when user availability check API is ready for production
                        // Only check availability if email format is valid and we have a result
                        // if (isValidating) {
                        //   return true; // Don't show error while validating
                        // }

                        // if (hasError) {
                        //   return true; // Don't block on API errors, let user continue
                        // }

                        // if (isUnavailable) {
                        //   return "This email is already taken. Please use a different email address.";
                        // }

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
                                id={name}
                                type="email"
                                placeholder={placeholder}
                                onChange={async (e) => {
                                    field.onChange(e);
                                    // Trigger validation after a short delay to allow debounce
                                    setTimeout(() => {
                                        trigger(name);
                                    }, 600);
                                }}
                                className={`w-full rounded-md border py-3 px-5 pl-10 pr-10 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition bg-white dark:bg-gray-800
                  ${error
                                        ? "border-red-500 focus:ring-1 focus:ring-red-400"
                                        : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
                                    }
                `}
                            // TODO: Uncomment when user availability check API is ready for production
                            // className={`w-full rounded-md border py-3 px-5 pl-10 pr-10 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition bg-white dark:bg-gray-800
                            //   ${
                            //     error
                            //       ? "border-red-500 focus:ring-1 focus:ring-red-400"
                            //       : isAvailable
                            //         ? "border-green-500 focus:ring-1 focus:ring-green-400"
                            //         : isUnavailable
                            //           ? "border-red-500 focus:ring-1 focus:ring-red-400"
                            //           : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
                            //   }
                            // `}
                            />
                            {/* TODO: Uncomment when user availability check API is ready for production */}
                            {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating && isValidEmailFormat && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                )}
                {!isValidating && isValidEmailFormat && isAvailable && (
                  <MdCheckCircle className="text-green-500 text-xl" />
                )}
                {!isValidating && isValidEmailFormat && isUnavailable && (
                  <MdCancel className="text-red-500 text-xl" />
                )}
              </div> */}
                        </div>
                        {error && (
                            <span className="text-red-500 text-xs mt-1">{error.message}</span>
                        )}
                        {/* TODO: Uncomment when user availability check API is ready for production */}
                        {/* {!error && isValidEmailFormat && isAvailable && (
              <span className="text-green-500 text-xs mt-1">
                This email is available
              </span>
            )}
            {!error && isValidEmailFormat && isUnavailable && (
              <span className="text-red-500 text-xs mt-1">
                This email is already taken. Please use a different email
                address.
              </span>
            )} */}
                    </>
                )}
            />
        </div>
    );
};

export default EmailFieldWithValidation;
