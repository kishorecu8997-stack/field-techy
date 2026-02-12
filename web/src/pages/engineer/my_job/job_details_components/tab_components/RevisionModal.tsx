import React from "react";
import { HiXMark } from "react-icons/hi2";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import type { ProgressUpdate } from "../../types.d";
import revisionImage from "@/assets/dummy/revision-request.jpg";
import { ENGINEER_MODAL_TITLES, ATTACHMENT_ALT } from "@/constants/timelineConstants";
import { MODAL_MESSAGES } from "@/dummy_data/engineerTimelineDummyData";

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRevision: ProgressUpdate | null;
  onOpenUpdateForm: () => void;
}

/**
 * RevisionModal - Modal popup for viewing revision request details
 * Displays revision image and allows user to update
 */
const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  activeRevision,
  onOpenUpdateForm,
}) => {
  return (
    <Popup open={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {ENGINEER_MODAL_TITLES.revisionRequest}
          </h3>
          <Button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <HiXMark className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-5 pt-3 text-sm text-gray-700">
          {activeRevision?.description || MODAL_MESSAGES.revisionFallback}
        </div>
        <div className="px-5 pt-4 text-sm font-semibold text-gray-900">
          Attachment
        </div>
        <div className="px-5 pt-2">
          <div className="rounded-md border border-gray-200 bg-gray-100 p-2">
            <img
              src={revisionImage}
              alt={activeRevision?.attachmentName || ATTACHMENT_ALT.revision}
              className="w-full h-44 object-cover rounded"
            />
          </div>
        </div>
        <div className="flex justify-end px-5 py-4">
          <Button
            type="button"
            className="bg-teal-800 text-white px-6 py-2 rounded-md text-sm font-medium cursor-pointer"
            onClick={onOpenUpdateForm}
          >
            Update
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default RevisionModal;
