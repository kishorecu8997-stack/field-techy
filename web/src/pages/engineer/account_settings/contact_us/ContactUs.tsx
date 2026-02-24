import { icons } from "@/config/icons";
import Accordion from "./Accordion";
import ContactCard from "./ContactCard";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * Contact page featuring a header with a message icon and two expandable sections (Contact Us)
 * using an Accordion. Each section displays contact details via the ContactCard component.
 */

const ContactUs = () => {
  const {
    data: contactData,
    isLoading: contactLoading,
    error: contactError,
  } = useGetCmsContent("contact-info");

  const getContactItems = () => {
    let phone = "+91 12345 67890";
    let email = "support@field-techy.com";

    if (
      contactData?.type === "contact-info" &&
      contactData.data &&
      typeof contactData.data === "object" &&
      !Array.isArray(contactData.data)
    ) {
      if ("phone" in contactData.data && contactData.data.phone) {
        phone = String(contactData.data.phone);
      }
      if ("email" in contactData.data && contactData.data.email) {
        email = String(contactData.data.email);
      }
    }

    return [
      {
        id: "1",
        label: "Call",
        value: phone,
        icon: <icons.phone className="text-white" />,
      },
      {
        id: "2",
        label: "Email",
        value: email,
        icon: <icons.email className="text-white" />,
      },
    ];
  };

  const contactDetails = getContactItems();

  const sections = [
    {
      id: "1",
      label: "Contact Us",
      content: contactLoading ? (
        <div className="flex items-center justify-center p-4">
          <p className="text-gray-500">Loading contact details...</p>
        </div>
      ) : contactError ? (
        <div className="flex items-center justify-center p-4">
          <p className="text-red-500">
            Failed to load contact details. Using default.
          </p>
        </div>
      ) : (
        <ContactCard items={contactDetails} />
      ),
      icon: <icons.phone />,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="flex flex-col justify-center items-center py-5 gap-4">
        <div className="p-4 bg-teal-900 rounded-full">
          <icons.message className="h-8 w-8 text-gray-100" />
        </div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <div className="text-center">
          We’re here to support your job posting and hiring experience. How can
          we assist you today?
        </div>
      </div>

      <Accordion
        items={sections}
        className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
        titleClassName="text-gray-800"
        contentClassName="text-gray-600"
        iconPosition="right"
      />
    </div>
  );
};

export default ContactUs;
