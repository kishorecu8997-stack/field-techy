"use client";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import CMSLegal from "./Legal";
import CMSPrivacyPolicy from "./CmsPrivacyPolicy";
import Faq from "./Faq";
import TermsAndCondition from "./TermsAndCondition";
import CustomerPrivacyPolicy from "./CustomerPrivacyPolicy";
import AboutUs from "./AboutUs";
import DataDelectionPolicy from "./DataDelectionPolicy";

/**
 * ManageCMS Component
 *
 * Renders a simple CMS management editor that uses a custom Quill text editor hook (`useQuillEditor`).
 * Users can edit HTML content directly in the editor and save (or preview) the current content value.
 *
 * @component
 * @example
 * return (
 *   <ManageCMS />
 * );
 *
 * @returns {JSX.Element} The rendered ManageCMS component.
 */
export default function ManageCMS() {
  const tabs = [
    {
      label: "Contact Support",
      content: "contact",
      hide: false,
    },
    {
      label: "Legal",
      content: <CMSLegal />,
      hide: false,
    },
    {
      label: "Privacy Policy",
      content: <CMSPrivacyPolicy />,
      hide: false,
    },
    {
      label: "FAQ",
      content: <Faq />,
      hide: false,
    },
    {
      label: "Terms And Condition",
      content: <TermsAndCondition />,
      hide: false,
    },
    {
      label: "Customer Privacy Policy",
      content: <CustomerPrivacyPolicy />,
      hide: false,
    },
    {
      label: "About Us",
      content: <AboutUs />,
      hide: false,
    },
    {
      label: "Data Delection Policy",
      content: <DataDelectionPolicy />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Manage CMS</p>
        <Button
          type="submit"
          className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Contact Support" />
      </div>
    </div>
  );
}
