import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { createPathBuilder } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";

/**
 * ClientActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * @returns {JSX.Element} The rendered actions section
 * */
const ClientActions = ({
  activeTab,
  allCardsApproved = false,
}: {
  activeTab?: string;
  allCardsApproved?: boolean;
}) => {

  const navigate = useNavigate();
  const { id, jobId } = useParams();
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

  const makeUrl = createPathBuilder(absoluteUrls.client.home.SelectEngineer);
  const URl = makeUrl({ id: String(id || jobId) });

  const handleViewFeedback = () => {
    setActiveKey("engineerFromFeedback");
    setISOpenSidebar(true);
  };

  // Show "View Feedback From Engineers" button only on Timeline tab when all cards are approved
  const showFeedbackButton =
    activeTab === JOB_TAB_LABELS.timeline && allCardsApproved;

  return (
    <>
      <div className="flex flex-wrap gap-4 w-full justify-end">
        {showFeedbackButton ? (
          <Button
            variant="no_style"
            className="text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white rounded-none hover:rounded-t-lg hover:bg-white/4"
            onClick={handleViewFeedback}
            leftIcon={
              <icons.star
                aria-hidden="true"
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            }
          >
            <span>View Feedback From Engineers</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              navigate(URl);
            }}
          >
            Invite to Job
          </Button>
        )}
      </div>
    </>
  );
};

export default ClientActions;
