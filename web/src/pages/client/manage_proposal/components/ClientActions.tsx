import type { GetUserRatingAndReviewsResponse } from "@/api";
import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import ViewClientFeedbackModal from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/ViewClientFeedbackModal";
import { useGetUserRatingAndReviews } from "@/shared/apiServices/commonOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import { usePopupStore } from "@/shared/store/popupStore";
import { createPathBuilder } from "@/utils";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

/**
 * ClientActions Component
 * Renders the actions section for the Manage Proposal page, including a button to invite a new job.
 * @returns {JSX.Element} The rendered actions section
 * */
const ClientActions = ({
  activeTab,
  allCardsApproved = false,
  jobStatus,
  numberOfVacancy,
  numberOfApprovedProposals,
}: {
  activeTab?: string;
  allCardsApproved?: boolean;
  jobStatus?: string;
  numberOfVacancy?: number;
  numberOfApprovedProposals?: number;
}) => {
  const navigate = useNavigate();
  const { id, jobId } = useParams();
  const { showPopup, closePopup } = usePopupStore();
  const [searchParams] = useSearchParams();
  const regionIdParam = searchParams.get("regionId");

  const makeUrl = createPathBuilder(absoluteUrls.client.home.SelectEngineer);
  const URl = makeUrl({ id: String(id || jobId) });

  // Show "View Feedback From Engineers" button only on Timeline tab when all cards are approved
  const showFeedbackButton =
    activeTab === JOB_TAB_LABELS.timeline && allCardsApproved;

  // Check if job is cancelled
  const isCancelled = jobStatus?.toLowerCase() === "cancelled";

  const { data: engineerFeedbackData } = useGetUserRatingAndReviews(
    true,
    undefined,
    Number(id || jobId),
    regionIdParam ? Number(regionIdParam) : undefined
  );


  const handleOpenViewClientFeedback = () => {
    showPopup({
      body: (
        <ViewClientFeedbackModal
          onClose={closePopup}
          reviews={engineerFeedbackData as GetUserRatingAndReviewsResponse}
          label="Feedback From Engineers"
        />
      ),
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 w-full justify-end">
        {isCancelled ? (
          <div className="flex flex-wrap gap-2 w-fit items-center">
            <icons.checkCircle className="text-red-500 w-6 h-6" />
            <span className="text-lg">Job Cancelled</span>
          </div>
        ) : showFeedbackButton ? (
          <Button
            variant="no_style"
            className="text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 border-b-1 border-white rounded-none hover:rounded-t-lg hover:bg-white/4"
            onClick={handleOpenViewClientFeedback}
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
          (jobStatus === "Posted" || jobStatus === "In Progress") &&
          numberOfVacancy !== numberOfApprovedProposals && (
            <Button
              variant="primary"
              onClick={() => {
                navigate(`${URl}?regionId=${regionIdParam}`);
              }}
            >
              Invite to Job
            </Button>
          )
        )}
      </div>
    </>
  );
};

export default ClientActions;
