/**
 * BreakRequestDetails
 *
 * Displays a list of pending break requests with details and allows the user
 * to approve or reject each request. Opens a popup to capture a reason for
 * approval or rejection and shows a toast message on submission.
 *
 * Props:
 * @param {() => void} onClose - Function to close the break request details view or popup
 *
 * Features:
 * - Shows break type, dates, duration, purpose, and applied date
 * - Handles short and long term breaks
 * - Opens ActionReasonPopup on Approve/Reject
 * - Displays success toast on submission
 */
import { icons } from "@/config/icons";
import breakData from "@/dummy_data/break.json";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { ActionReasonPopup } from "./ActionReasonPopup";
import { toast } from "react-toastify";

interface Break {
  id: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  type: "Short" | "Long";
  status: "Pending" | "Approved" | "Active";
  purpose: string;
  ["Applied on"]?: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear().toString().slice(-2)}`;
};

const BreakRequestDetails = ({ onClose }: { onClose: () => void }) => {
  const { showPopup } = usePopupStore();
  const pendingBreaks = (breakData as Break[]).filter(
    (brk) => brk.status === "Pending"
  );

  const handleReject = async (brk: Break) => {
  await showPopup({
    title: "",
    body: (
      <ActionReasonPopup
       title="Leave Rejection"
        label="Reason for Reject"
        submitLabel="Submit"
        onSubmit={async ({ reason }) => {
          console.log(`Break ID ${brk.id} rejected with reason:`, reason);
          toast.success("Break rejected!");
          onClose(); 
        }}
        onClose={onClose} 
      />
    ),
    actionButtons: [], 
  });
};


  const handleApprovel = async (brk: Break) => {
  await showPopup({
   title: "",
    body: (
      <ActionReasonPopup
      title="Leave Approval"
      label="Reason for Approve"
        submitLabel="Submit"
        onSubmit={async ({ reason }) => {
          console.log(`Break ID ${brk.id} approved with reason:`, reason);
          toast.success("Break approved!");
          onClose(); 
        }}
        onClose={onClose} 
      />
    ),
    actionButtons: [], 
  });
  };

  return (
    <div className="flex flex-col p-4 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Break Requests Details
        </h2>
        <div
          className="cursor-pointer text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <icons.close className="w-5 h-5" />
        </div>
      </div>

      {pendingBreaks.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">
          No pending break requests
        </p>
      ) : (
        pendingBreaks.map((brk) => (
          <div
            key={brk.id}
            className="border rounded-lg p-3 dark:border-gray-700"
          >
            <p className="text-gray-800 dark:text-gray-200 font-medium text-xs mb-1">
              {brk.type === "Long" ? "Long Term Break" : "Short Term Break"}
            </p>

            <p
              className={`mb-1 inline-block px-2 py-0.5 rounded-2xl text-white text-xs ${
                brk.type === "Long"
                  ? "bg-orange-400 dark:bg-orange-700"
                  : "bg-green-600 dark:bg-green-700"
              }`}
            >
              {formatDate(brk.startDate)} - {formatDate(brk.endDate)} (
              {brk.duration})
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-1 text-sm">
              {brk.purpose}
            </p>

            {brk["Applied on"] && (
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Applied on: {formatDate(brk["Applied on"])}
              </p>
            )}

            <div className="w-full">
              <div className="flex justify-end space-x-2 mt-1">
                <Button onClick={() => handleReject(brk)} variant="outline" size="sm">
                  Reject
                </Button>
                <Button onClick={() => handleApprovel(brk)} variant="primary" size="sm">
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BreakRequestDetails;
