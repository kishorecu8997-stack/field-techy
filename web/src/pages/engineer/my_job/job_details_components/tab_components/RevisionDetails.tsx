import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { ProgressUpdate } from "../../types.d";
import { REVISION_LABELS } from "@/constants/timelineConstants";
import { MODAL_MESSAGES } from "@/dummy_data/engineerTimelineDummyData";

interface RevisionDetailsProps {
  update: ProgressUpdate;
  onStartRevisionUpdate: (update: ProgressUpdate) => void;
  revisionUpdateEntry: ProgressUpdate | undefined;
}

/**
 * RevisionDetails - Displays revision request with client message and engineer response
 * Shows client request in amber box and engineer update in blue box if submitted
 * Supports multiple revisions from the revisions array
 */
const RevisionDetails: React.FC<RevisionDetailsProps> = ({
  update,
  onStartRevisionUpdate,
  revisionUpdateEntry,
}) => {
  // Get revisions from the update object
  const revisions = update.revisions || [];
  
  return (
    <div className="mt-3 pl-4 border-l border-gray-200">
      {/* Show revision count if there are multiple revisions */}
      {revisions.length > 0 ? (
        <>
          {revisions.map((revision, index) => (
            <div key={revision.revisionId || index} className="mb-3">
              <p className="text-xs font-semibold text-gray-800">
                {REVISION_LABELS.numberPrefix} {revisions.length - index} - {update.title}
              </p>
              <div className="mt-2">
                {/* Client Revision Request */}
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 w-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-600">
                        {REVISION_LABELS.clientLabel}
                      </p>
                      <p className="text-sm text-gray-800 mt-1 break-all">
                        {revision.clientComment || update.description || MODAL_MESSAGES.revisionFallback}
                      </p>
                      {revision.clientAttachmentUrl && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                            {decodeURIComponent(revision.clientAttachmentUrl.split("/").pop()?.split("?")[0] || "")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500 leading-4">
                        {revision.createdAt 
                          ? new Date(revision.createdAt).toLocaleString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : update.timestamp}
                      </span>
                      {/* Show button only if no engineer response exists (neither from API nor local state) */}
                      {!revisionUpdateEntry && !revision.content && index === 0 && (
                        <Button
                          type="button"
                          className="bg-teal-800 hover:bg-teal-900 text-white px-2 py-0.5 text-xs mt-auto"
                          onClick={() => onStartRevisionUpdate(update)}
                        >
                          {REVISION_LABELS.updateButton}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Engineer Revision Update - if exists */}
                {revision.content && (
                  <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3 w-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-700">
                          {REVISION_LABELS.engineerLabel}
                        </p>
                        <p className="text-sm text-gray-800 mt-1 break-all">
                          {revision.content}
                        </p>
                        {revision.attachmentUrl && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                              {decodeURIComponent(revision.attachmentUrl.split("/").pop()?.split("?")[0] || "")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500 leading-4">
                          {revision.updatedAt 
                            ? new Date(revision.updatedAt).toLocaleString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : update.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        /* Fallback for single revision without revisions array */
        <>
          <p className="text-xs font-semibold text-gray-800">
            {REVISION_LABELS.numberPrefix} 1 - {update.title}
          </p>
          <div className="mt-2">
            {/* Client Revision Request */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 w-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-600">
                    {REVISION_LABELS.clientLabel}
                  </p>
                  <p className="text-sm text-gray-800 mt-1 break-all">
                    {update.description || MODAL_MESSAGES.revisionFallback}
                  </p>
                  {update.attachmentName && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                        {update.attachmentName}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-500 leading-4">
                    {update.timestamp}
                  </span>
                  {/* Show button only if no engineer response exists */}
                  {!revisionUpdateEntry && (
                    <Button
                      type="button"
                      className="bg-teal-800 hover:bg-teal-900 text-white px-2 py-0.5 text-xs mt-auto"
                      onClick={() => onStartRevisionUpdate(update)}
                    >
                      {REVISION_LABELS.updateButton}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Engineer Revision Update */}
            {revisionUpdateEntry && (
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3 w-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-700">
                      {REVISION_LABELS.engineerLabel}
                    </p>
                    <p className="text-sm text-gray-800 mt-1 break-all">
                      {revisionUpdateEntry.description}
                    </p>
                    {revisionUpdateEntry.attachmentName && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-300 text-xs text-gray-700 bg-white">
                          {revisionUpdateEntry.attachmentName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 leading-4">
                      {revisionUpdateEntry.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RevisionDetails;
