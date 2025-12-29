import Tooltip from "@/shared/components/Tooltip";

/**
 * Navigation component for the main navigation bar.
 * Displays links to My Jobs, Explore Jobs, and Help & Support.
 */
const Navigation = () => {
  return (
    <nav className="flex gap-6 bg-white p-4 shadow">
      <Tooltip text="View all jobs you applied for or are assigned to">
        <a href="/my-jobs" className="hover:text-teal-600">My Jobs</a>
      </Tooltip>

      <Tooltip text="Browse available jobs based on your skills">
        <a href="/explore-jobs" className="hover:text-teal-600">Explore Jobs</a>
      </Tooltip>

      <Tooltip text="Click here to access FAQs or chat with support">
        <a href="/support" className="hover:text-teal-600">Help & Support</a>
      </Tooltip>
    </nav>
  );
};

export default Navigation;
