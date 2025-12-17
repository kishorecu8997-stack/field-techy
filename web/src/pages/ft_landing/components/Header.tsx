import { assetsConfig } from "@/assets";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-10 bg-[#024e51] text-white border-b border-[#026e71]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div>
            <Link to="/landing">
              <img
                src={assetsConfig.logos.ftLogoWhite}
                alt="FT Logo"
                className="w-auto h-8"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link to="" className="hover:text-[#95cc5c]">
              Home
            </Link>
            <Link to="" className="hover:text-[#95cc5c]">
              Overview
            </Link>
            <Link to="" className="hover:text-[#95cc5c]">
              How It Works
            </Link>
            <Link to="" className="hover:text-[#95cc5c]">
              Features
            </Link>
            <div className="bg-[#95cc5c] cursor-pointer text-black px-6 py-2 rounded-full font-medium hover:bg-[#85b850] w-fit">
              Login for
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {!isMenuOpen ? (
              <LuMenu className="h-6 w-6" />
            ) : (
              <IoClose className="h-6 w-6" />
            )}
          </div>
        </div>

        {/* Mobile Menu - only shown when open */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#026e71]">
            <div className="flex flex-col space-y-4 text-sm">
              <Link
                to=""
                className="hover:text-[#95cc5c]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to=""
                className="hover:text-[#95cc5c]"
                onClick={() => setIsMenuOpen(false)}
              >
                Overview
              </Link>
              <Link
                to=""
                className="hover:text-[#95cc5c]"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to=""
                className="hover:text-[#95cc5c]"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <div className="font-medium">Login For</div>
              <Link
                to=""
                className="bg-[#95cc5c] text-black px-4 py-2 rounded-full font-medium text-center w-fit mx-auto hover:bg-[#85b850]"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
