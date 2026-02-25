import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoute";
import OfflineBanner from "@/shared/components/commonUI/OfflineBanner";
import { useOfflineSync } from "@/offline/useOfflineSync";
import { useJobExpirationNotification } from "@/hooks/useJobExpirationNotifications";
import { steps } from "@/dummy_data/onBoardingData";
import { TourProvider } from "@reactour/tour";
import OnboardingFlowGuide from "@/pages/engineer/home/components/OnboardingFlowGuide";
import { useTokenExpiration } from "@/hooks/useTokenExpiration";
import { tourStyles } from "@/utils/styles";

/**
 * The main application component that sets up routing.
 *
 * Uses React Router's RouterProvider to provide routing
 * based on the `routes` configuration.
 *
 * @component
 * @returns {JSX.Element} The application with routing enabled.
 */
const App = () => {
  useOfflineSync();
  useJobExpirationNotification();
  useTokenExpiration();

  return (
    <>
      <TourProvider
        className="rounded-2xl"
        steps={steps}
        styles={tourStyles}
        ContentComponent={OnboardingFlowGuide}
        defaultOpen
      >
        <OfflineBanner />
        <RouterProvider router={routes} />
      </TourProvider>
    </>
  );
};
export default App;
