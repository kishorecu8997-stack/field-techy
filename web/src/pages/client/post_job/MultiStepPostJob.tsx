import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import JobPostForm from "./components/JobPostForm";
import JobReviewPage from "./components/JobReviewPage";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ClientHeader from "@/shared/components/ClientHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import AddPaymentMethod from "@/shared/components/commonUI/AddPaymentMethod";
import type { FormDataPostJob } from "./types";


/**
 * A multi-step form component for clients to post a new job.
 * It guides the user through different sections of the job post creation process.
 */
const MultiStepPostJobForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const methods = useForm<FormDataPostJob>({
    mode: "onSubmit",
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      jobType: "",
      country: "",
      state: "",
      city: "",
      startDate: null,
      startTime: "",
      numberOfVacancy: "",
      timePeriod: "",
      skillsRequired: "",
      requirements: "",
      otherInfo: "",
      toolName: "",
      toolImage: null,
      additionalBudget: "",
      experienceLevel: "",
      engagementModel: "",
      projectDeadline: null,
      milestoneStructure: "",
      attachments: null,
      jobVisibility: "",
      urgencyLevel: "",
      paymentMethod: "",
      consent: false,
    },
  });
  const { trigger } = methods;

  /**
   * Handles the submission of each step in the form.
   * It triggers validation for the current step's fields and proceeds to the next step or final submission if valid.
   * @param {FormDataPostJob} data - The current form data.
   */
  const handleStepSubmit = async (data: FormDataPostJob) => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger([
          "jobTitle",
          "jobDescription",
          "jobType",
          "country",
          "state",
          "city",
          "startDate",
          "numberOfVacancy",
          "timePeriod",
          "skillsRequired",
          "requirements",
          "otherInfo",
          "toolName",
          "additionalBudget",
          "experienceLevel",
          "engagementModel",
          "projectDeadline",
          "milestoneStructure",
          "attachments",
          "jobVisibility",
        ]);
        if (isValid) {
          setCurrentStep(2);
        }
        break;

      case 2:
        isValid = await trigger(["urgencyLevel", "consent", "paymentMethod"]);
        if (isValid) {
          await submitCompleteForm(data);
        }
        break;
    }
  };

  const submitCompleteForm = async (data: FormDataPostJob) => {
    setIsSubmitting(true);
    try {
      // MOCK API CALL (replace with real fetch when backend is ready)
      console.log("Submitting Post a job data:", data);
      await new Promise((r) => setTimeout(r, 800));
      navigate(absoluteUrls.client.home.dashboard);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <JobPostForm />;
      case 2:
        return <JobReviewPage setIsOpen={setIsOpen} isOpen={isOpen} />;
      default:
        return <JobPostForm />;
    }
  };
  return (
    <>
      <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="sticky top-[80px] z-10 bg-gray-50 dark:bg-gray-900">
                <ClientHeader
                  title="Post Job"
                  currentPath="Post A Job"
                  showSearchBar={false}
                />
              </div>
              <FormContainer
                methods={methods}
                onSubmit={handleStepSubmit}
                className="w-full"
              >
                {currentStep > 1 && (
                  <div>
                    <Button
                      type="button" // Prevents form submission
                      onClick={goToPreviousStep}
                      className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="Go back"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </Button>
                  </div>
                )}
                <div>
                  <div
                    key={currentStep}
                    className="p-2 relative gap-3 w-full "
                  >
                    {renderStep()}
                  </div>

                  <div className="flex justify-center items-center w-full p-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[30rem] bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                      {currentStep === 2
                        ? isSubmitting
                          ? "Submitting..."
                          : "Pay & Post Job"
                        : "Review Job Posting"}
                    </Button>
                  </div>
                </div>
              </FormContainer>              
              <AddPaymentMethod isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <SidebarJobPostWallet earnings={earningsData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiStepPostJobForm;
