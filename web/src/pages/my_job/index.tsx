// src/pages/MyJobsPage.tsx
import MyJobsHeader from "../../shared/components/MyJobsHeader";
import JobList from "./my_job_components/JobList";
import SidebarProfile from "./my_job_components/SidebarProfile";

const MyJobsPage = () => {
  const userData = {
    name: "Michel Brown",
    phone: "+91 74582405XX",
    role: "Software Engineer",
    profileCompletion: 39,
  };

  const earningsData = {
    balance: 8250.56,
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort="Newest"
          onSortChange={() => {}}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <JobList />
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarProfile user={userData} earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
