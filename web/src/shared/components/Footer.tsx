import { IoMdMail } from "react-icons/io";
import { MdLocalPhone } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import logo from "../../assets/logo_small.svg";

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-8 px-6 md:px-12 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Company Info */}
          <div className="md:w-1/3">
            <div className="mb-6">
              <img
                src={logo}
                alt="Field Techy Logo"
                className="h-12 w-auto"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              OUR ADDRESS
            </h3>
            <p className="text-gray-600 mb-4">
              Suite 302, Maple Leaf Building, Innovation District, Toronto,
              Canada
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <IoMdMail className="w-5 h-5 mr-3 text-green-800" />
                connect@fieldtechy.com
              </div>
              <div className="flex items-center text-gray-600">
                <MdLocalPhone className="w-5 h-5 mr-3 text-green-800" />
                +971 4580 8119
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              QUICK LINKS
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  My Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  Explore Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  My Earning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  My Account
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              SUPPORT
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  Report A Problem
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            Copyright © 2025 Field Techy | All Rights Reserved.
          </p>

          <div className="flex space-x-4">
            {/* WhatsApp */}
            <a
              href="#"
             className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition-colors"
            >
              <IoLogoWhatsapp className="w-4 h-4" />
            </a>

            {/* Facebook */}
            <a
              href="#"
            className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition-colors"
            >
              <FaFacebook className="w-4 h-4" />
            </a>

            {/* Instagram */}
            <a
              href="#"
             className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition-colors"
            >
              <FaInstagramSquare />
            </a>

            {/* Twitter */}
            <a
              href="#"
             className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition-colors"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
             <a
              href="#"
              className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white hover:bg-teal-800 transition-colors"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
