import { WORKING_TYPES } from "@/pages/engineer/search_result/types";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { JobHeaderCardProps } from "../../types";
import EngineersActions from "./EngineersActins";
import UpdateStatus from "./UpdateStatus";
import ClientActions from "@/pages/client/manage_proposal/components/ClientActions";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import ConfirmationModal from "@/pages/client/my_job_client/components/ConfirmationModal";
import { FaBell } from "react-icons/fa";
import BreakRequestDetails from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakRequestDetails";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * Displays the main header card for a job with title, client, duration, type, and status.
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
}) => {
  const location = useLocation();
  const isClient = location.pathname.includes("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
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
    console.log("Confirmed action:", actionType);
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

  return (
    <>
      <div
        className={`${
          isSendProposal
            ? "text-gray-800 bg-yellow-50 mt-4 dark:from-teal-900/30 dark:to-teal-800/30 dark:bg-gradient-to-br"
            : "bg-teal-800 text-white mt-4 dark:from-teal-900/30 dark:to-teal-800/30 dark:bg-gradient-to-br"
        } p-5 rounded-xl shadow-md`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">{title || "-"}</h1>
          <div className="flex gap-2 items-center">
            <div
              className="flex flex-row-reverse items-center gap-2px-4 py-2 rounded-md text-sm font-mediumtransition-colors cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
              onClick={handleBreakDetails}
            >
              <span>Break Details</span>
              <div className="relative">
                <FaBell size={20} />
                <span className="absolute bottom-4 left-3 flex justify-center items-center size-1 p-1 rounded-full bg-red-600"></span>
              </div>
            </div>
            <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900 whitespace-nowrap">
              {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
            </span>
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
        <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
          <span className="flex items-center gap-1">🕒 {duration || "-"}</span>
          <span>Client: {client || "-"}</span>
        </div>
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
          />
        )}
      </div>
      <Popup open={open} onClose={() => setOpen(false)}>
        <UpdateStatus onClose={() => setOpen(false)} />
      </Popup>
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
