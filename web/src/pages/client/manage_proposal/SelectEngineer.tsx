import { absoluteUrls } from "@/config/urls";
import { useClientExploreEngineers, useClientInviteEngineer } from "@/shared/apiServices/client/clientOpenApiService";
import FreelancerCard from "@/shared/components/cards/client/FreelancerCard";
import { Button } from "@/shared/components/commonUI/Buttons";
import Filters from "@/shared/components/Filters";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import Popup from "@/shared/components/Popup";
import type { RatingValue } from "@/shared/libs/constants/filterOptions";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import InvitationSentModal from "../explore_engineer/components/invite_job/InvitationSentModal";
import Pagination from "../search_result/components/Pagination";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */

const SelectEngineer = () => {
  const params = useParams();
  const jobId = Number(params.id);

  const [searchParams] = useSearchParams();
  const regionIdParam = searchParams.get("regionId");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [rating, setRating] = useState<RatingValue | null>(null);
  const [experience, setExperience] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<Set<number>>(new Set());

  const itemsPerPage = 8;
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  // Fetch engineers
  const { data, isLoading } = useClientExploreEngineers(
    {
      page: currentPage,
      limit: itemsPerPage,
      regionId: regionIdParam ? Number(regionIdParam) : undefined,
      jobType: selectedLocation
        ? selectedLocation === 1
          ? "On site"
          : selectedLocation === 2
            ? "Remote"
            : "Hybrid"
        : undefined,
      serviceCategoryId: selectedCategory,
      minRating: rating ? parseInt(rating) : undefined,
      experienceYears: experience > 0 ? experience : undefined,
      skillIds:
        Array.from(selectedSkills).length > 0
          ? Array.from(selectedSkills).map((id) => id.toString())
          : undefined,
    },
    true,
  );

  const engineers = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / itemsPerPage);

  // Invite API
  const { mutateAsync: inviteEngineer } = useClientInviteEngineer({});

  // Handle engineer selection
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle bulk invite from button
  const handleInvite = async () => {
    if (selectedIds.length === 0) return;

    await showPopup({
      title: "Invite to Job",
      body: "Are you sure you want to invite the selected engineer(s)?",
      actionButtons: [
        {
          label: "No",
          variant: "secondary",
          value: null,
          action: (close) => close(true),
        },
        {
          label: "Yes, invite",
          variant: "primary",
          value: "yes",
          action: async (close) => {
            close(true);

            try {
              // Send invites in parallel
              await Promise.all(
                selectedIds.map((engineerId) =>
                  inviteEngineer({
                    body: {
                      jobId,
                      engineerId,
                      regionId: Number(regionIdParam),
                    },
                  }),
                ),
              );

              // Show ONE toast after all invites succeed
              toast.success(
                `${selectedIds.length} engineer(s) invited successfully!`,
              );
              setIsOpen(true);
              setSelectedIds([]);
            } catch (error) {
              toast.error("Engineers were already invited.");
            }
          },
        },
      ],
    });
  };

  // Handle individual card invite
  const handleCardInvite = async (engineerId: number) => {
    try {
      await inviteEngineer({
        body: {
          jobId,
          engineerId,
          regionId: Number(regionIdParam),
        },
      });
      toast.success("Engineer invited successfully!");
      setIsOpen(true); // open modal
    } catch (error) {
      toast.error("Engineer already invited");
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-[30rem] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading engineers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Explore Engineers"
          isShowBreadcrumb={false}
          isShowSort={false}
          description={`${data?.total ?? 0}+ Engineers found`}
          action={
            <Button onClick={handleInvite} disabled={selectedIds.length === 0}>
              Invite to Job
            </Button>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {engineers.length === 0 ? (
                <div className="col-span-full flex justify-center items-center min-h-[15rem]">
                  <p className="text-gray-500 text-lg">
                    No engineers found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                engineers.map((engineer) => (
                  <FreelancerCard
                    key={engineer.userId}
                    id={engineer.userId}
                    name={engineer.name}
                    rating={engineer.averageRating}
                    reviews={engineer.reviewCount}
                    imageUrl={engineer.profilePictureUrl ?? undefined}
                    role={engineer.serviceCategoryName ?? ""}
                    selected={selectedIds.includes(engineer.userId)}
                    onSelect={handleSelect}
                    onInvite={() => handleCardInvite(engineer.userId)}
                  />
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <Filters
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                rating={rating}
                onRatingChange={setRating}
                experience={experience}
                onExperienceChange={setExperience}
                selectedSkills={selectedSkills}
                onSkillToggle={(skillId) => {
                  const newSet = new Set(selectedSkills);
                  if (newSet.has(skillId)) newSet.delete(skillId);
                  else newSet.add(skillId);
                  setSelectedSkills(newSet);
                }}
                onClearAll={() => {
                  setSelectedLocation(null);
                  setSelectedCategory(null);
                  setRating(null);
                  setExperience(0);
                  setSelectedSkills(new Set());
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Popup open={isOpen} onClose={() => setIsOpen(false)}>
        <InvitationSentModal
          onClose={() => {
            setIsOpen(false);
            navigate(`${absoluteUrls.client.home.my_jobs}?status=Posted`);
          }}
        />
      </Popup>
    </div>
  );
};

export default SelectEngineer;
