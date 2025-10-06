import { useState, useEffect, type JSX } from "react";
import { Outlet } from "react-router-dom";
import Drawer from "@/shared/components/Drawer";
import Navbar from "@/shared/components/Navbar";

const RootLayout = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white dark:bg-gray-800 shadow-sm"
            : "bg-transparent dark:bg-transparent shadow-none"
        }`}
      >
        <div className="xl:container mx-auto px-6">
          <Navbar
            onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
            isDrawerOpen={isDrawerOpen}
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-4">
        <Outlet />
      </main>

      <footer className="bg-teal-900 text-white py-12 mt-12">
        <div className="container mx-auto px-6 flex flex-wrap justify-between">
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-4">Finding a Job is Easy</h2>
            <div className="mt-6 max-w-prose">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-center h-fit gap-3">
            <label className="text-md text-white">Email Address</label>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="px-4 py-2 rounded-l-full focus:outline-none text-white bg-transparent border border-gray-300"
              />
              <button className="bg-teal-500 px-6 py-2 rounded-r-full font-medium border border-gray-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default RootLayout;
