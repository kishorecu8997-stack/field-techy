import { WORKING_TYPES } from "@/pages/engineer/search_result/types";
import Popup from "@/shared/components/Popup";
import React from "react";
import { useLocation } from "react-router-dom";
import type { JobHeaderCardProps } from "../../types";
import EngineersActins from "./EngineersActins";
import UpdateStatus from "./UpdateStatus";
import ClientActions from "@/pages/client/manage_proposal/components/ClientActions";

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

  const [open, setOpen] = React.useState(false);

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
          <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900 whitespace-nowrap">
            {type === WORKING_TYPES.onsite ? "On Site" : "Remote"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
          <span className="flex items-center gap-1">🕒 {duration}</span>
          <span>Client: {client}</span>
        </div>
        {isClient ? (
          <ClientActions />
        ) : (
          <EngineersActins
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
    </>
  );
};

export default JobHeaderCard;
