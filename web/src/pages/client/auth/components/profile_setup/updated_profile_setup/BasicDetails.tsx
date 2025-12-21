import { absoluteUrls } from "@/config/urls";
import SetPassword from "@/pages/engineer/auth/components/profile_setup/SetPassword";
import { useClientSignup } from "@/shared/apiServices/client/clientService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BasicDetailsFields from "./BasicDetailsFields";
import type { ClientBasicDetails } from "./types";
import { buildQuery } from "@/utils";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const BasicDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const formCtx = useForm<ClientBasicDetails>({
    defaultValues: {
      // Common fields
      fullName: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      address: "",

      // Corporate-specific fields
      companyName: "",
      contactPersonName: "",
      businessType: params.role,
      industry: "",
      vat: "",
      vatRegistrationNumber: "",

      // Verification flags
      isMobileVerified: false,
      isEmailVerified: false,

      // Password fields
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

  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { mutateAsync: signup, isPending: isSubmitting } = useClientSignup({
    onSuccess: () => {
      toast.success("Completed registration successfully");
      navigate("/engineer/auth");
    },
    onError: (error: any) => {
      console.error("Submit error:", error);
      toast.error("Registration failed. Please try again.");
    },
  });
  const handleSubmit = async (data: ClientBasicDetails) => {
    console.log("Form data:", data);

    const frameData = {
      name: data.contactPersonName || data.fullName,
      phoneNumber: data.phone,
      email: signupEmail,
      password: data.password,
      clientType: data.businessType,
      companyName: data.companyName,
      contactPersonName: data.contactPersonName,
      businessType: data.businessType,
      industry: data.industry,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      postalCode: data.postalCode,
      enableNotifications: data.isEnableNotifications || true,
      isApproved: data.isApproved || true,
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
            const param = buildQuery({ id: loginData.id });
            navigate(`${absoluteUrls.client.auth.documents}?${param}`);
            close(true);
          },
        },
      ],
    });
  };

  const { signupEmail, emailVerified, signupPhone, mobileVerified } =
    location.state || {};

  const isMobileVerified = formCtx.watch("isMobileVerified");
  const isEmailVerified = formCtx.watch("isEmailVerified");

  useEffect(() => {
    if (signupEmail) formCtx.setValue("email", signupEmail);
    if (signupPhone) formCtx.setValue("phone", signupPhone);
    if (emailVerified) formCtx.setValue("isEmailVerified", true);
    if (mobileVerified) formCtx.setValue("isMobileVerified", true);
  }, [signupEmail, signupPhone, formCtx, emailVerified, mobileVerified]);

  useEffect(() => {
    if (isMobileVerified) formCtx.trigger("phone");
    if (isEmailVerified) formCtx.trigger("email");
  }, [isMobileVerified, isEmailVerified, formCtx]);

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col h-screen w-full"
    >
      <div className="shrink-0 p-2 flex flex-col gap-2 items-center justify-center  bg-white sticky top-0 z-10">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 mb-4 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <BasicDetailsFields />
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
          <SetPassword />
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Save and Continue
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDetails;
