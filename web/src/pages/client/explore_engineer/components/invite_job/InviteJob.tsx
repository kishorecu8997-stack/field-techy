import { absoluteUrls } from "@/config/urls";
import { earningsData } from "@/dummy_data/jobDetails";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import {
  useClientGetJobs,
  useClientInviteEngineer,
} from "@/shared/apiServices/client/clientOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import Popup from "@/shared/components/Popup";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import {
  useCities,
  useCountries,
  useServiceCategories,
  useStates,
} from "@/shared/hooks/useLookup";
import { scrollToTop } from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { SelectedJobCardId } from "../../types";
import InvitationSentModal from "./InvitationSentModal";
import JobInviteCard from "./JobInviteCard";

/**
 * A component that allows a client to select one or more jobs to invite an engineer to.
 * It displays a list of available jobs as selectable cards and handles the invitation logic.
 *
 * @param {SelectJobCardProps} props - The props for the component.
 * @returns {React.ReactElement} A React functional component that renders the job invitation page.
 */
const InviteJob: React.FC = () => {
  const { engineerId } = useParams();
  const engineer = Number(engineerId);

  const [searchParams] = useSearchParams();
  const regionId = Number(searchParams.get("regionId"));

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  // lookup for location names (single fetch for whole page)
  const { data: countries } = useCountries();
  const { data: states } = useStates();
  const { data: cities } = useCities();

  const { data: jobsData, isLoading } = useClientGetJobs({
    enabled: true,
    regionId,
  });

  const { mutateAsync: inviteEngineer } = useClientInviteEngineer({});

  const methods = useForm<SelectedJobCardId>({
    defaultValues: {
      id: [],
    },
    mode: "onSubmit",
  });

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const handleInviteClick = async (data: SelectedJobCardId) => {
    if (!engineer || engineer <= 0) {
      toast.error("Engineer ID is invalid");
      return;
    }
    if (!data.id || data.id.length === 0) {
      toast.error("Please select at least one job");
      return;
    }
    try {
      const invitations = data.id.map((jobId) =>
        inviteEngineer({
          body: {
            jobId,
            engineerId: engineer,
            regionId: Number(regionId),
          },
        }),
      );
      await Promise.all(invitations);
      toast.success(`Invitation sent successfully`);
      setIsOpen(true);
    } catch (error: unknown) {
      let errorMsg = "Failed to send invitation. Please try again.";
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === "object" && error !== null) {
        const errObj = error as Record<string, unknown>;
        if (errObj.message) errorMsg = String(errObj.message);
        if (errObj.error) errorMsg = String(errObj.error);
      }
      toast.error(errorMsg);
    }
  };

  const itemsPerPage = 6;
  // only show jobs that are currently in posted status
  const postedJobs = (jobsData || []).filter(
    (j) =>
      (j.status?.toLowerCase() === "posted" ||
        j.status?.toLowerCase() === "in progress") &&
      (j.assignedEngineerCount ?? 0) !== (j.vacancies ?? 0),
  );
  const totalPages = Math.ceil(postedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = postedJobs.slice(startIndex, startIndex + itemsPerPage);
  const { data: serviceCategories } = useServiceCategories();
  // Create a memoized map of service category ID to name
  const serviceCategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    if (serviceCategories) {
      serviceCategories.forEach((category) => {
        map.set(Number(category.id), category.name);
      });
    }
    return map;
  }, [serviceCategories]);

  const getServiceCategoryName = (serviceCategoryId: number): string => {
    return (
      serviceCategoryMap.get(serviceCategoryId) ||
      `Service Category ${serviceCategoryId}`
    );
  };
  // Helper function to calculate duration from start and end dates
  const calculateDuration = (
    startDate: string | null,
    endDate: string | null,
  ): string => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;
    } else if (startDate) {
      return `Starts: ${new Date(startDate).toLocaleDateString("en-GB")}`;
    }
    return "Not specified";
  };


  const mappedJobs = paginatedJobs.map((apiJob) => ({
    id: apiJob.id,
    title: apiJob.jobTitle,
    date: apiJob.startDate ? new Date(apiJob.startDate).toDateString() : "",
    location: apiJob.workLocationName || "",
    countryId: apiJob.countryId,
    stateId: apiJob.stateId ?? undefined,
    cityId: apiJob.cityId ?? undefined,
    duration: calculateDuration(apiJob.startDate, apiJob.endDate),
    jobType: apiJob.jobType,
    status: apiJob.status,
    serviceType: getServiceCategoryName(apiJob.serviceCategoryId),
    price: apiJob.totalPrice
      ? `${apiJob.currencySymbol || "$"} ${apiJob.totalPrice}`
      : "",
  }));

  const getLocationString = (job: any) => {
    if (job.location) return job.location;

    const countryName = countries?.find((c) => c.id === job.countryId)?.name;
    const stateName = states?.find((s) => s.id === job.stateId)?.name;
    const cityName = cities?.find((c) => c.id === job.cityId)?.name;

    const parts: string[] = [];
    if (cityName) parts.push(cityName);
    if (stateName) parts.push(stateName);
    if (countryName) parts.push(countryName);

    return parts.join(", ");
  };

  const handleToggle = (jobId: number) => {
    const currentIds = getValues("id");
    const newIds = currentIds.includes(jobId)
      ? currentIds.filter((id) => id !== jobId)
      : [...currentIds, jobId];
    setValue("id", newIds, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <FormContainer methods={methods} onSubmit={handleInviteClick}>
        <div className="px-4 py-6">
          <div className="w-full sticky top-16 z-10 ">
            <MyJobsHeader
              title="Select Jobs"
              description={undefined}
              isShowBreadcrumb={true}
              isShowSort={false}
              action={
                <Button
                  variant="primary"
                  type="submit"
                  className="bg-teal-800 dark:bg-teal text-white"
                >
                  Invite To Job
                </Button>
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="py-2 min-h-screen transition-colors duration-300">
                <Controller
                  name="id"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 ||
                      "Please select at least one job to invite.",
                  }}
                  render={({ field }) => (
                    <>
                      {errors.id && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          {errors.id.message}
                        </p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoading ? (
                          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                            Loading jobs...
                          </p>
                        ) : mappedJobs.length > 0 ? (
                          mappedJobs.map((job) => (
                            <JobInviteCard
                              key={job.id}
                              job={job}
                              isSelected={
                                field.value
                                  ? field.value.includes(job.id)
                                  : false
                              }
                              onToggle={handleToggle}
                              locationString={getLocationString(job)}
                            />
                          ))
                        ) : (
                          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                            No jobs available to invite.
                          </p>
                        )}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-6">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <SidebarJobPostWallet earnings={earningsData} />
              </div>
            </div>
          </div>
        </div>
      </FormContainer>
      <Popup
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          navigate(`${absoluteUrls.client.home.my_jobs}?status=Posted`);
        }}
      >
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

export default InviteJob;
