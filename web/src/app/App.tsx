import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoute";
import LiveChatWidget from "@/shared/components/Support/LiveChatWidget";


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
  return (
    <>
      <RouterProvider router={routes} />
      <LiveChatWidget />
    </>
  );
};
export default App;
