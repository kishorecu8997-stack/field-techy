import { IoMdMail } from "react-icons/io";
import { MdLocalPhone } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import ReportPage from "@/pages/report";
import { useState } from "react";
import { assetsConfig } from "@/assets";

/**
 * Main footer component with company info, quick links, support options,
 * social media icons, and a report problem modal.
 */
const Footer = () => {
  const [open, setOpen] = useState(false);
  return (
    <footer className="bg-white dark:bg-gray-900 pt-12 pb-8 px-6 md:px-12 relative overflow-hidden text-gray-600 dark:text-gray-300">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="mb-6">
              <img src={assetsConfig.logos.ftLogo} alt="Field Techy Logo" className="h-12 w-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              OUR ADDRESS
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Suite 302, Maple Leaf Building, Innovation District, Toronto,
              Canada
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <IoMdMail className="w-5 h-5 mr-3 text-green-800 dark:text-green-500" />
                connect@fieldtechy.com
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MdLocalPhone className="w-5 h-5 mr-3 text-green-800 dark:text-green-500" />
                +971 4580 8119
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              QUICK LINKS
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  My Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  Explore Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  My Earning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  My Account
                </a>
              </li>
            </ul>
          </div>

          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              SUPPORT
            </h3>
            <ul className="space-y-4">
              <li>
                <div
                onClick={() => setOpen(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors cursor-pointer"
                >
                  Report A Problem
                </div>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <NavLink
                  to={absoluteUrls.engineer.home.faq}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={absoluteUrls.engineer.home.terms_and_conditions}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  Terms & Conditions
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                  to={absoluteUrls.engineer.home.privacy_policy}
                >
                  Privacy Policy
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-500 mb-4 md:mb-0">
            Copyright © 2025 Field Techy | All Rights Reserved.
          </p>

          <div className="flex space-x-4">
            {[
              { Icon: IoLogoWhatsapp, href: "#" },
              { Icon: FaFacebook, href: "#" },
              { Icon: FaInstagramSquare, href: "#" },
              { Icon: FaTwitter, href: "#" },
              { Icon: FaLinkedin, href: "#" },
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <ReportPage open={open} onClose={() => setOpen(false)} />
    </footer>
  );
};

export default Footer;
