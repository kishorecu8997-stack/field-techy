import { IoMdMail, IoLogoWhatsapp } from "react-icons/io";
import { MdLocalPhone } from "react-icons/md";
import {
  FaFacebook,
  FaInstagramSquare,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import ReportPage from "@/pages/engineer/report";
import { useState } from "react";
import { assetsConfig } from "@/assets";
import useDrawerStore from "../store/useDrawerStore";
import { scrollToTop } from "@/utils";
import IconWithTheme from "./IconWithTheme";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "./commonUI/LoaderComponent";

/**
 * Main footer component with company info, quick links, support options,
 * social media icons, and a report problem modal.
 * Fetches dynamic email and phone number from CMS content API.
 */
const Footer = () => {
  const [open, setOpen] = useState(false);
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  const location = useLocation();
  const isClient = location.pathname.includes("client");

  const {
    data: contactData,
    isLoading: contactLoading,
    error: contactError,
  } = useGetCmsContent("contact-info");

  const getContactInfo = () => {
  const defaultValues = {
    phone: "+971 4580 8119",
    email: "connect@fieldtechy.com",
    address:
      "Suite 302, Maple Leaf Building, Innovation District, Toronto, Canada",
    copyright: "Copyright © 2025 Field Techy | All Rights Reserved.",
  };

  if (
    contactData?.type === "contact-info" &&
    contactData?.data &&
    typeof contactData.data === "object" &&
    !Array.isArray(contactData.data)
  ) {
    return {
      phone: String((contactData.data as any).phone ?? defaultValues.phone),
      email: String((contactData.data as any).email ?? defaultValues.email),
      address: String((contactData.data as any).address ?? defaultValues.address),
      copyright: String((contactData.data as any).copyright ?? defaultValues.copyright),
    };
  }

  return defaultValues;
};
  const { phone, email, address, copyright } = getContactInfo();

  return (
    <footer className="bg-white dark:bg-gray-900 pt-12 pb-8 px-6 md:px-12 relative overflow-hidden text-gray-600 dark:text-gray-300">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="mb-6">
              <IconWithTheme
                darkLogo={assetsConfig.logos.ftLogoWhite}
                lightLogo={assetsConfig.logos.ftLogo}
                className="h-12 "
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              OUR ADDRESS
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {contactLoading ? (
                <span className="animate-pulse">
                  <LoaderComponent />
                </span>
              ) : contactError ? (
                <span className="text-red-500 text-sm">
                  Suite 302, Maple Leaf Building, Innovation District, Toronto,
                  Canada
                </span>
              ) : (
                address
              )}
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <IoMdMail className="w-5 h-5 mr-3 text-green-800 dark:text-green-500" />
                {contactLoading ? (
                  <span className="animate-pulse">
                    <LoaderComponent />
                  </span>
                ) : contactError ? (
                  <span className="text-red-500 text-sm">
                    connect@fieldtechy.com
                  </span>
                ) : (
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-green-800 dark:hover:text-green-500 transition-colors"
                  >
                    {email}
                  </a>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MdLocalPhone className="w-5 h-5 mr-3 text-green-800 dark:text-green-500" />
                {contactLoading ? (
                  <span className="animate-pulse">
                    <LoaderComponent />
                  </span>
                ) : contactError ? (
                  <span className="text-red-500 text-sm">+971 4580 8119</span>
                ) : (
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-green-800 dark:hover:text-green-500 transition-colors"
                  >
                    {phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              QUICK LINKS
            </h3>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to={
                    isClient
                      ? absoluteUrls.client.home.my_jobs
                      : absoluteUrls.engineer.home.my_jobs
                  }
                  onClick={() => scrollToTop()}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  My Jobs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={
                    isClient
                      ? absoluteUrls.client.home.client_Explore_engineers
                      : absoluteUrls.engineer.home.explore_jobs
                  }
                  onClick={() => scrollToTop()}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  {isClient ? "Explore Engineers" : "Explore Jobs"}
                </NavLink>
              </li>
              <li>
                <div
                  onClick={() => {
                    setActiveKey(isClient ? "clientWallet" : "myEarning");
                    setISOpenSidebar(true);
                  }}
                  className="text-gray-600 cursor-pointer dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  {isClient ? "My Wallet" : "My Earnings"}
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    setActiveKey(isClient ? "clientAccount" : "myAccount");
                    setISOpenSidebar(true);
                  }}
                  className="text-gray-600 cursor-pointer dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  My Account
                </div>
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
                <div
                  onClick={() => {
                    setActiveKey("contactUs");
                    setISOpenSidebar(true);
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors cursor-pointer"
                >
                  Contact Us
                </div>
              </li>
              <li>
                <NavLink
                  to={
                    isClient
                      ? absoluteUrls.client.home.faq
                      : absoluteUrls.engineer.home.faq
                  }
                  onClick={() => scrollToTop()}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={
                    isClient
                      ? absoluteUrls.client.home.terms_and_conditions
                      : absoluteUrls.engineer.home.terms_and_conditions
                  }
                  onClick={() => scrollToTop()}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                >
                  Terms & Conditions
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-gray-600 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-500 transition-colors"
                  to={
                    isClient
                      ? absoluteUrls.client.home.privacy_policy
                      : absoluteUrls.engineer.home.privacy_policy
                  }
                  onClick={() => scrollToTop()}
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 dark:text-gray-600 cursor-not-allowed pointer-events-none"
                >
                  Video Tutorials
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-500 mb-4 md:mb-0">
            {contactLoading ? (
              <span className="animate-pulse">
                <LoaderComponent />
              </span>
            ) : contactError ? (
              "Copyright © 2025 Field Techy | All Rights Reserved."
            ) : (
              copyright
            )}
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
