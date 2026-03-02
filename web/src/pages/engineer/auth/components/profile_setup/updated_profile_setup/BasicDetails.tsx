import { absoluteUrls } from "@/config/urls";
import { useRegisterEngineer } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import SetPassword from "../SetPassword"; // Resuing existing
import BasicDetailsFields from "./BasicDetailsFields";
import type { EngineerBasicDetails } from "./types";
import DOMPurify from "dompurify";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import Popup from "@/shared/components/Popup";

/**
 * A component that represents the main profile setup step for engineers.
 */
const BasicDetails = () => {
  const navigate = useNavigate();

  // Store hook
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
    skills,
    portfolioLink,
    serviceCategory,
    amount,
    designation,
    company,
    experienceYears,
    updateProfileData,
    markStepCompleted,
    setToken,
  } = useEngineerRegistrationStore();

  const [termsOpen, setTermsOpen] = useState(false);
  const {
    data: cmsData,
    isLoading: isTermsLoading,
    error: termsError,
  } = useGetCmsContent("terms");

  const formCtx = useForm<EngineerBasicDetails>({
    defaultValues: {
      fullName: fullName || "",
      email: email || signupEmail || "",
      phone: phone || signupPhone || "",
      country: country || "",
      state: state || "",
      city: city || "",
      postalCode: postalCode || "",
      address: address || "",
      skills: skills || [],
      portfolioLink: portfolioLink || "",
      serviceCategory: serviceCategory,
      amount: amount || "",
      designation: designation || "",
      company: company || "",
      experienceYears: experienceYears || "",
      password: "",
      confirmPassword: "",
    },
  });
  const { errors } = useFormState({
    control: formCtx.control,
  });
  const { showPopup } = usePopupStore();

  // TanStack Query mutation hook for engineer registration (using OpenAPI)
  const registerMutation = useRegisterEngineer({
    onSuccess: (result) => {
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        setToken(result.token);
      }

      toast.success("Profile details submitted successfully!");
      markStepCompleted(3);
      navigate(absoluteUrls.engineer.auth.verification);
    },
    onError: (error: unknown) => {
      toast.error(GlobalApiErrorHandler.handle(error).message);
    },
  });
  // Check for existing registration session
  const [hasAskedToContinue, setHasAskedToContinue] = useState(false);
  useEffect(() => {
    if (!hasAskedToContinue && (signupEmail || signupPhone)) {
      setHasAskedToContinue(true);
    }
  }, [signupEmail, signupPhone, hasAskedToContinue]);

  // Sync store with form
  useEffect(() => {
    if (signupEmail && !formCtx.getValues("email"))
      formCtx.setValue("email", signupEmail);
    if (signupPhone && !formCtx.getValues("phone"))
      formCtx.setValue("phone", signupPhone);
  }, [signupEmail, signupPhone, formCtx]);

  // Auto-save to store
  useEffect(() => {
    const subscription = formCtx.watch((data) => {
      updateProfileData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        state: data.state,
        city: data.city,
        postalCode: data.postalCode,
        address: data.address,
        skills: (data.skills || []).filter(
          (
            s,
          ): s is
            | string
            | number
            | { value?: string | number; label?: string } => s !== undefined,
        ),
        portfolioLink: data.portfolioLink,
        serviceCategory: data.serviceCategory ?? "",
        amount: data.amount,
        designation: data.designation,
        company: data.company,
        experienceYears: data.experienceYears,
      });
    });
    return () => subscription.unsubscribe();
  }, [formCtx, updateProfileData]);
  const handleSubmit = async (data: EngineerBasicDetails) => {
    type ValWithValue = { value: unknown };
    // Extract IDs from select objects - OpenAPI expects number IDs
    const getIdValue = (val: unknown): number | undefined => {
      if (val === null || val === undefined) return undefined;
      if (typeof val === "object" && val !== null && "value" in val) {
        const maybeValue = (val as ValWithValue).value;
        return maybeValue !== undefined ? Number(maybeValue) : undefined;
      }
      if (typeof val === "number") return val;
      if (typeof val === "string" && !isNaN(Number(val))) return Number(val);
      return undefined;
    };
    // Format data to match OpenAPI AppRegisterEngineerData body schema
    const apiData = {
      name: data.fullName,
      phoneNumber: data.phone,
      email: data.email,
      password: data.password || "",
      address: data.address,
      countryId: getIdValue(data.country),
      stateId: getIdValue(data.state),
      cityId: getIdValue(data.city),
      postalCode: data.postalCode,
      skills: Array.isArray(data.skills)
        ? data.skills
            .map((s: unknown) => {
              const val = getIdValue(s);
              return val !== undefined ? val : NaN;
            })
            .filter((n) => !isNaN(n))
        : [],
      serviceCategoryId: getIdValue(data.serviceCategory),
      hourlyRate: parseFloat(data.amount?.replace(/[^0-9.]/g, "")) || undefined,
      portfolioLink: data.portfolioLink || "",
      currentDesignation: data.designation,
      employer: data.company,
      yearsOfExperience: parseFloat(data.experienceYears) || undefined,
    };

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
      onSubmit={handleSubmit}
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
              {/* === CHANGED: Now opens CMS modal instead of hardcoded popup === */}
              <span
                className="text-blue-600 underline cursor-pointer bg-transparent border-none p-0 hover:text-blue-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setTermsOpen(true);
                }}
              >
                Terms and Conditions
              </span>
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
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto -translate-x-2 transform">
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
              to={absoluteUrls.engineer.auth.login}
              className="text-teal-900 dark:text-teal-400 underline font-semibold"
            >
              Sign In
            </NavLink>
          </h2>
        </div>
      </div>

      <Popup open={termsOpen} onClose={() => setTermsOpen(false)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl mx-auto max-h-[85vh] overflow-hidden flex flex-col">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isTermsLoading
                ? "Terms & Conditions"
                : cmsData && "type" in cmsData && cmsData.type === "page"
                  ? cmsData.data.title
                  : "Terms & Conditions"}
            </h2>
            <button
              onClick={() => setTermsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content area */}
          <div className="p-6 overflow-y-auto flex-1">
            {isTermsLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading terms and conditions...</p>
              </div>
            ) : termsError ||
              !cmsData ||
              !("type" in cmsData) ||
              cmsData.type !== "page" ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">
                  Failed to load terms and conditions
                </p>
              </div>
            ) : (
              <div
                className=" dark:text-gray-300 text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(cmsData.data.content),
                }}
              />
            )}
          </div>
        </div>
      </Popup>
    </FormContainer>
  );
};

export default BasicDetails;
