import Footer from "@/shared/components/Footer";
import NavbarClient from "@/shared/components/NavbarClient";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEffect, useState, type JSX } from "react";
import { Outlet } from "react-router-dom";

/**
 * Root layout component that wraps all authenticated/engineer-facing pages.
 * Provides a consistent structure including:
 * - A sticky header with scroll-aware styling (transparent on top, solid when scrolled)
 * - A responsive navigation bar with mobile drawer toggle
 * - Main content area via React Router's `<Outlet />`
 * - Custom footer section followed by a shared `<Footer />` component
 * - A side drawer for mobile navigation
 *
 * Uses `useEffect` to listen for scroll events and dynamically update header appearance.
 * Optimized with passive event listener for scroll performance.
 *
 * @returns {JSX.Element} The complete page layout with header, main content, and footer.
 *
 * @example
 * <RootLayout>
 *   <MyJobsPage />
 * </RootLayout>
 */
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useFCM } from "@/shared/hooks/useFCM";

const ClientLayout = (): JSX.Element => {
  const { setActiveKey, setISOpenSidebar, isOpenSidebar } = useDrawerStore();
  const [isScrolled, setIsScrolled] = useState(false);

  const { checkPermission: checkLocationPermission } = useGeolocation();
  const { checkPermission: checkNotificationPermission } = useFCM();

  useEffect(() => {
    checkLocationPermission();
    checkNotificationPermission();
  }, [checkLocationPermission, checkNotificationPermission]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <header
          className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
              ? "bg-white dark:bg-gray-800 shadow-sm"
              : "bg-transparent dark:bg-transparent shadow-none"
            }`}
        >
          <div className="xl:container mx-auto px-6">
            <NavbarClient
              onDrawerToggle={() => {
                if (isOpenSidebar) {
                  localStorage.removeItem("projectSiteCoordinates");
                }
                setISOpenSidebar(!isOpenSidebar);
                setActiveKey("myAccount");
              }}
              isDrawerOpen={isOpenSidebar}
            />
          </div>
        </header>

        <main className="flex-1 container mx-auto px-6 py-4">
          <Outlet />
        </main>

        <footer className="bg-teal-900 text-white py-12 mt-12">
          <div className="container mx-auto px-6 flex flex-wrap justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Finding a Job is Easy</h2>
              <div className="mt-6 max-w-prose">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </div>
            </div>
          </div>
        </footer>
        <Footer />
      </div>
    </>
  );
};

export default ClientLayout;
