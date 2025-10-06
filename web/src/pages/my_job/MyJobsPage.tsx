// src/pages/MyJobsPage.tsx
import JobCard from "@/shared/components/commonUI/JobCard";
import MyJobsHeader from "./components/MyJobsHeader";
import SidebarProfile from "./components/SidebarProfile";

const MyJobsPage = () => {
  const jobs = [
    {
      id: "1",
      title: "Install Security System at Client.",
      client: "SafeHomes Inc.",
      startDate: "May 28, 2025, 10:00 AM",
      duration: "8 Hours of Work",
      location: "San Francisco, CA",
      pay: "$400",
      status: "Completed" as const,
      type: "On Site" as const,
    },
    {
      id: "2",
      title: "Mobile App UI/UX Designer and Product Designer",
      client: "SafeHomes Inc.",
      startDate: "May 28, 2025, 10:00 AM",
      duration: "8 Hours of Work",
      location: "San Francisco, CA",
      pay: "$400",
      status: "Applied" as const,
      type: "Remote" as const,
    },
    {
      id: "3",
      title: "Mobile App UI/UX Designer and Product Designer",
      client: "SafeHomes Inc.",
      startDate: "May 28, 2025, 10:00 AM",
      duration: "8 Hours of Work",
      location: "San Francisco, CA",
      pay: "$400",
      status: "In-Progress" as const,
      type: "Remote" as const,
    },
    {
      id: "4",
      title: "Install Security System at Client.",
      client: "SafeHomes Inc.",
      startDate: "May 28, 2025, 10:00 AM",
      duration: "8 Hours of Work",
      location: "San Francisco, CA",
      pay: "$400",
      status: "Completed" as const,
      type: "On Site" as const,
    },
  ];

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort="Newest"
          onSortChange={() => {}}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Job Cards Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} {...job} />)
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                  No jobs found.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;