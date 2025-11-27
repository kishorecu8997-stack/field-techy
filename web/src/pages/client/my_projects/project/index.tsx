import React, { useState, useMemo } from "react";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import ProjectCard from "./ProjectCard";
import { projectData } from "@/dummy_data/client/myProject";
import type { Project } from "../types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { SORT_OPTIONS } from "@/pages/engineer/search_result/types";
import { NavLink, useNavigate } from "react-router-dom";
import { absoluteUrls} from "@/config/urls";

const MyProjects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const navigate = useNavigate();

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All") {
      return projectData as Project[];
    }
    return (projectData as Project[]).filter(
      (project) => project.status === activeFilter
    );
  }, [activeFilter]);
  const jobFilters = ["All", "In-Progress", "Completed"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="lg:col-span-2">
            <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
              <MyJobsHeader
                title="My Projects"
                currentSort={SORT_OPTIONS.NEWEST}
                onSortChange={() => {}}
              />
            </div>
          </div>
          <div className="space-y-6">
            <FilterButton
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filters={jobFilters}
            />
          </div>

          <div className="flex gap-8">
            <div className="md:w-9/12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((project) => (
                  <div
                    className=""
                    onClick={() =>
                      navigate(`${absoluteUrls.client.home.my_projects}/${project.id}`)
                    }
                  >
                    <ProjectCard key={project.id} project={project} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                  No jobs match the selected filter.
                </p>
              )}
            </div>
            {/* Sidecard */}
            <div className="md:w-3/12 lg:col-span-1">
              <div className="relative w-full rounded-xl bg-gradient-to-br from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-700 text-white p-5 shadow-sm overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full border-2 border-white"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-white"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white"></div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-lg font-bold mb-2">
                    Launch a New Project
                  </h2>
                  <p className="text-sm opacity-90 mb-4">
                    Define your scope, set your team, and keep everything
                    organized from day one!
                  </p>
                  <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <NavLink
                      // to={absoluteUrls.client.home.post_JobPage}
                      to=""
                    >
                      <div className="bg-[#c3ffef] text-[#333] hover:bg-emerald-200 font-medium py-2 px-4 rounded-full w-fit text-sm transition-colors duration-200">
                        Create Project
                      </div>
                    </NavLink>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
