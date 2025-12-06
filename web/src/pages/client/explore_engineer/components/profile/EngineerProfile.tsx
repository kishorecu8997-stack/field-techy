import React from "react";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import EngineerProfileCard from "./EngineerProfileCard";
import dummyProfiles from "@/dummy_data/engineerProfileCardData";
import CategoryTag from "@/shared/components/CategoryTag";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import ClientHeader from "@/shared/components/ClientHeader";
import InformationCard from "@/shared/components/InformationCard";
import informationCards from "@/dummy_data/informationCardData";
import {
  categoriesSkills,
  categoriesTools,
  portfoloioLink,
} from "@/dummy_data/categoryTagData";
import InformationCardTools from "@/shared/components/InformationCardTools";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { SORT_OPTIONS } from "@/pages/client/search_result/types";

const portfolioLink = portfoloioLink;

/**
 * A page component that displays a detailed profile of an engineer.
 * It aggregates various components like `EngineerProfileCard`, `CategoryTag`,
 * `InformationCard`, and `SidebarJobPostWallet` to build the page layout.
 * The data is currently sourced from dummy data files.
 *
 * @returns {React.ReactElement} A React functional component that renders the engineer's profile page.
 */
const EngineerProfile: React.FC = () => {
  const navigate = useNavigate();
  const handleInviteClick = () => {
    navigate(absoluteUrls.client.home.ClientJobInvite);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 ">
          <div className="w-full sticky top-16 z-10 ">
          <MyJobsHeader
            title="Explore Engineers"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowBreadcrumb={false}
            description={`10 jobs found`} // ✅ Updated count
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
              <div className="max-w-4xl mx-auto">
                <EngineerProfileCard
                  profile={dummyProfiles[0]}
                  onInviteClick={handleInviteClick}
                />
              </div>
              <div className="mt-8">
                <CategoryTag
                  category={categoriesSkills}
                  label="Skills Required"
                  isShowLabel
                  required
                />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Portfolio Link:
                  <a
                    href={portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-4 py-2 bg-green-75 dark:bg-gray-800 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-full hover:underline"
                  >
                    {portfolioLink}
                  </a>
                </h3>
              </div>
              <div className="mt-8">
                {informationCards.map((card, index) => (
                  <InformationCard key={index} {...card} />
                ))}
              </div>
              <div className="mt-8">
                <InformationCardTools
                  title="Tools Required"
                  description="Tools Required"
                  category={categoriesTools}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerProfile;
