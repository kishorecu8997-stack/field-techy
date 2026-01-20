import { absoluteUrls } from "@/config/urls";
import { useRegisterEngineer } from "@/shared/apiServices/engineer/engineerService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SetPassword from "../SetPassword"; // Resuing existing
import BasicDetailsFields from "./BasicDetailsFields";
import type { EngineerBasicDetails } from "./types";

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

  const { showPopup } = usePopupStore();

  // TanStack Query mutation hook for engineer registration (using OpenAPI)
  const registerMutation = useRegisterEngineer({
    onSuccess: (result) => {
      console.log("Signup successful:", result);

      // Store the JWT token for OTP verification
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
        setToken(result.token);
      }

      toast.success("Profile details submitted successfully!");
      markStepCompleted(3);
      navigate(absoluteUrls.engineer.auth.verification);
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error(
        error?.message || "Registration failed. Please try again.",
      );
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
        skills: (data.skills || []).filter((s): s is string | number => s !== undefined),
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
    // Extract IDs from select objects - OpenAPI expects number IDs
    const getIdValue = (val: any): number | undefined => {
      if (!val) return undefined;
      if (typeof val === 'object' && 'value' in val) return Number(val.value);
      if (typeof val === 'number') return val;
      if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
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
        ? data.skills.map((s: any) => typeof s === 'object' ? Number(s.value) : Number(s)).filter(n => !isNaN(n))
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
              await registerMutation.mutateAsync(apiData);
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
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto mt-4">
          <SetPassword />
          <div className="mt-4 flex items-center gap-2">
            <CheckboxInput
              name="termsAndConditions"
              required
              isShowLabel={false}
              rules={{ required: "You must agree to the terms and conditions" }}
            />
            <label
              htmlFor="termsAndConditions"
              className="text-sm text-gray-700 cursor-pointer dark:text-gray-300"
            >
              I agree to the{" "}
              <span className="text-blue-600 underline cursor-pointer">
                Terms and Conditions
              </span>
            </label>
          </div>
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
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDetails;
