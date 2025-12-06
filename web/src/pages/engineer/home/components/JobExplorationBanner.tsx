import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Job Exploration Banner Component
 *
 * A promotional banner encouraging users to explore job opportunities by sending smarter proposals.
 * Features a call-to-action button and an illustrative image of a professional with a laptop.
 *
 * @component
 * @example
 * return <JobExplorationBanner />
 */
const JobExplorationBanner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-emerald-900 px-4 md:px-6 text-white">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg space-y-2 py-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Explore Jobs
          </h2>
          <h1 className="text-xl font-bold md:text-2xl">
            Send smarter proposals, land better jobs
          </h1>
          <p className="text-xs md:text-sm">
            Write effective proposals and showcase your expertise to increase
            selection chances. Add portfolio links, certifications, and past
            work for better impact.
          </p>
          <Button
            className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={() => navigate(absoluteUrls.engineer.home.explore_jobs)}
          >
            Explore Jobs
          </Button>
        </div>

        <div className="relative mt-4 md:mt-0 hidden lg:block">
          <img
            src={assetsConfig.images.dashboard.attachment}
            alt="Professional woman holding laptop"
            className="rounded-lg "
          />
        </div>
      </div>
    </div>
  );
};

export default JobExplorationBanner;
