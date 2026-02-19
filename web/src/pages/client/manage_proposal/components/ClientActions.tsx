import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { createPathBuilder } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "@/config/icons";
import { useState } from "react";
import ViewEngineerFeedbackSidebar from "./ViewEngineerFeedbackSidebar";
import { DUMMY_ENGINEER_FEEDBACK_LIST } from "@/constants/dummyJobs";

/**
 * ClientActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * @returns {JSX.Element} The rendered actions section
 * */
const ClientActions = ({
  activeTab,
  allCardsApproved = false
}: {
  activeTab?: string;
  allCardsApproved?: boolean;
}) => {
  const navigate = useNavigate();
  const { id, jobId } = useParams();
  const [showFeedbackSidebar, setShowFeedbackSidebar] = useState(false);

  const makeUrl = createPathBuilder(absoluteUrls.client.home.SelectEngineer);
  const URl = makeUrl({ id: String(id || jobId) });

  const handleViewFeedback = () => {
    setShowFeedbackSidebar(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackSidebar(false);
  };

  // Show "View Feedback From Engineers" button only on Timeline tab when all cards are approved
  const showFeedbackButton = activeTab === "Timeline" && allCardsApproved;

  return (
    <>
      <div className="flex flex-wrap gap-4 w-full justify-end">
        {showFeedbackButton && (
          <div
            className="text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white"
            onClick={handleViewFeedback}
          >
            <icons.star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>View Feedback From Engineers</span>
          </div>
        )}
        <Button
          variant="primary"
          onClick={() => {
            navigate(URl);
          }}
        >
          Invite to Job
        </Button>
      </div>

      <ViewEngineerFeedbackSidebar
        isOpen={showFeedbackSidebar}
        onClose={handleCloseFeedback}
        feedbackList={DUMMY_ENGINEER_FEEDBACK_LIST}
      />
    </>
  );
};

export default ClientActions;
