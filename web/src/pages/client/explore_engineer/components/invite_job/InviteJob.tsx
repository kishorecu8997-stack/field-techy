import { earningsData } from "@/dummy_data/jobDetails";
import { JobInviteData } from "@/dummy_data/jobInviteData";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import Popup from "@/shared/components/Popup";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { SelectedJobCardId } from "../../types";
import InvitationSentModal from "./InvitationSentModal";
import JobInviteCard from "./JobInviteCard";
import { Button } from "@/shared/components/commonUI/Buttons";
interface SelectJobCardProps {
  onClose: () => void;
}

/**
 * A component that allows a client to select one or more jobs to invite an engineer to.
 * It displays a list of available jobs as selectable cards and handles the invitation logic.
 *
 * @param {SelectJobCardProps} props - The props for the component.
 * @returns {React.ReactElement} A React functional component that renders the job invitation page.
 */
const InviteJob: React.FC<SelectJobCardProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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

  const handleInviteClick = (data: SelectedJobCardId) => {
    console.log("Form submitted with data:", data);
    toast.success(`Invitation sent successfully`);
    setIsOpen(true);
    // onInviteJobCard(data); // This can be called if needed
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
      <FormContainer
        methods={methods}
        onSubmit={handleInviteClick}
      >
        <div className="px-4 py-6">
          <div className="w-full sticky top-16 z-10 ">
            <MyJobsHeader
              title="Select Jobs"
              isShowBreadcrumb={true}
              isReport={false}
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
                        {JobInviteData.length > 0 ? (
                          JobInviteData.map((job) => (
                            <JobInviteCard
                              key={job.id}
                              job={job}
                              isSelected={field.value.includes(job.id)}
                              onToggle={handleToggle}
                            />
                          ))
                        ) : (
                          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                            No jobs available to invite.
                          </p>
                        )}
                      </div>
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
      <Popup open={isOpen} onClose={onClose}>
        <InvitationSentModal onClose={() => setIsOpen(false)} />
      </Popup>
    </div>
  );
};

export default InviteJob;
