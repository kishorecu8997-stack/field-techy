import { absoluteUrls } from "@/config/urls";
import { earningsData } from "@/dummy_data/jobDetails";
import { SORT_OPTIONS } from "@/pages/client/search_result/types";
import CategoryTag from "@/shared/components/CategoryTag";
import InformationCard from "@/shared/components/InformationCard";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EngineerProfileCard from "./EngineerProfileCard";
import { useQuery } from "@tanstack/react-query";
import { clientGetPublicEngineerProfileOptions } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";
import { Button } from "@/shared/components/commonUI/Buttons";

// will read portfolio link from API response

/**
 * EngineerProfile fetches a public engineer profile by id and renders details.
 */
const EngineerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const engineerId = Number(id);

  const { data, isLoading, error } = useQuery({
    ...clientGetPublicEngineerProfileOptions({
      client: apiClient,
      path: { id: engineerId },
    }),
    enabled: !!engineerId,
  });

  const handleInviteClick = () => {
    if (data?.userId) {
      navigate(`${absoluteUrls.client.home.ClientJobInvite}/${data.userId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[30rem] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading engineer details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="w-full sticky top-16 z-10 bg-gray-50 dark:bg-gray-900">
            <MyJobsHeader
              title="Explore Engineers"
              currentSort={SORT_OPTIONS.NEWEST}
              isShowBreadcrumb={false}
              description="Engineer not found"
            />
          </div>
          <div className="flex items-center justify-center min-h-[40rem]">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                Engineer profile not found or unavailable.
              </p>
              <Button
                onClick={() => navigate(absoluteUrls.client.home.client_Explore_engineers)}
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Back to Explore Engineers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profile = {
    name: data.name,
    rating: Number(data.averageRating ?? 0),
    reviewCount: data.reviewCount ?? 0,
    jobTitle: data.currentDesignation ?? data.serviceCategoryName ?? "",
    location: data.location ?? "",
    imageUrl: data.profilePictureUrl ?? "",
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 ">
        <div className="w-full sticky top-16 z-10 ">
          <MyJobsHeader
            title="Explore Engineers"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowBreadcrumb={false}
            description={`${profile.name} - ${profile.jobTitle}`}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
              <div className="max-w-4xl mx-auto">
                <EngineerProfileCard profile={profile} onInviteClick={handleInviteClick} />
              </div>

              {/* Skills */}
              {data.skills && data.skills.length > 0 && (
                <div className="mt-8">
                  <CategoryTag
                    category={data.skills}
                    label="Skills"
                    isShowLabel
                    required
                  />
                </div>
              )}

              {/* Tools */}
              {data.tools && data.tools.length > 0 && (
                <div className="mt-8">
                  <CategoryTag
                    category={data.tools}
                    label="Tools"
                    isShowLabel
                    required
                  />
                </div>
              )}

              {/* Portfolio Link */}
              {data.portfolioLink && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Portfolio
                  </h3>
                  <a
                    href={data.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 dark:text-teal-400 hover:underline break-all"
                  >
                    {data.portfolioLink}
                  </a>
                </div>
              )}

              {data.education && data.education.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Education
                  </h3>
                  {data.education.map((edu, idx) => (
                    <InformationCard
                      key={idx}
                      title={edu.degree}
                      description={edu.university}
                      details={[
                        { label: "Major", value: edu.major },
                        { label: "Passing Year", value: String(edu.passingYear) },
                      ]}
                    />
                  ))}
                </div>
              )}

              {data.experience && data.experience.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Experience
                  </h3>
                  {data.experience.map((exp, idx) => (
                    <InformationCard
                      key={idx}
                      title={exp.role ?? ""}
                      description={exp.company ?? ""}
                      details={[
                        { label: "Location", value: exp.location ?? "" },
                        { label: "Period", value: `${exp.startDate ?? ""} - ${exp.endDate ?? ""}` },
                      ]}
                    />
                  ))}
                </div>
              )}
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
