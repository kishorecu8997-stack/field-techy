import { absoluteUrls } from "@/config/urls";
import {
  EngineersList,
  ProposalsList,
} from "@/dummy_data/client/ManageProposal";
import { sampleJobs } from "@/dummy_data/searchData";
import FreelancerCard from "@/shared/components/cards/client/FreelancerCard";
import { Button } from "@/shared/components/commonUI/Buttons";
import Filters from "@/shared/components/Filters";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const SelectEngineer = () => {
  const params = useParams();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  const jobId = Number(params.id);

  const proposal = ProposalsList.find((job) => job.id === jobId);
  const matchedJob = proposal
    ? sampleJobs.find((job) => job.id === proposal.jobID)
    : null;

 const handleSelect = (id: number) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id) // unselect
      : [...prev, id]                      // select
  );
};

  const handleInvite = async () => {
    console.log("Invited");
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
            navigate(absoluteUrls.client.home.my_jobs);
          },
        },
      ],
    });
  };

  console.log(matchedJob);
  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Explore Engineers"
          isShowBreadcrumb={false}
          isShowSort={false}
          action={<Button onClick={handleInvite}>Invite to Job</Button>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {EngineersList.map((engineer) => (
                <FreelancerCard
                  key={engineer.id}
                  id={engineer.id}
                  name={engineer.name}
                  rating={engineer.ratings}
                  reviews={engineer.reviewCount}
                  role={engineer.role}
                  onInvite={() => {}}
                 selected={selectedIds.includes(engineer.id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Filters />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectEngineer;
