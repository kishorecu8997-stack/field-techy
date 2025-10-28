import Header from "@/shared/components/client/Header";
import JobPostForm from "./components/JobPostForm";
import SidebarJobPostWallet from "@/shared/components/client/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";

const PostJob = () => {
  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - spans 2 columns on lg */}
          <div className="lg:col-span-2">
            <div className="sticky top-[80px] z-10 bg-gray-50 dark:bg-gray-900">
              <Header title="Post Job" currentPath="Post A Job" showSearchBar={false}/>
            </div>
            <div className="space-y-10">
              <JobPostForm />
            </div>
          </div>

          {/* Sidebar - takes 1 column on lg */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData}  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
