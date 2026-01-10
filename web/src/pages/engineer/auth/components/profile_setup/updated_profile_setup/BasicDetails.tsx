import { absoluteUrls } from "@/config/urls";
import { useEngineerSignup } from "@/shared/apiServices/engineer/engineerService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { CheckboxInput } from "@/shared/components/commonUI/inputs/CheckboxInput";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import { buildQuery } from "@/utils";
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
    setEngineerId,
    markStepCompleted,
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
      serviceCategory: serviceCategory || "",
      amount: amount || "",
      designation: designation || "",
      company: company || "",
      experienceYears: experienceYears || "",

      password: "",
      confirmPassword: "",
    },
  });

  const { showPopup } = usePopupStore();

  const { mutateAsync: signup, isPending: isSubmitting } = useEngineerSignup({
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      if (data.id) {
        setEngineerId(data.id);
      }
      toast.success("Profile details submitted successfully!");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  // Check for existing registration session
  const [hasAskedToContinue, setHasAskedToContinue] = useState(false);
  useEffect(() => {
    // If we have signup data but validation flag is missing or logic says we should ask
    // For now, mirroring client logic: check if email/phone exists
    if (!hasAskedToContinue && (signupEmail || signupPhone)) {
      // Logic handled in Signup page mostly, but good as fallback here if user refreshes
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
        skills: data.skills,
        portfolioLink: data.portfolioLink,
        serviceCategory: data.serviceCategory,
        amount: data.amount,
        designation: data.designation,
        company: data.company,
        experienceYears: data.experienceYears,
      });
    });
    return () => subscription.unsubscribe();
  }, [formCtx, updateProfileData]);

  const getValue = (val: any) => {
    if (!val) return "";
    if (typeof val === "object" && "value" in val) return val.value as string;
    return String(val);
  };

  const handleSubmit = async (data: EngineerBasicDetails) => {
    const apiData: any = {
      password: data.password,
      phoneNumber: data.phone,
      email: data.email,
      fullName: data.fullName,
      address: data.address,
      portfolioLink: data.portfolioLink,
      serviceCategory: getValue(data.serviceCategory),
      budget: data.amount,
      rate: parseFloat(data.amount.replace(/[^0-9.]/g, "")) || 0,
      experienceYears: parseFloat(data.experienceYears) || 0,

      // Hardcoded values matching the provided CURL/API requirements
      preferredWorkType: "REMOTE HYBRID",
      enableNotifications: data.isEnableNotifications,
      location: [
        getValue(data.city),
        getValue(data.state),
        getValue(data.country),
      ]
        .filter(Boolean)
        .join(", "),
      averageRating: 4.7,
      status: "PENDING",

      // Loosely typed skills - Stubbed to empty to match working CURL payload
      // jobSkills: Array.isArray(data.skills) ? data.skills.map((s: any) => ({ skillName: s.value || s })) : [],
      jobSkills: [],

      // Stubbing complex arrays as empty to match working CURL payload
      tools: [],
      experiences: [],
      educations: [],

      files: null,
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
            const result = await signup(apiData);
            markStepCompleted(3);

            // Navigate to Verification
            const params = buildQuery({ id: result.id });
            navigate(`${absoluteUrls.engineer.auth.verification}?${params}`);

            close(true);
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
            loading={isSubmitting}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDetails;
