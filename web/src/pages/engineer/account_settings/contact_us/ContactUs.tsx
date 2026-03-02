import { icons } from "@/config/icons";
import Accordion from "./Accordion";
import ContactCard from "./ContactCard";
import { useGetCmsContent } from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * Contact page featuring a header with a message icon and an expandable "Contact Us" section
 * using an Accordion. The section displays contact details via the ContactCard component.
 */
const ContactUs = () => {
  const {
    data: contactData,
    isLoading: contactLoading,
    error: contactError,
    refetch,
  } = useGetCmsContent("contact-info", {
    enabled: true,
    refetchInterval: () =>
      document.visibilityState === "visible" ? 15000 : false,
  });

  const getContactItems = () => {
    if (
      contactData?.type === "contact-info" &&
      contactData.data &&
      typeof contactData.data === "object" &&
      !Array.isArray(contactData.data)
    ) {
      return [
        {
          id: "1",
          label: "Call",
          value: String(contactData.data.phone || ""),
          icon: <icons.phone className="text-white" />,
        },
        {
          id: "2",
          label: "Email",
          value: String(contactData.data.email || ""),
          icon: <icons.email className="text-white" />,
        },
      ];
    }

    return [];
  };

  const contactDetails = getContactItems();

  const sections = [
    {
      id: "1",
      label: "Contact Us",
      content: contactLoading ? (
        <div className="flex items-center justify-center min-h-[120px] py-8">
          <LoaderComponent />
        </div>
      ) : contactError ? (
        <div className="p-6 text-center space-y-4">
          <p className="text-red-600 font-medium">
            We’re currently experiencing technical issues.
            <br />
            Please try again.
          </p>

          <Button
            onClick={() => refetch()}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <ContactCard items={contactDetails} />
      ),
      icon: <icons.phone />,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col justify-center items-center py-8 gap-5">
        <div className="p-5 bg-teal-900 rounded-full shadow-md">
          <icons.message className="h-10 w-10 text-gray-100" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 max-w-lg">
          We’re here to support your job posting and hiring experience.
          <br />
          How can we assist you today?
        </p>
      </div>

      <Accordion
        items={sections}
        className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800"
        titleClassName="text-gray-800 dark:text-gray-200 font-medium"
        contentClassName="text-gray-600 dark:text-gray-300"
        iconPosition="right"
      />
    </div>
  );
};

export default ContactUs;