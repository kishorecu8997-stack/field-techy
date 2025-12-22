import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoute";

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
    </>
  );
};
export default App;
