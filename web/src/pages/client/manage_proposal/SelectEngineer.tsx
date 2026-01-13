import { absoluteUrls } from "@/config/urls";
import { EngineersList } from "@/dummy_data/client/manage-proposal";
import FreelancerCard from "@/shared/components/cards/client/FreelancerCard";
import { Button } from "@/shared/components/commonUI/Buttons";
import Filters from "@/shared/components/Filters";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../search_result/components/Pagination";
import Popup from "@/shared/components/Popup";
import InvitationSentModal from "../explore_engineer/components/invite_job/InvitationSentModal";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const SelectEngineer = () => {
  // const params = useParams();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  const itemsPerPage = 8;

  // Filtered engineers (mock — in real app, filter by category)
  const filteredEngineers = EngineersList; // Add actual filtering logic if needed

  // Pagination
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEngineers = filteredEngineers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  // const jobId = Number(params.id);

  // const proposal = ProposalsList.find((job) => job.id === jobId);
  // const matchedJob = proposal
  //   ? sampleJobs.find((job) => job.id === proposal.jobID)
  //   : null;

  const handleSelect = (id: number) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // unselect
          : [...prev, id], // select
    );
  };
  const handlePageChange = (page: number) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const handleInvite = async () => {
    await showPopup({
      title: "Invite to Job",
      body: "Are you sure you want to invite this engineer?",
      actionButtons: [
        {
          label: "No",
          variant: "secondary",
          value: null,
          action: (close) => {
            close(true);
          },
        },
        {
          label: "Yes, invite",
          variant: "primary",
          value: "yes",
          action: (close) => {
            toast.success("Job invited successfully");
            close(true);
            setIsOpen(true);
            // ;
          },
        },
      ],
    });
  };

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Explore Engineers"
          isShowBreadcrumb={false}
          isShowSort={false}
          description={`${10}+ Engineers found`}
          action={<Button onClick={handleInvite} disabled={selectedIds.length === 0}>Invite to Job</Button>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentEngineers.map((engineer) => (
                <FreelancerCard
                  key={engineer.id}
                  id={engineer.id}
                  name={engineer.name}
                  rating={engineer.ratings}
                  reviews={engineer.reviewCount}
                  role={engineer.role}
                  onInvite={handleInvite}
                  selected={selectedIds.includes(engineer.id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <Filters />
            </div>
          </div>
        </div>
      </div>
      <Popup open={isOpen} onClose={() => setIsOpen(false)}>
        <InvitationSentModal
          onClose={() => {
            setIsOpen(false);
            navigate(absoluteUrls.client.home.my_jobs);
          }}
        />
      </Popup>
    </div>
  );
};

export default SelectEngineer;
