import { absoluteUrls } from "@/config/urls";
import {
  initialSites,
  projectData,
  projectMembers,
} from "@/dummy_data/client/myProject";
import { SORT_OPTIONS } from "@/pages/engineer/search_result/types";
import ClientInterviewerSection from "@/shared/components/ClientInterviewerSection";
import { Button } from "@/shared/components/commonUI/Buttons";
import MapSearch from "@/shared/components/MapWithSearch";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import dayjs from "dayjs";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProjectInfoCard from "./ProjectInfoCard";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [members, setMembers] = useState(projectMembers);
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();
  const [sites, setSites] = useState(initialSites);
  const [activeSiteId, setActiveSiteId] = useState(initialSites[0]?.id || null);

  const projectDetails = projectData.find((p) => p.id === projectId);

  const siteDeleteHandler = async (id: number) => {
    setSites((prev) => prev.filter((site) => site.id !== id));

    if (activeSiteId === id) {
      const nextSite = sites.find((s) => s.id !== id);
      setActiveSiteId(nextSite?.id || null);
    }
  };
  //Hnadleprojectsite delete
  const handleDeleteSite = async (id: number) => {
    await showPopup({
      title: "Delete",
      body: "Are you sure you want to delete this project site?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "danger",
          action: async (close) => {
            siteDeleteHandler(id);
            toast.success("Project site deleted successfully");
            close(true);
          },
        },
      ],
    });
  };

  const handleDeleteConfirmation = async () => {
    await showPopup({
      title: "Delete",
      body: "Are you sure you want to delete this member?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "danger",
          action: async (close) => {
            toast.success("Member deleted successfully");
            close(true);
          },
        },
      ],
    });
  };

  const handleEdit = (id: number) => () => {
    console.log("Edit member:", id);
  };

  const handleDelete = (id: number) => async () => {
    handleDeleteConfirmation();
    setMembers(members.filter((m) => m.id !== id));
  };

  const sections = members.map((member) => ({
    title: "Project Member",
    items: [
      { label: "First Name", value: member.firstName },
      { label: "Last Name", value: member.lastName },
      { label: "Email ID", value: member.email },
      { label: "Mobile Number", value: member.mobile },
      { label: "Role", value: member.role },
    ],
    onEdit: handleEdit(member.id),
    onDelete: handleDelete(member.id),
  }));

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
                isShowSort={false}
              />
            </div>
          </div>
        </div>

        <div className="grid md:flex gap-8 mt-4">
          <div className="lg:w-9/12">
            <div className="rounded-xl bg-[#044745] p-4 py-5 text-white">
              <div className="flex justify-between items-start">
                {/* Left Section */}
                <div className="space-y-2 flex-1">
                  <h2 className="text-xl font-semibold">
                    {projectDetails?.title || "Software Development 2025"}
                  </h2>
                  <div className="flex items-center gap-1 opacity-80">
                    <TiDocumentText className="text-lg" />
                    {projectDetails?.type || "Technology project"}
                  </div>
                  <div className="flex items-center text-sm opacity-80">
                    Duration: 6 months
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-white text-[#044745] text-xs font-medium px-3 py-1 rounded-full">
                      On-site & Remote
                    </span>
                    <HiOutlineDotsVertical className="cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-2 justify-end">
                <div
                  className="cursor-pointer bg-white text-[#044745] px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition"
                  onClick={() => navigate(absoluteUrls.client.home.my_jobs)}
                >
                  View Jobs
                </div>
                <div
                  className="cursor-pointer bg-[#B6F6E9] text-[#044745] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#A0EAD3] transition"
                  onClick={() =>
                    navigate(absoluteUrls.client.home.post_JobPage)
                  }
                >
                  Post A Job
                </div>
              </div>
            </div>

            {/* Project Info */}
            <ProjectInfoCard projectDetails={projectDetails} />

            {/* Project Site */}
            <div className="bg-gray-200 dark:bg-gray-800  dark:text-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Project Site
              </h3>

              <div className="h-96 overflow-y-scroll">
                {sites.map((site, i) => (
                  <div
                    className="flex flex-col rounded-md mb-2 bg-white dark:bg-gray-800 dark:text-white items-center justify-center space-y-4"
                    key={i}
                  >
                    <div className="flex flex-col w-full my-auto px-4 pt-2 h-16">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                          Project Site {site.id}
                        </h4>
                        <div className="flex space-x-2">
                          <BiEdit
                            className="text-lg cursor-pointer"
                            onClick={() => {
                              setActiveKey("editclientProject");
                              setISOpenSidebar(true);
                            }}
                          />
                          <RiDeleteBin6Line
                            className="text-lg cursor-pointer"
                            onClick={() => handleDeleteSite(site.id)}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>
                          <strong>Site ID:</strong> {site.siteId}
                        </span>
                        <span>
                          <strong>Site Name:</strong> {site.siteName}
                        </span>
                      </div>
                    </div>

                    {sites.length > 0 ? (
                      <MapSearch
                        className="h-72 overflow-hidden rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                        initialPosition={
                          sites.find((s) => s.id === activeSiteId)
                            ?.coordinates || sites[0].coordinates
                        }
                        viewOnly={true}
                      />
                    ) : (
                      <p>No project sites added yet</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setActiveKey("addclientProject");
                    setISOpenSidebar(true);
                  }}
                  className="w-fit rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
                >
                  Add Project Site
                </Button>
              </div>
            </div>
          </div>

          {/* SideCard */}
          <div className="lg:w-3/12 space-y-4">
            <div className="bg-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm md:text-lg font-medium mb-1">
                Remaining Budget
              </h3>
              <p className="md:text-3xl font-bold text-gray-900">
                INR {projectDetails?.remainingbudget}
              </p>
            </div>

            <div className="bg-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3">
                Project Execution Timeline
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg p-3 text-center shadow-sm">
                  <p className="mb-1">Actual Start Date</p>
                  <p className="text-sm font-semibold">
                    {dayjs(projectDetails?.actualStartDate).format(
                      "DD-MM-YYYY"
                    )}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg p-3 text-center shadow-sm">
                  <p className="mb-1">Actual End Date</p>
                  <p className="text-sm font-semibold">
                    {dayjs(projectDetails?.actualEndDate).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>
            </div>
            <ClientInterviewerSection
              title="Project Member"
              sections={sections}
              addAction={
                <Button
                  type="submit"
                  className="w-fit mt-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 hover:opacity-90 transition"
                >
                  Add Project Member
                </Button>
              }
              disabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
