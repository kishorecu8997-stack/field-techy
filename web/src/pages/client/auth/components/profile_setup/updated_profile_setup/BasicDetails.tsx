import SetPassword from "@/pages/engineer/auth/components/profile_setup/SetPassword";
import { useRegisterClient } from "@/shared/apiServices/client/clientOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BasicDetailsFields from "./BasicDetailsFields";
import { type ClientBasicDetails, ClientTypeEnum } from "./types";
import { absoluteUrls } from "@/config/urls";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const BasicDetails = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Get store values BEFORE initializing form
  const {
    signupEmail,
    signupPhone,
    fullName,
    email,
    phone,
    country,
    state,
    city,
    postalCode,
    address,
    companyName,
    contactPersonName,
    industry,
    vat,
    vatRegistrationNumber,
    markStepCompleted,
    updateProfileData,
    setToken,
  } = useClientRegistrationStore();

  const getClientTypeFromRole = (role?: string): ClientTypeEnum => {
    if (role?.toLowerCase() === "corporate") return ClientTypeEnum.CORPORATE;
    return ClientTypeEnum.HOME;
  };

  const formCtx = useForm<ClientBasicDetails>({
    defaultValues: {
      // Common fields - restored from store
      fullName: fullName || "",
      email: email || signupEmail || "",
      phone: phone || signupPhone || "",
      country: country || "",
      state: state || "",
      city: city || "",
      postalCode: postalCode || "",
      address: address || "",
      clientType: getClientTypeFromRole(params.role),
      businessType: "",

      companyName: companyName || "",
      contactPersonName: contactPersonName || "",
      industry: industry || "",
      documentType: vat || "",
      registrationNumber: vatRegistrationNumber || "",

      password: "",
      confirmPassword: "",

      // Payment fields
      paymentMethodId: "",
      cardNumber: "",
      expDate: "",
      cvv: "",
      PaymentCountry: "",
      cardAddress: "",
    },
  });
  const { errors } = useFormState({
    control: formCtx.control,
  });
  const { showPopup } = usePopupStore();

  // TanStack Query mutation hook for client registration (using OpenAPI)
  const registerMutation = useRegisterClient({
    onSuccess: (result) => {
      // Store the JWT token for OTP verification
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        setToken(result.token);
      }

      toast.success("Profile registered successfully!");
      markStepCompleted(4);
      navigate("/client/auth/verification");
    },
    onError: (error: unknown) => {
      toast.error(
        (error as Error)?.message || "Registration failed. Please try again.",
      );
    },
  });

  // Resume registration check
  const [hasAskedToContinue, setHasAskedToContinue] = useState(false);
  const { clearStore: resetStore } = useClientRegistrationStore();

  // Ask user if they want to continue with previous registration if not coming from verified flow
  // Since we are now the first page, we need to check if there is data in store
  useEffect(() => {
    // Only check if we are on the main signup route (no role param, or explicitly the start)
    // and if there is data in the store
    if (!hasAskedToContinue && (signupEmail || signupPhone) && !params.role) {
      setHasAskedToContinue(true);

      showPopup({
        title: "Continue Registration?",
        body: `You previously started registration. Would you like to continue or start fresh?`,
        actionButtons: [
          {
            label: "Start Fresh",
            value: false,
            variant: "outline",
            action: (close) => {
              resetStore();
              formCtx.reset();
              close(false);
            },
          },
          {
            label: "Continue",
            value: true,
            action: (close) => {
              // Values are already in defaultValues, form will re-hydrate or we can force set
              close(true);
            },
          },
        ],
      });
    }
  }, [
    signupEmail,
    signupPhone,
    hasAskedToContinue,
    resetStore,
    formCtx,
    params.role,
    showPopup,
  ]);

  // Helper to safely get numeric ID from string or Select option
  const getIdValue = (val: unknown): number | undefined => {
    if (!val) return undefined;
    if (typeof val === "object" && "value" in (val as object)) {
      const v = (val as { value: unknown }).value;
      return typeof v === "number"
        ? v
        : typeof v === "string" && !isNaN(Number(v))
          ? Number(v)
          : undefined;
    }
    if (typeof val === "number") return val;
    if (typeof val === "string" && !isNaN(Number(val))) return Number(val);
    return undefined;
  };

  // Helper to safely get string value from Select option
  const getStringValue = (val: unknown): string => {
    if (!val) return "";
    if (typeof val === "object" && "value" in (val as object))
      return String((val as { value: unknown }).value);
    return String(val);
  };

  // Build API data based on client type (discriminated union)
  const buildApiData = (data: ClientBasicDetails) => {
    const clientType = data.clientType || ClientTypeEnum.HOME;

    const baseFields = {
      name: data.contactPersonName || data.fullName || "",
      phoneNumber: data.phone || "",
      email: signupEmail || data.email || "",
      password: data.password || "",
      countryId: getIdValue(data.country),
      stateId: getIdValue(data.state),
      cityId: getIdValue(data.city),
      postalCode: data.postalCode || "",
    };

    return clientType === ClientTypeEnum.CORPORATE
      ? {
          ...baseFields,
          clientType: "corporate" as const, // API expects string literal "corporate"
          companyName: data.companyName || "",
          personName: data.contactPersonName || data.fullName || "",
          address: data.address || "",
          industryId: getIdValue(data.industry),
          documentType: getStringValue(data.documentType) || undefined,
          documentNumber: data.registrationNumber || undefined,
          businessType: getStringValue(data.businessType) || undefined,
        }
      : {
          ...baseFields,
          clientType: "home" as const, // API expects string literal "home"
        };
  };

  // Auto-save form changes to store
  useEffect(() => {
    const subscription = formCtx.watch((data) => {
      updateProfileData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: getStringValue(data.country),
        state: getStringValue(data.state),
        city: getStringValue(data.city),
        postalCode: data.postalCode,
        address: data.address,
        companyName: data.companyName,
        contactPersonName: data.contactPersonName,
        industry: getStringValue(data.industry),
        vat: getStringValue(data.documentType),
        vatRegistrationNumber: data.registrationNumber,
      });
    });
    return () => subscription.unsubscribe();
  }, [formCtx, updateProfileData]);

  // Form submit handler with popup confirmation
  const onFormSubmit = async (data: ClientBasicDetails) => {
    await showPopup({
      title: "Sign Up",
      body: "Are you sure you want to continue with the provided details?",
      actionButtons: [
        {
          label: "Close",
          value: false,
          variant: "outline",
          action: (close) => close(false),
        },
        {
          label: "Submit",
          value: true,
          action: async (close) => {
            try {
              const apiData = buildApiData(data);
              await registerMutation.mutateAsync({ body: apiData });
              close(true);
            } catch {
              close(false);
            }
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={onFormSubmit}
      className="flex flex-col h-screen w-full"
    >
      <div className="shrink-0 p-2 mt-8 flex flex-col gap-2 items-center justify-center sticky top-0 z-10">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 dark:text-gray-400 mb-4 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <BasicDetailsFields />
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
          <SetPassword />
          <div className="mt-4 flex items-center gap-2">
            <CheckboxInput
              name="termsAndConditions"
              required
              isShowLabel={false}
              renderError={false}
              rules={{ required: "You must agree to the terms and conditions" }}
            />
            <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-wrap items-center gap-1">
              <label htmlFor="termsAndConditions" className="cursor-pointer">
                I agree to the
              </label>
              <div
                className="text-blue-600 underline cursor-pointer bg-transparent border-none p-0"
                onClick={async (e) => {
                  e.stopPropagation();

                  try {
                    await showPopup({
                      title: "Terms and Conditions",
                      body: (
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 max-w-lg">
                          <p>
                            At Job Portal (https://fieldtechy.com/), we respect
                            your privacy. This policy explains what information
                            we collect, how we use it, and how we protect it. It
                            applies to visitors of our website and does not
                            cover offline or other channels.
                          </p>

                          <p>
                            <strong>Terms of Agreement:</strong> By using our
                            site, you agree to our Privacy Policy and its terms.
                          </p>

                          <p>
                            <strong>Protection of Minors:</strong> We do not
                            knowingly collect personal data from children under
                            13. Parents should supervise their children online.
                            Contact us immediately if such data is submitted.
                          </p>

                          <p>
                            <strong>Job Posting and Hiring:</strong> Clients
                            must provide accurate job information. Field Techy
                            may remove posts violating our rules. Once assigned,
                            engineers and clients must communicate
                            professionally and follow milestone payments.
                          </p>

                          <p>
                            <strong>Cancellations & Privacy:</strong> We advise
                            parents to monitor children's use. Personal data of
                            children under 13 is removed upon request.
                          </p>

                          <p>
                            By using our service, you agree to all applicable
                            terms and conditions.
                          </p>
                        </div>
                      ),
                      actionButtons: [
                        {
                          label: "Close",
                          value: null,
                          variant: "primary",
                        },
                      ],
                    });
                  } catch (error) {
                    console.error(
                      "Failed to open Terms and Conditions popup:",
                      error,
                    );
                  }
                }}
              >
                Terms and Conditions
              </div>
            </div>
          </div>
          {errors?.termsAndConditions && (
            <p className="mt-1 text-sm text-red-600">
              {errors.termsAndConditions.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 p-4">
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r mb-8 from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            loading={registerMutation.isPending}
          >
            Save and Continue
          </Button>
          <h2 className="text-md text-center font-extralight text-gray-700 dark:text-gray-300 -mt-6 mb-4">
            Already have an account?{" "}
            <NavLink
              to={absoluteUrls.client.auth.login}
              className="text-teal-900 dark:text-teal-400 underline font-semibold"
            >
              Sign In
            </NavLink>
          </h2>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDetails;
