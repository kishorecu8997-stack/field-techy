// src/pages/JobDetailsPage.tsx
import { useParams } from "react-router-dom";
import MyJobsHeader from "./components/MyJobsHeader";

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();

  // Mock job data
  const job = {
    id: jobId || "4521454",
    title: "Mobile App UI/UX Designer and Product Designer",
    client: "TechNova Co",
    duration: "8 Hours of Work",
    status: "Job Completed",
    type: "On Site",
    createdDate: "10-Feb-2024, 09:00 AM",
    tentativeStart: "12-Feb-2024",
    tasks: [
      "Produce clean, efficient code; test and deploy program and systems",
      "Review feedback and make necessary adjustments by 15-Feb-2024",
      "Implementation phase begins on 16-Feb-2024",
      "Conduct user acceptance testing and finalize documentation",
      "Launch the project to users on 01-Mar-2024",
    ],
    files: ["File Documents.doc", "File Documents.doc", "Image Document.jpg"],
    payment: "$200.00",
    paymentType: "Fixed Price",
  };

  const client = {
    name: "TechNova Co",
    memberSince: "Dec 23, 2018",
    location: "United Kingdom",
    rating: "4.2/5.0",
    reviews: 23,
    verifications: [
      "Identity verified",
      "Payment Verified",
      "Deposit made",
      "Profile completed",
      "Phone verified",
      "Email Verified",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort="Newest"
          onSortChange={() => {}}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-teal-800 text-white p-5 rounded-xl shadow-md">
              <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  🕒 {job.duration}
                </span>
                <span>Client: {job.client}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="bg-teal-700/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                  {job.type}
                </span>
                <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium">
                  {job.status}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {[
                "Logs",
                "Work Submissions",
                "Job Information",
                "Requirements",
                "SPOC Details",
                "Other",
                "Proposal's Terms & Conditions",
              ].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    tab === "Job Information"
                      ? "bg-teal-800 text-white shadow-sm"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Job Info Section */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Angular Developer
              </h2>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                Job Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Created on {job.createdDate}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Tentative Start on: {job.tentativeStart}</span>
                </li>
                {job.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Attached Files
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                Payment Terms
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-teal-800 dark:text-teal-400">
                  {job.payment}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({job.paymentType})
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar: Client Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                About the Client
              </h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-800 dark:text-teal-400 text-xl">
                  🏢
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {client.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Member since {client.memberSince}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                  <span>📍</span>
                  <span>{client.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>⭐</span>
                  <span>
                    {client.rating} • {client.reviews} Reviews
                  </span>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Client Verification
              </h3>
              <ul className="space-y-1.5">
                {client.verifications.map((v, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;