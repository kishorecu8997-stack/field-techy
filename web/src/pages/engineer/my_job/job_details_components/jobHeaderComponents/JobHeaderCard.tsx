import { WORKING_TYPES } from "@/pages/engineer/search_result/types";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import type { JobHeaderCardProps } from "../../types";
import EngineersActions from "./EngineersActins";
import UpdateStatus from "./UpdateStatus";
import ClientActions from "@/pages/client/manage_proposal/components/ClientActions";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import ConfirmationModal from "@/pages/client/my_job_client/components/ConfirmationModal";

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
  status = "new",
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
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <div className="flex gap-2 items-center">
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
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
          <span className="flex items-center gap-1">🕒 {duration}</span>
          <span>Client: {client}</span>
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
          onClose={() => setIsConfirmOpen(false)}
          onHold={() => handleConfirmAction("onHold")}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </Popup>
    </>
  );
};

export default JobHeaderCard;
