import Footer from "@/pages/ft_landing/components/Footer";
import Header from "@/pages/ft_landing/components/Header";
import { Outlet } from "react-router-dom";

/**
 * FTLayout component for the homepage.
 *
 * @returns {JSX.Element} The rendered FTLayout component.
 */
const FTLayout = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-screen overflow-y-auto text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      <Header />

      {/* Do NOT add container here */}
      <main className="flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default FTLayout;
