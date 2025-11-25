// src/components/TalentSeekerCard.tsx

import { absoluteUrls } from "@/config/urls";
import { NavLink } from "react-router-dom";
import { Button } from "./commonUI/Buttons";

export const TalentSeekerCard = () => {
  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-700 text-white p-5 shadow-sm overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full border-2 border-white"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-white"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-lg font-bold mb-2">Looking for Talent?</h2>
        <p className="text-sm opacity-90 mb-4">
          Post your job opportunity and effortlessly engage with skilled professionals!
        </p>
        <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <NavLink
            to={absoluteUrls.client.home.post_JobPage}
            className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
          >
            <Button
              className="bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-medium py-2 px-4 rounded-2xl text-sm transition-colors duration-200"
            >
              Post A Job
            </Button>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};