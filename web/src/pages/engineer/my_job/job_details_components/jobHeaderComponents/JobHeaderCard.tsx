import { WORKING_TYPES } from "@/pages/engineer/search_result/types";

import ClientActions from "@/pages/client/manage_proposal/components/ClientActions";
import ConfirmationModal from "@/pages/client/my_job_client/components/ConfirmationModal";
import BreakRequestDetails from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequestDetails";
import Popup from "@/shared/components/Popup";
import { JOB_HEADER_COPY } from "@/shared/constants/jobHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { JobHeaderCardProps } from "../../types";
import EngineersActions from "./EngineersActins";
import UpdateLogForm from "./UpdateLogForm";
import { IoChatbubble } from "react-icons/io5";
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
  setOfferJobStatus,
  hideBreakDetails = false,
  jobLocation,
  numberOfVacancy,
  numberOfApplicants,
  hideDurationAndClient = false,
  activeTab,
  onAddProgressUpdate,
  onOpenFinalStatement,
  assignmentId,
  progressUpdates,
  jobId,
  onToggleChat,
}) => {
  const location = useLocation();
  const isClient = location.pathname.includes("client");
  const params = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { closePopup, showPopup } = usePopupStore();
  const [actionType, setActionType] = useState<"hold" | "clone" | "cancel">(
    "hold",
  );

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
    setIsConfirmOpen(false);
  };

  const handleBreakDetails = async () => {
    if (isClient) {
      await showPopup({
        title: "",
        body: <BreakRequestDetails onClose={closePopup} />,
        actionButtons: [],
      });
    } else {
      navigate(`/engineer/my-jobs/${params.jobId}/break-details`);
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
              numberOfApplicants !== undefined) && (
              <p className="text-sm mt-1">
                {numberOfVacancy !== undefined && (
                  <span>
                    {JOB_HEADER_COPY.vacanciesLabel} {numberOfVacancy}
                  </span>
                )}
                {numberOfVacancy !== undefined &&
                  numberOfApplicants !== undefined && (
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
            {onToggleChat && jobId && (
              <button
                className="bg-teal-700 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 text-white cursor-pointer hover:bg-teal-600 transition-colors"
                onClick={() => onToggleChat(jobId)}
              >
                <span className="relative inline-block">
                  <IoChatbubble size={16} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </span>
                <span>Chats</span>
              </button>
            )}

            {!hideBreakDetails && (
              <div
                className="flex flex-row-reverse text-white gap-2 items-center bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                onClick={handleBreakDetails}
              >
                <span>{JOB_HEADER_COPY.breakDetails}</span>
                <div className="relative">
                  <FaBell size={20} />
                  <span className="absolute bottom-4 left-3 flex justify-center items-center size-1 p-1 rounded-full bg-red-600"></span>
                </div>
              </div>
            )}
            {/* On Site badge */}
            <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900 whitespace-nowrap">
              {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
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
                        ),
                      )}
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
            <span>
              {JOB_HEADER_COPY.clientLabel} {client || "-"}
            </span>
          </div>
        )}
        {/* Client or Engineer actions */}
        {isClient ? (
          <ClientActions />
        ) : (
          <EngineersActions
            OfferJobStatus={OfferJobStatus}
            isSendProposal={isSendProposal}
            setActiveTab={setActiveTab}
            setIsWorkSubmitted={setIsWorkSubmitted}
            setOfferJobStatus={setOfferJobStatus}
            setOpen={setOpen}
            status={status}
            setSendProposal={setSendProposal}
            activeTab={activeTab}
            onAddProgressUpdate={onAddProgressUpdate}
            onOpenFinalStatement={onOpenFinalStatement}
            assignmentId={assignmentId}
            progressUpdates={progressUpdates}
          />
        )}
      </div>
      {/* Update Log Popup */}
      <Popup open={open} onClose={() => setOpen(false)}>
        <UpdateLogForm
          onClose={() => setOpen(false)}
          onAddProgressUpdate={onAddProgressUpdate}
          assignmentId={assignmentId}
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
    </>
  );
};

export default JobHeaderCard;
