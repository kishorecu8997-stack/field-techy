import MyJobsHeader from "@/shared/components/MyJobsHeader";
import React from "react";

const FAQ = () => {
  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="FAQ"
          onSortChange={() => {}}
          isShowSort={false}
        />
        <Info />
      </div>
    </div>
  );
};

export default FAQ;

interface Feature {
  title: string;
  description: string;
}

interface Section {
  title: string;
  items: Feature[];
}

const Info: React.FC = () => {
  const sections: Section[] = [
    {
      title: "What is Field Techy",
      items: [
        {
          title: "",
          description:
            "Field Techy is your smart solution for hiring verified engineers on demand—whether you're managing personal IT issues at home or coordinating technical operations for your business.",
        },
      ],
    },
    {
      title: "What You Can Do with Field Techy?",
      items: [
        {
          title: "Post Jobs Instantly",
          description:
            "Create job posts for remote or on-site tasks in just a few steps.",
        },
        {
          title: "Hire Verified Talent",
          description:
            "All engineers are identity-verified and skill-screened for quality.",
        },
        {
          title: "Track Progress in Real-Time",
          description:
            "Monitor job status, view engineer updates, and manage milestones.",
        },
        {
          title: "Communicate Seamlessly",
          description: "Chat, call, and share documents—all within the app.",
        },
        {
          title: "Pay Securely",
          description:
            "Funds are held in escrow and released only after your approval.",
        },
      ],
    },
    {
      title: "Who It’s For",
      items: [
        {
          title: "Home Clients",
          description:
            "Need one-time support for internet issues, installations, or device setup? We’ve got you.",
        },
        {
          title: "Corporate Clients",
          description:
            "Manage multi-location IT rollouts, staffing, and infrastructure projects with ease.",
        },
      ],
    },
    {
      title: "Security & Compliance",
      items: [
        {
          title: "End-to-end encryption",
          description: "for chats and payments",
        },
        {
          title: "GDPR & PCI-DSS compliant",
          description: "",
        },
        {
          title: "Verified engineer identity",
          description: "and document checks",
        },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-8 text-gray-700 dark:text-gray-500">
      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-300">
            {section.title}
          </h2>
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start mb-3">
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <div>
                {item.title && <strong>{item.title}:</strong>}{" "}
                {item.description}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
