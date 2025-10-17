import { icons } from "@/config/icons";
import Accordion from "./Accordion";
import ContactCard from "./ContactCard";

const contactDetails = [
  { id: "1", label: "Call", value: "+91 12345 67890", icon: <icons.phone className="text-white"/> },
  {
    id: "2",
    label: "Email",
    value: "support@field-techy.com",
    icon: <icons.email className="text-white"/>,
  },
];
const supportDetails = [
  {
    id: "1",
    label: "Support",
    value: "+91 12345 67890",
    icon: <icons.phone className="text-white"/>,
  },
  {
    id: "2",
    label: "Email",
    value: "support@field-techy.com",
    icon: <icons.email className="text-white"/>,
  },
];

const ContactUs = () => {
  const sections = [
    {
      id: "1",
      label: "Contact Us",
      content: <ContactCard items={contactDetails} />,
      icon: <icons.phone />,
    },
    {
      id: "2",
      label: "Support",
      icon: <icons.headset />,
      content: <ContactCard items={supportDetails} />,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="flex flex-col justify-center items-center py-5 gap-4">
        <div className="p-4 bg-teal-900 rounded-full" > 
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
