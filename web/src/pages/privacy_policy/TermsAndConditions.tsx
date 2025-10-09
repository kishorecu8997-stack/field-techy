import MyJobsHeader from "@/shared/components/MyJobsHeader";

interface Section {
  title: string;
  content?: string; // optional
  items?: { title: string; description: string }[]; // optional
}

const TermsAndConditions = () => {
  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Terms & Conditions"
          currentSort="Newest"
          onSortChange={() => {}}
          isShowSort={false}
        />
        <div className=" mt-6">
          <FieldTechyInfoAndPolicy />
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

const FieldTechyInfoAndPolicy: React.FC = () => {
  const sections: Section[] = [
    // === FIELD TECHY INFO SECTION ===
    {
      title: "What is Field Techy",
      content:
        "Field Techy is your smart solution for hiring verified engineers on demand—whether you're managing personal IT issues at home or coordinating technical operations for your business.",
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

    {
      title: "Privacy Policy",
      content: `At Job Portal, found at https://jobportal.com/, we prioritize the privacy of our users. This Privacy Policy outlines the types of information we collect, how we record it, and the ways we utilize this data to enhance your experience. If you have any additional questions or require more details about our Privacy Policy, don't hesitate to reach out to us. We're here to help! This Privacy Policy applies exclusively to our online activities and is relevant for visitors to our website regarding the information they share and/or that we collect on Job Portal. It does not extend to any information gathered offline or through other channels.`,
    },
    {
      title: "Terms of Agreement",
      content:
        "By accessing our website, you agree to our Privacy Policy and accept its terms and conditions.",
    },
    {
      title: "Protection of Minors",
      content: `We are committed to protecting children while they explore the internet. We encourage parents and guardians to supervise, engage with, and guide their online activities. and we will take swift action to remove it from our records.`,
    },
    {
      title: "Job Posting and Hiring",
      content: `When posting a job, clients are required to provide clear, truthful, and lawful information about the task. Field Techy reserves the right to reject or remove job posts that violate our policies. Once a job is assigned to an engineer, you agree to communicate professionally and pay for completed milestones as outlined in the job scope.`,
    },
    {
      title: "Cancellations and Refunds",
      content: `We prioritize the safety of children as they navigate the online world. We strongly advise parents and guardians to monitor, interact with, and guide their children’s internet usage.Our Job Portal does not intentionally gather any personally identifiable information from children under the age of 13. If you suspect that your child has submitted such information on our platform, please reach out to us right away, and we will promptly take action to delete it from our records.`,
    },
    {
      title: "Privacy and Data Use",
      content: `We prioritize the safety of children as they navigate the online world. We strongly advise parents and guardians to monitor, interact with, and guide their children’s internet usage. Our Job Portal does not intentionally gather any personally identifiable information from children under the age of 13. If you suspect that your child has submitted such information on our platform, please reach out to us right away, and we will promptly take action to delete it from our records.`,
    },
  ];

  return (
    <div className=" p-6 w-full space-y-8 text-gray-700">
      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {section.title}
          </h2>

          {/* Render paragraph content if present */}
          {section.content && (
            <p className="mb-4 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          )}

          {/* Render bullet list if items exist */}
          {section.items && (
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    {item.title && <strong>{item.title}:</strong>}{" "}
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
