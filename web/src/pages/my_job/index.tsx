import MyJobLayout from "@/layout/MyJobLayout";
import { useState } from "react";
import MyJobsHeader from "./components/MyJobsHeader";
import UserSection from "./components/UserSection";

/**
 * App Component
 * Root component that renders the MyJobsHeader with state management.
 *
 * @returns {JSX.Element} Rendered application
 */
const MyJobs = () => {
  const [currentSort, setCurrentSort] = useState<string>("Newest");

  return (
    <div className="w-full">
      <MyJobLayout
        leftPanelContent={
          <MyJobsHeader
            title="My Jobs"
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
        }
        rightPanelContent={<UserSection />}
      />
    </div>
  );
};

export default MyJobs;
