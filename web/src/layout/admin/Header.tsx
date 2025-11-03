import { assetsConfig } from "@/assets";
import { useState } from "react";
import { BsChevronDown, BsTextLeft } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: NavbarProps) {
  const [region, setRegion] = useState("Select Region");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="text-white px-4 sm:px-6 py-2 shadow-lg flex justify-between items-center"
      style={{
        background: "linear-gradient(to right, #034444, #014d45)",
      }}
    >
      <div className="flex items-center space-x-4">
        <Link to="/admin" className="">
          <img
            src={assetsConfig.logos.ftLogoWhite}
            alt="FT Logo"
            className="w-auto"
          />
        </Link>
        <BsTextLeft
          onClick={onToggleSidebar}
          className="text-xl cursor-pointer"
        />

        {/* Hamburger Button - Mobile Only */}
        {/* <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-md hover:bg-emerald-800 transition"
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button> */}
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-white cursor-pointer text-[#8390a2] px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-0 appearance-none pr-8"
          >
            <option value="">Select Region</option>
            <option value="US">United States</option>
            <option value="EU">Europe</option>
            <option value="AS">Asia</option>
            <option value="CA">Canada</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
            <BsChevronDown />
          </div>
        </div>

        <div className="text-xl cursor-pointer">
          <FaRegBell />
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-800">K</span>
          </div>

          <div className="hidden sm:block">
            <div className="font-semibold text-md">Kevin Smith</div>
            <div className="text-xs text-gray-300">Admin</div>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-64 h-full bg-emerald-900 p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">FT</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md hover:bg-emerald-800"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="space-y-4">
              <Link
                to="/"
                className="block px-3 py-2 rounded hover:bg-emerald-800 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/manage-engineer"
                className="block px-3 py-2 rounded hover:bg-emerald-800 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Engineer
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded hover:bg-emerald-800 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-emerald-800 text-red-400 transition">
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
