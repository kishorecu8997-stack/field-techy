import React from "react";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import ClientHeader from "@/shared/components/ClientHeader";
import JobInviteCard from "./JobInviteCard";
import { JobInviteData } from "@/dummy_data/jobInviteData";
import Popup from "@/shared/components/Popup";
import InvitationSentModal from "./InvitationSentModal";
import type { SelectedJobCardId } from "../../types";
import { useForm, Controller } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { toast } from "react-toastify";

interface SelectJobCardProps {
  onClose: () => void;
 
}

const InviteJob: React.FC<SelectJobCardProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const methods = useForm<SelectedJobCardId>({
    defaultValues: {
      id: [],
    },
    mode: "onSubmit",
  });

  const { control,  setValue, getValues, formState: { errors } } = methods;

  const handleInviteClick = (data: SelectedJobCardId) => {
    console.log("Valid card data:", data);
    toast.success("Invitation sent successfully.");
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <FormContainer
        methods={methods}
        onSubmit={handleInviteClick}
        className="space-y-6"
      >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
              <ClientHeader
                currentPath="Select Jobs"
                showSearchBar={false}
                showButton={true}
                buttonText="Invite To Job"
              />
            </div>
            <div className="p-4 md:p-8 min-h-screen transition-colors duration-300">
              <Controller
                name="id"
                control={control}
                rules={{
                  validate: (value) =>
                    value.length > 0 || "Please select at least one job to invite.",
                }}
                render={({ field }) => (
                  <>
                  {errors.id && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors.id.message}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
