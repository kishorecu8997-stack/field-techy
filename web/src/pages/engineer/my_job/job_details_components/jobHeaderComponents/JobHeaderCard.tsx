import { WORKING_TYPES } from "@/pages/engineer/search_result/types";

import ClientActions from "@/pages/client/manage_proposal/components/ClientActions";
import ConfirmationModal from "@/pages/client/my_job_client/components/ConfirmationModal";
import BreakRequestDetails from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequestDetails";
import Popup from "@/shared/components/Popup";
import { JOB_HEADER_COPY } from "@/shared/constants/jobHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoChatbubble, IoEllipsisVerticalOutline } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { JobHeaderCardProps } from "../../types";
import EngineersActions from "./EngineersActins";
import UpdateLogForm from "./UpdateLogForm";
import { Button } from "@/shared/components/commonUI/Buttons";
import ReportPage from "@/pages/client/report";
import { IoIosWarning } from "react-icons/io";
import { absoluteUrls } from "@/config/urls";
import { useReportCount } from "@/shared/hooks/useReportCount";
import { useClientCancelJob } from "@/shared/apiServices/client/clientOpenApiService";
import { toast } from "react-toastify";
/**
 * Displays the main header card for a job with title, client, duration, type, and status.
 * Original UI with teal-800 background, Break Details button, and EngineersActions.
 *
 * @param {JobHeaderCardProps} props - Props for the JobHeaderCard component.
 * @returns {JSX.Element} The rendered JobHeaderCard component.
 */
const JobHeaderCard: React.FC<JobHeaderCardProps> = ({
  title,
  client,
  duration,
  type,
  status = "NEW",
  setIsWorkSubmitted,
  setSendProposal,
  isSendProposal,
  setActiveTab,
  OfferJobStatus,
  hideBreakDetails = false,
  hideChats = false,
  jobLocation,
  numberOfVacancy,
  numberOfApplicants,
  numberOfApprovedProposals,
  hideDurationAndClient = false,
  hideClient = false,
  activeTab,
  onAddProgressUpdate,
  onOpenFinalStatement,
  isFinalStatementSubmitted,
  isFinalStatementApproved,
  isFinalStatementRejected,
  onOpenGiveClientFeedback,
  onOpenViewClientFeedback,
  allCardsApproved,
  setOfferJobStatus,
  assignmentId,
  allAssignmentIds,
  engineerNames,
  progressUpdates,
  jobId,
  jobStartDate,
  jobEndDate,
  onToggleChat,
}) => {
  const params = useParams();
  const location = useLocation();
  const isClient = location.pathname.includes("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { closePopup, showPopup } = usePopupStore();
  const [actionType, setActionType] = useState<"hold" | "clone" | "cancel">(
    "hold",
  );
  // Track if job is cancelled locally for UI update (for immediate feedback during cancellation)
  // const [isJobCancelled, setIsJobCancelled] = useState(false);
  
  // Check if job is already cancelled from the status prop
  // const isJobCancelledStatus = status?.toLowerCase() === "cancelled" || isJobCancelled;
  const { count: reportCount, refetch: refetchCount } = useReportCount({
    jobId: jobId,
    status: "pending",
  });

  // Cancel job mutation
  const { mutate: cancelJob } = useClientCancelJob({
    onSuccess: () => {
      console.log("Job cancelled successfully");
      // setIsJobCancelled(true);
      toast.success("Job cancelled successfully!");
      // Delay navigation to show the cancelled badge and toast
      setTimeout(() => {
        if (isClient) {
          navigate(absoluteUrls.client.home.my_jobs);
        } else {
          navigate(absoluteUrls.engineer.home.my_jobs);
        }
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to cancel job:", error);
      toast.error("Failed to cancel job. Please try again.");
    },
  });

  const handleMenuAction = (action: string) => {
    let type: "hold" | "clone" | "cancel";

    switch (action) {
      case "Hold the job":
        type = "hold";
        break;
      case "Clone the job":
        type = "clone";
        break;
      case "Cancel the job":
        type = "cancel";
        break;
      default:
        return;
    }

    setActionType(type);
    setIsConfirmOpen(true); // open modal
    setIsMenuOpen(false);
  };

  const handleConfirmAction = () => {
    if (actionType === "cancel" && jobId) {
      // Trigger the cancel job API
      const jobIdNumber = Number(jobId);
      if (isNaN(jobIdNumber)) {
        console.error("Invalid job ID:", jobId);
        setIsConfirmOpen(false);
        return;
      }
      cancelJob({
        body: {
          jobId: jobIdNumber,
          status: "Cancelled" as const,
        },
      });
    }
    setIsConfirmOpen(false);
  };

  const handleBreakDetails = async () => {
    if (isClient) {
      await showPopup({
        title: "",
        body: (
          <BreakRequestDetails
            onClose={closePopup}
            assignmentIds={allAssignmentIds}
            engineerNames={engineerNames}
            isClientView={true}
          />
        ),
        actionButtons: [],
      });
    } else {
      // Navigate to break-details with assignmentId
      navigate(
        `/engineer/my-jobs/${params.jobId}/break-details?assignmentId=${assignmentId}`,
      );
    }
  };

  // Determine card background based on send proposal state
  const cardBackgroundClass = isSendProposal
    ? "text-gray-800 bg-yellow-50 mt-4 dark:from-teal-900/30 dark:to-teal-800/30 dark:bg-gradient-to-br"
    : "bg-teal-800 text-white mt-4 dark:from-teal-900/30 dark:to-teal-800/30 dark:bg-gradient-to-br";

  return (
    <>
      <div className={`${cardBackgroundClass} p-5 rounded-xl shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{title || "-"}</h1>
            {jobLocation && (
              <p className="text-sm mt-1">
                {JOB_HEADER_COPY.locationLabel} {jobLocation}
              </p>
            )}
            {(numberOfVacancy !== undefined ||
              numberOfApplicants !== undefined ||
              numberOfApprovedProposals !== undefined) && (
              <p className="text-sm mt-1">
                {numberOfVacancy !== undefined && (
                  <span>
                    {JOB_HEADER_COPY.vacanciesLabel} {numberOfVacancy}
                  </span>
                )}
                {numberOfVacancy !== undefined &&
                  numberOfApprovedProposals !== undefined && (
                    <span className="ml-2 text-green-400">
                      (Filled: {numberOfApprovedProposals}/{numberOfVacancy})
                    </span>
                  )}
                {numberOfVacancy !== undefined &&
                  (numberOfApplicants !== undefined ||
                    numberOfApprovedProposals !== undefined) && (
                    <span>{JOB_HEADER_COPY.separator}</span>
                  )}
                {numberOfApplicants !== undefined && (
                  <span>
                    {JOB_HEADER_COPY.applicantsLabel} {numberOfApplicants}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <div
              onClick={() =>
                isClient
                  ? navigate(
                      `${absoluteUrls.client.home.my_jobs}/${params.jobId}/report_updates`,
                    )
                  : navigate(
                      `${absoluteUrls.engineer.home.my_jobs}/${params.jobId}/report_updates`,
                    )
              }
              className="flex flex-row-reverse text-white gap-2 items-center bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              <span>Report Updates</span>
              {reportCount > 0 && (
                <div className="relative">
                  <IoIosWarning size={20} />
                  <span className="absolute bottom-4 left-3 flex justify-center items-center size-1 p-1 rounded-full bg-red-600"></span>
                </div>
              )}
            </div>

            {/* Chats button - visible unless hideChats is true */}
            {onToggleChat && jobId && !hideChats && (
              <Button
                variant="chats"
                size="chip"
                leftIcon={<IoChatbubble size={18} />}
                onClick={() => onToggleChat(jobId)}
              >
                Chats
              </Button>
            )}

            {!hideBreakDetails && (
              <div
                className="flex flex-row-reverse text-white gap-2 items-center bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                onClick={handleBreakDetails}
              >
                <span>{JOB_HEADER_COPY.breakDetails}</span>
                <FaBell size={20} />
              </div>
            )}
            {/* On Site badge */}
            <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900 whitespace-nowrap">
              {type === WORKING_TYPES.onsite || type === "On site"
                ? "On Site"
                : type === WORKING_TYPES.remote || type === "Remote"
                  ? "Remote"
                  : type === WORKING_TYPES.hybrid || type === "Hybrid"
                    ? "Hybrid"
                    : type || "Remote"}
            </span>
            {/* Client menu */}
            {isClient && (
              <div className="relative">
                <IoEllipsisVerticalOutline
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                />
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 text-gray-800 dark:text-white">
                    <ul className="py-1">
                      {[
                        "Hold the job",
                        "Cancel the job",
                        // "Clone the job",
                        "Report Issue",
                      ].map((item) => (
                        <li key={item}>
                          <div
                            onClick={() =>
                              item === "Report Issue"
                                ? setIsReportOpen(true)
                                : handleMenuAction(item)
                            }
                            className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            {item}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {!hideDurationAndClient && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
            <span className="flex items-center gap-1">
              {JOB_HEADER_COPY.clockIcon} {duration || "-"}
            </span>
            {!hideClient && (
              <span>
                {JOB_HEADER_COPY.clientLabel} {client || "-"}
              </span>
            )}
          </div>
        )}
        {/* Client or Engineer actions */}
        {isClient ? (
          <ClientActions
            activeTab={activeTab}
            allCardsApproved={allCardsApproved}
            jobStatus={status}
            numberOfVacancy={numberOfVacancy}
            numberOfApprovedProposals={numberOfApprovedProposals}
          />
        ) : (
          <EngineersActions
            OfferJobStatus={OfferJobStatus}
            isSendProposal={isSendProposal}
            setActiveTab={setActiveTab}
            setIsWorkSubmitted={setIsWorkSubmitted}
            setOfferJobStatus={setOfferJobStatus}
            setOpen={setOpen}
            setIsReportOpen={setIsReportOpen}
            status={status}
            setSendProposal={setSendProposal}
            activeTab={activeTab}
            onAddProgressUpdate={onAddProgressUpdate}
            onOpenFinalStatement={onOpenFinalStatement}
            isFinalStatementSubmitted={isFinalStatementSubmitted}
            isFinalStatementApproved={isFinalStatementApproved}
            isFinalStatementRejected={isFinalStatementRejected}
            onOpenGiveClientFeedback={onOpenGiveClientFeedback}
            onOpenViewClientFeedback={onOpenViewClientFeedback}
            assignmentId={assignmentId}
            progressUpdates={progressUpdates}
            numberOfVacancy={numberOfVacancy}
            numberOfApprovedProposals={numberOfApprovedProposals}
            jobStartDate={jobStartDate}
            jobEndDate={jobEndDate}
          />
        )}
      </div>
      {/* Update Log Popup */}
      <Popup open={open} onClose={() => setOpen(false)}>
        <UpdateLogForm
          onClose={() => setOpen(false)}
          onAddProgressUpdate={onAddProgressUpdate}
          assignmentId={assignmentId}
          jobId={jobId}
        />
      </Popup>
      {/* Confirmation Modal Popup */}
      <Popup open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <ConfirmationModal
          actionType={actionType}
          onConfirm={handleConfirmAction}
          onClose={() => setIsConfirmOpen(false)}
        />
      </Popup>
      <ReportPage
        open={isReportOpen}
        refetchCount={refetchCount}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
};

export default JobHeaderCard;
