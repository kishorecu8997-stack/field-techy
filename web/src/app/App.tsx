import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoute";
import OfflineBanner from "@/shared/components/commonUI/OfflineBanner";
import { useOfflineSync } from "@/offline/useOfflineSync";

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
  return(
    <>
      <OfflineBanner />
     <RouterProvider router={routes} /> 
     </>
  ) 
};

export default App;
