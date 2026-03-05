import { toast } from "react-toastify";
import useDrawerStore from "@/shared/store/useDrawerStore";
import {
  useConnectStripeAccount,
  useGetOnboardingLink,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * Page component that triggers Stripe Connect onboarding for editing bank details.
 */
const EditBankDetails = () => {
  const { setActiveKey } = useDrawerStore();
  const hasStartedRef = useRef(false);
  const [hasError, setHasError] = useState(false);

  const {
    mutateAsync: connectStripeAccountAsync,
    isPending: isConnectingStripe,
  } = useConnectStripeAccount({
    onError: (error) => {
      console.error("Failed to connect Stripe account:", error);
      toast.error("Failed to edit bank details. Please try again.");
    },
  });

  const {
    mutateAsync: getOnboardingLinkAsync,
    isPending: isGettingOnboarding,
  } = useGetOnboardingLink({
    onError: (error) => {
      console.error("Failed to fetch onboarding link:", error);
    },
    onSuccess: (linkData) => {
      console.log("Onboarding link received:", linkData);
    },
  });

  const startStripeOnboarding = useCallback(async () => {
    setHasError(false);
    try {
      console.log("Calling connectStripeAccount mutation");
      const stripeData = await connectStripeAccountAsync({});
      console.log("connect success", stripeData);

      const origin = window.location.origin;
      const fallbackPath = "/engineer/dashboard";
      const currentPath = window.location.pathname || fallbackPath;
      const routePath = currentPath.startsWith("/engineer")
        ? currentPath
        : fallbackPath;

      const returnUrl = origin + routePath;
      const refreshUrl = origin + routePath;

      console.log("Requesting onboarding link");
      const onboardingResp = await getOnboardingLinkAsync({
        body: { returnUrl, refreshUrl },
      });
      console.log("onboardingResp", onboardingResp);

      const possibleUrl =
        typeof onboardingResp?.url === "string" && onboardingResp.url.trim()
          ? onboardingResp.url
          : null;

      if (!possibleUrl) {
        toast.error("Unable to start Stripe onboarding");
        setHasError(true);
        return;
      }

      setActiveKey("manageBankAccounts");
      const opened = window.open(possibleUrl, "_blank", "noopener,noreferrer");
      if (!opened) window.location.assign(possibleUrl);
      toast.success("Bank details onboarding started");
    } catch (err) {
      console.error("connect or onboarding failed", err);
      toast.error("Failed to connect or start onboarding");
      setHasError(true);
    }
  }, [connectStripeAccountAsync, getOnboardingLinkAsync, setActiveKey]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void startStripeOnboarding();
  }, [startStripeOnboarding]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-10">
      <p className="text-sm text-gray-600">
        {isConnectingStripe || isGettingOnboarding
          ? "Connecting your Stripe account..."
          : "Redirecting you to Stripe onboarding..."}
      </p>
      {hasError ? (
        <Button
          onClick={() => void startStripeOnboarding()}
          className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded"
        >
          Retry
        </Button>
      ) : null}

      {/* Legacy edit form flow kept intentionally.
      <FormContainer
        methods={formCtx}
        onSubmit={handleSubmit}
        className="flex h-full flex-col"
      >
        <BankDetailsForm formType="edit" />
      </FormContainer>
      */}
    </div>
  );
};

export default EditBankDetails;
