// JobCardDetailsHeader.tsx
import { Button } from "@/shared/components/commonUI/Buttons";
import React, { useState, useMemo } from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import Popup from "@/shared/components/Popup";
import RequestRevision from "./RequestRevision";
import ConfirmationModal from "./ConfirmationModal";
import { useParams } from "react-router-dom";
import {
  JOB_STATUSES,
  WORKING_TYPES,
} from "@/pages/client/search_result/types";
import { icons } from "@/config/icons";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import useDrawerStore from "@/shared/store/useDrawerStore";

const JobCardDetailsHeader = () => {
  const params = useParams();

  const job = useMemo(() => {
    const jobId = params.jobId;
    if (!jobId) return null;
    return sampleJobs.find((j) => String(j.id) === jobId);
  }, [params.jobId]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkApproved, setIsWorkApproved] = useState(false);
  const [isPaymentReleased, setIsPaymentReleased] = useState(false);
  const [isSendProposal, setSendProposal] = useState(false);

  if (!job) {
    return (
      <div className="p-5 bg-red-50 text-red-700 rounded-lg">
        Job not found.
      </div>
    );
  }

  const handleMenuAction = (action: string) => {
    if (action === "Hold the job") {
      setIsConfirmOpen(true);
    }
    setIsMenuOpen(false);
  };

  const handleConfirmAction = (action: string) => {
    console.log("Confirmed action:", action);
    setIsConfirmOpen(false);
  };

  const handleFormSubmit = (data: { notes: string; file?: File }) => {
    console.log("Revision request:", data);
    setIsOpen(false);
  };

  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  return (
    <>
      <div
        className={`${
          isSendProposal
            ? "text-gray-800 bg-yellow-50"
            : "bg-teal-800 text-white"
        } p-5 rounded-xl shadow-md`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>
          <div className="flex items-center">
            <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium text-gray-900 whitespace-nowrap">
              {job.type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
            </span>
            <div className="relative">
              <IoEllipsisVerticalOutline
                className="w-5 h-5 cursor-pointer"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 text-gray-800 dark:text-white">
                  <ul className="py-1">
                    {["Hold the job", "Cancel the job", "Clone the job"].map(
                      (item) => (
                        <li key={item}>
                          <div
                            onClick={() => handleMenuAction(item)}
                            className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            {item}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1">🕒 {job.duration}</span>
          <span>Client: {job.client}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 justify-end">
          {job.status === JOB_STATUSES.inprogress && !isWorkApproved && !isPaymentReleased ? (
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => {
                  setIsWorkApproved(true);
                  setIsPaymentReleased(false);
                }}
              >
                Approve Work
              </Button>
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => setIsOpen(true)}
              >
                Request Revision
              </Button>
            </div>
          ) : isWorkApproved && !isPaymentReleased ? (
            <Button
              className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
              onClick={() => setIsPaymentReleased(true)}
            >
              Complete And Release Payment
            </Button>
          ) : isPaymentReleased || job.status === JOB_STATUSES.completed ? (
            <div className="flex flex-wrap gap-2 items-center">
              <icons.checkCircle className="text-green-500 w-6 h-6" />
              <span className="text-lg">Job Completed</span>
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => {
                  setActiveKey("clientFeedback");
                  setISOpenSidebar(true);
                }}
              >
                Rate Engineer
              </Button>
            </div>
          ) : job.status === JOB_STATUSES.posted ? (
            <div className="flex items-center gap-2">
              <Button
                className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                onClick={() => console.log("Invite to Job clicked")}
              >
                Invite to Job
              </Button>
            </div>
          ) : job.status === JOB_STATUSES.hold ? (
            <div>
              {!isSendProposal ? (
                <Button
                  className="bg-teal-800 text-white px-6 py-2 rounded-md font-medium border border-gray-300"
                  onClick={() => setSendProposal(true)}
                >
                  Hold
                </Button>
              ) : (
                <div
                  className="text-green-700 hover:underline cursor-pointer"
                  onClick={() => setSendProposal(false)}
                >
                  View Hold
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <icons.checkCircle className="text-green-500 w-6 h-6" />
              <span className="text-lg">Job Completed</span>
            </div>
          )}
        </div>
      </div>

      <Popup open={isOpen} onClose={() => setIsOpen(false)}>
        <RequestRevision
          onClose={() => setIsOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Popup>

      <Popup open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <ConfirmationModal
          onClose={() => setIsConfirmOpen(false)}
          onHold={() => handleConfirmAction("onHold")}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </Popup>
    </>
  );
};

export default JobCardDetailsHeader;
