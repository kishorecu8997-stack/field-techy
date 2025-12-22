import { assetsConfig } from "@/assets";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import UserTypeDropdown from "./UserTypeSelector";

/**
 * Header component for the homepage.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginFor, setIsLoginFor] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoginFor) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsLoginFor(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoginFor]);

  return (
    <header className="fixed w-full z-20 bg-[#024e51] text-white border-b border-[#026e71]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div>
            <a href="/landing">
              <img
                src={assetsConfig.logos.ftLogoWhite}
                alt="FT Logo"
                className="w-auto h-8"
              />
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <a href="#home" className="hover:text-[#95cc5c]">
              Home
            </a>
            <a href="#overview" className="hover:text-[#95cc5c]">
              Overview
            </a>
            <a href="#How_it_works" className="hover:text-[#95cc5c]">
              How It Works
            </a>
            <a href="#key_features" className="hover:text-[#95cc5c]">
              Features
            </a>

            {/*Attach ref to trigger */}
            <div
              ref={triggerRef}
              onClick={() => setIsLoginFor(!isLoginFor)}
              className="bg-[#95cc5c] flex items-center cursor-pointer text-black px-6 py-2 rounded-full font-medium hover:bg-[#85b850] w-fit"
            >
              Login for
              <MdKeyboardArrowDown
                className={`${
                  isLoginFor ? "rotate-180 text-xl" : "text-xl"
                } "ml-1" `}
              />
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#026e71]">
            <div className="flex flex-col space-y-4 text-sm">
              <a href="#home" onClick={() => setIsMenuOpen(false)}>
                Home
              </a>
              <a href="#overview" onClick={() => setIsMenuOpen(false)}>
                Overview
              </a>
              <a href="#How_it_works" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#key_features" onClick={() => setIsMenuOpen(false)}>
                Features
              </a>
              <div
                className="font-medium flex gap-1 items-center"
                ref={triggerRef}
                onClick={() => setIsLoginFor(!isLoginFor)}
              >
                Login For{" "}
                <MdKeyboardArrowDown
                  className={`${
                    isLoginFor ? "rotate-180 text-xl" : "text-xl"
                  } "ml-1" `}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoginFor && (
        <UserTypeDropdown
          ref={dropdownRef}
          title="Select Account Type"
          selected={selectedUserType}
          options={[
            {
              id: "corporate",
              title: "For Corporates",
              description: "Manage multi-site projects and teams.",
            },
            {
              id: "engineer",
              title: "For Engineers",
              description: "Find jobs and manage your earnings.",
            },
            {
              id: "home-client",
              title: "For Home Clients",
              description: "Book verified engineers for home tasks.",
            },
          ]}
          onSelect={(id: string) => setSelectedUserType(id)}
          onClose={() => setIsLoginFor(false)}
        />
      )}
    </header>
  );
}
