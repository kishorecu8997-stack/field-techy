import AdminTabComponent from "@/shared/components/AdminTabComponent";
import CMSLegal from "./Legal";
import CMSPrivacyPolicy from "./CmsPrivacyPolicy";
import Faq from "./Faq";
import TermsAndCondition from "./TermsAndCondition";
import CustomerPrivacyPolicy from "./CustomerPrivacyPolicy";
import AboutUs from "./AboutUs";
import ContactSupport from "./ContactSupport";
import DataDeletionPolicy from "./DataDeletionPolicy";

/**
 * @component ManageCMS
 * @description This component serves as the main container for the Content Management System (CMS) section.
 * It organizes various CMS-related pages into a tabbed interface using the `AdminTabComponent`.
 * Each tab corresponds to a specific area of content management like Contact Support, Legal, FAQ, etc.
 *
 * @returns {JSX.Element} The rendered CMS management page with tabs.
 *
 * @example
 * return <ManageCMS />;
 */
export default function ManageCMS() {
  const tabs = [
    {
      label: "Contact Support",
      content: <ContactSupport />,
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
      label: "Data Deletion Policy",
      content: <DataDeletionPolicy />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full p-4 flex flex-col overflow-hidden">
      <div className="flex justify-between shrink-0">
        <p className="mt-2 mb-6 font-semibold">Manage CMS</p>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 flex-1 flex flex-col overflow-hidden">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Contact Support" />
      </div>
    </div>
  );
}
