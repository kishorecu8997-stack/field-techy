import SetPassword from "@/pages/engineer/auth/components/profile_setup/SetPassword";
import { useClientSignup } from "@/shared/apiServices/client/clientService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BasicDetailsFields from "./BasicDetailsFields";
import { Controller } from "react-hook-form";
import type { ClientBasicDetails } from "./types";
import { buildQuery } from "@/utils";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";

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
    setClientId,
  } = useClientRegistrationStore();

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

      // Corporate-specific fields - restored from store
      companyName: companyName || "",
      contactPersonName: contactPersonName || "",
      businessType: params.role || "home",
      industry: industry || "",
      vat: vat || "",
      vatRegistrationNumber: vatRegistrationNumber || "",

      // Verification flags - restored from store

      // Password fields - never restored (security)
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

  const { showPopup } = usePopupStore();
  // Signup mutation
  const { mutateAsync: signup, isPending: isSubmitting } = useClientSignup({
    onSuccess: (data) => {
      console.log("Signup successful:", data);

      // Save client ID to store
      if (data.id) {
        setClientId(data.id);
      }

      // Mark registration as complete (basic profile done)
      // Documents are optional, so registration is considered complete here

      toast.success("Profile registered successfully!");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error(error.message || "Registration failed. Please try again.");
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

  const handleSubmit = async (data: ClientBasicDetails) => {
    console.log("Form data:", data);



    const frameData = {
      // --- Basic Identity ---
      // Expected by API: "id": "uuid" (optional/generated by backend?) - We don't send ID for new signup usually, but let's check if we need to pass one.
      // API Ref: "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      // STUB: Sending null as this is a new creation.
      id: null,

      name: data.contactPersonName || data.fullName || "", // Ensure string
      phoneNumber: data.phone || "",
      email: signupEmail || data.email || "",
      password: data.password || "", // Should be validated as required
      clientType: data.businessType?.toUpperCase() || "HOME", // Default to HOME if undefined

      // --- Corporate Details ---
      companyName: data.companyName || "", // Optional for Home, send empty string
      contactPersonName: data.contactPersonName || data.fullName || "", // Use full name if contact person not split
      businessType: data.businessType || "HOME",
      industry: getValue(data.industry), // Optional for Home, send empty string

      // --- Address & Location ---
      // Address field is now Corporate only in UI (reverted). For Home, it will be undefined, so we send ""
      address: data.address || "",
      country: getValue(data.country),
      state: getValue(data.state),
      city: getValue(data.city),
      postalCode: data.postalCode || "",

      // --- Tax & Legal (Corporate) ---
      // API expects: "taxDocumentVat": "string", "vatRegistrationNumber": "string"
      // STUB: data.vat is the document ID/Name from dropdown? 
      // If it's just the document TYPE name:
      taxDocumentVat: getValue(data.vat),
      vatRegistrationNumber: data.vatRegistrationNumber || "",

      // --- Documents (UUIDs expected) ---
      // API expects UUIDs for these documents.
      // STUB: Currently we don't upload documents in this step.
      // TODO: Implement file upload and pass returned UUIDs here.
      profilePicture: null,
      governmentIdProofDocument: null,
      certificationQualificationsDocument: null,

      // --- Settings & Flags ---
      enableNotifications: data.isEnableNotifications ?? false, // Default false
      isApproved: data.isApproved ?? true, // Default true (auto-approve?)
    };
    console.log("frameData :", frameData);

    await showPopup({
      title: "Sign Up",
      body: "Are you sure you want to continue with the provided details?",
      actionButtons: [
        {
          label: "Close",
          value: false,
          variant: "outline",
          action: (close) => {
            console.log("Cancelled");
            close(false);
          },
        },
        {
          label: "Submit",
          value: true,
          action: async (close) => {
            const loginData = await signup(frameData);
            toast.success("Profile details submitted successfully!");

            markStepCompleted(4);
            const param = buildQuery({ id: loginData.id });
            navigate(`/client/auth/verification?${param}`);
            close(true);
          },
        },
      ],
    });
  };

  // Pre-fill form from store (for fields that might have been edited)
  useEffect(() => {
    // Only update if values exist in store (don't override with empty strings)
    if (signupEmail && !formCtx.getValues("email"))
      formCtx.setValue("email", signupEmail);
    if (signupPhone && !formCtx.getValues("phone"))
      formCtx.setValue("phone", signupPhone);
  }, [signupEmail, signupPhone, formCtx]);

  // Helper to safely get value from string or Select option
  const getValue = (val: any) => {
    if (!val) return "";
    if (typeof val === "object" && "value" in val) return val.value as string;
    return String(val);
  };

  // Auto-save form changes to store (optional - for auto-save functionality)
  useEffect(() => {
    const subscription = formCtx.watch((data) => {
      // Save to store on every change
      updateProfileData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: getValue(data.country),
        state: getValue(data.state),
        city: getValue(data.city),
        postalCode: data.postalCode,
        address: data.address,
        companyName: data.companyName,
        contactPersonName: data.contactPersonName,
        industry: getValue(data.industry),
        vat: getValue(data.vat),
        vatRegistrationNumber: data.vatRegistrationNumber,
      });
    });
    return () => subscription.unsubscribe();
  }, [formCtx, updateProfileData]);

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col h-screen w-full"
    >
      <div className="shrink-0 p-2 mt-8 flex flex-col gap-2 items-center justify-center  bg-white sticky top-0 z-10">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 mb-4 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <BasicDetailsFields />
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
          <SetPassword />
          <Controller
            control={formCtx.control}
            name="termsAndConditions"
            rules={{ required: "You must agree to the terms and conditions" }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    checked={!!field.value}
                    id="terms"
                    className="accent-primary h-4 w-4"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <span className="text-blue-600 underline cursor-pointer">
                      Terms and Conditions
                    </span>
                  </label>
                </div>
                {error && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900">
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
