import { Button } from "@/shared/components/commonUI/Buttons";
import useDrawerStore from "@/shared/store/useDrawerStore";
import TransactionDashboard from "./TransactionDashboard";
import BestPayingJobs from "./BestPayingJobs";
import TotalEarningsSummary from "./TotalEarningsSummary";
import EarningHistoryChart from "./EarningHistoryChart";
import MonthlyComparison from "./MonthlyComparison";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import {
  useEngineerBalance,
  useEngineerGetPersonalInfo,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { formatCurrency } from "@/shared/libs/utils";
import {
  useConnectStripeAccount,
  useGetOnboardingLink,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { toast } from "react-toastify";
import { useCallback, useState } from "react";
/**
 * Displays the user's current balance with quick actions (Bank Details, Withdraw) and a transaction history dashboard.
 * Uses dummy transaction data and integrates with the drawer store for navigation.
 */
const MyEarning = () => {
  const { setActiveKey } = useDrawerStore();
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const { data: balanceArr } = useEngineerBalance();
  const { data: personalInfo } = useEngineerGetPersonalInfo();
  const balance = balanceArr?.[0];
  const hasCompletedOnboarding =
    personalInfo?.onboardingStatus?.toLowerCase() === "completed";
  const bankDetailsButtonLabel = hasCompletedOnboarding
    ? "Edit Bank Details"
    : "Add Bank Details";

  const formattedBalance = showBalance
    ? (() => {
      const amount = Number(balance?.balance);
      const currency = balance?.currencyCode ?? "USD";
      return isNaN(amount) ? "$0.00" : formatCurrency(amount, currency);
    })()
    : "******";

  const [hasError, setHasError] = useState(false);

  const { mutateAsync: connectStripeAccountAsync } = useConnectStripeAccount({
    onError: (error) => {
      //TODO: console logs for debugging purposes, it will be removed in production
      console.error("Failed to connect Stripe account:", error);
      toast.error("Failed to edit bank details. Please try again.");
    },
  });

  const { mutateAsync: getOnboardingLinkAsync } = useGetOnboardingLink({
    onError: (error) => {
      //TODO: console logs for debugging purposes, it will be removed in production
      console.error("Failed to fetch onboarding link:", error);
      toast.error("Failed to edit bank details. Please try again.");
    },
    onSuccess: (linkData) => {
      //TODO: console logs for debugging purposes, it will be removed in production
      console.log("Onboarding link received:", linkData);
      toast.success("Bank details onboarding started");
    },
  });

  const startStripeOnboarding = useCallback(async () => {
    setHasError(false);
    try {
      const stripeData = await connectStripeAccountAsync({});
      //TODO: console logs for debugging purposes, it will be removed in production
      console.log("connect success", stripeData);

      const origin = window.location.origin;
      const fallbackPath = "/engineer/dashboard";
      const currentPath = window.location.pathname || fallbackPath;
      const routePath = currentPath.startsWith("/engineer")
        ? currentPath
        : fallbackPath;

      const returnUrl = origin + routePath;
      const refreshUrl = origin + routePath;

      const onboardingResp = await getOnboardingLinkAsync({
        body: { returnUrl, refreshUrl },
      });
      //TODO: console logs for debugging purposes, it will be removed in production
      console.log("onboardingResp", onboardingResp);
      
      const possibleUrl =
        typeof onboardingResp?.url === "string" && onboardingResp.url.trim()
          ? onboardingResp.url
          : null;

      let isValidUrl = false;
      if (possibleUrl) {
        try {
          const parsedUrl = new URL(possibleUrl);
          isValidUrl =
            parsedUrl.protocol === "https:" &&
            parsedUrl.hostname.endsWith("stripe.com");
        } catch {
          isValidUrl = false;
        }
      }

      if (!possibleUrl || !isValidUrl) {
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

  const BankSection = () => {
    return (
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current Balance
        </p>
        <div className="flex justify-between items-center">
          <p className="text-2xl md:text-3xl items-center font-extrabold text-gray-900 dark:text-white">
            <span>{formattedBalance}</span>
          </p>
          {!showBalance ? (
            <BsEyeFill
              className="cursor-pointer text-lg"
              onClick={() => setShowBalance(true)}
              role="button"
              aria-label="Show balance"
              tabIndex={0}
              onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowBalance((prev) => !prev);
                }
              }}
            />
          ) : (
            <BsEyeSlashFill
              className="cursor-pointer text-lg"
              onClick={() => setShowBalance(false)}
              role="button"
              aria-label="Hide balance"
              tabIndex={0}
              onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowBalance((prev) => !prev);
                }
              }}
            />
          )}
        </div>
        <div className="mt-4 flex flex-col items-end gap-2">
          {hasError && (
            <p className="text-sm text-red-500">
              Failed to initiate onboarding. Please try again.
            </p>
          )}
          <div className="flex gap-3 justify-end">
            {hasError ? (
              <Button
                onClick={() => void startStripeOnboarding()}
                className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2 rounded transition"
              >
                Retry
              </Button>
            ) : (
              <Button
                onClick={() => startStripeOnboarding()}
                className="px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition dark:bg-transparent dark:border dark:border-teal-600 dark:text-white"
              >
                {bankDetailsButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-[25%] ">
        <BankSection />
      </div>
      <div className="h-[75%] overflow-y-auto">
        <div className="pt-4">
          <TotalEarningsSummary />
        </div>
        <div className="pt-4">
          <TransactionDashboard
            onViewAllClick={() => {
              setActiveKey("engineerRecentTransactions");
            }}
          />
        </div>
        <div className="pt-4">
          <BestPayingJobs />
        </div>

        <div className="pt-4">
          <EarningHistoryChart />
        </div>
        <div className="pt-4">
          <MonthlyComparison />
        </div>
      </div>
    </div>
  );
};

export default MyEarning;
