import React, { useState } from "react";
import FileUploadArea from "./FileUploadArea";
import FormSection from "./FormSection";
import {
  JOB_TYPES,
  COUNTRIES,
  STATES,
  CITIES,
  VACANCIES,
  SKILLS,
  EXPERIENCE_LEVELS,
  ENGAGEMENT_MODELS,
  JOB_VISIBILITY,
} from "@/dummy_data/jobFormOptions";
import JobReviewPage from "./JobReviewPage";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";

const JobPostForm: React.FC = () => {
  // FormData type is defined here

  const method = useForm<FormData>({
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      jobType: "",
      country: "",
      state: "",
      city: "",
      startDate: "",
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
      projectDeadline: "",
      milestoneStructure: "",
      attachments: null,
      jobVisibility: "",
    },
    mode: "onSubmit",
  });

  const [showReview, setShowReview] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReview(true);
  };

  const inputClass = () =>
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500";

  const selectClass = () =>
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500";

  if (showReview) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <JobReviewPage
          formData={formData}
          onBack={() => setShowReview(false)}
          onSubmit={() => {
            alert("Job posted successfully!");
            // TODO: Add actual submission logic
          }}
        />
      </div>
    );
  }

  return (
    <FormContainer
      methods={method}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        {/* Basic Information */}
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField
                name="jobTitle"
                label="Job Title"
                placeholder="e.g. Field Technician, HVAC Specialist"
                onChange={handleChange}
                inputClassName={inputClass()}
                required
              />
            </div>

            <div className="md:col-span-2">
              <TextareaInput
                name="jobDescription"
                label="Job Description"
                placeholder="Describe the job responsibilities, expectations, and requirements..."
                onChange={handleChange}
                inputClassName={inputClass()}
                required
              />
            </div>

            <div>
              <SelectField
                label="Job Type"
                name="jobType"
                placeholder="Select Job Type"
                onChange={handleChange}
                options={JOB_TYPES}
              />
            </div>

            <div>
              <SelectField
                label="Country"
                name="country"
                placeholder="Select a Country"
                onChange={handleChange}
                options={COUNTRIES}
              />
            </div>

            <div>
              <SelectField
                label="State"
                name="state"
                placeholder="Select a State"
                onChange={handleChange}
                options={STATES}
              />
            </div>

            <div>
              <SelectField
                label="City"
                name="city" // ✅ lowercase to match formData
                placeholder="Select a City"
                onChange={handleChange}
                options={CITIES}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Start Date<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className={inputClass()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Start Time<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  placeholder="Select Time"
                  className={inputClass()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <SelectField
                label="Number of Vacancies"
                name="numberOfVacancy"
                placeholder="Select number"
                onChange={handleChange}
                options={VACANCIES}
              />
            </div>

            <div>
              <InputField
                name="timePeriod"
                label="Time Period of Job"
                placeholder="e.g. 8 hours"
                onChange={handleChange}
                inputClassName={inputClass()}
                required
              />
            </div>

            <div className="md:col-span-2">
              <InputField
                name="skillsRequired"
                label="Skills Required"
                placeholder="e.g. Electrical, Plumbing, HVAC"
                onChange={handleChange}
                inputClassName={inputClass()}
                required
              />
            </div>
          </div>
        </FormSection>

        {/* Requirements */}
        <FormSection title="Requirements">
          <TextareaInput
            label="Requirements / Deliverables"
            name="requirements"
            placeholder="Describe here..."
            onChange={handleChange}
          />
        </FormSection>

        {/* Other Details */}
        <FormSection title="Other Details">
          <TextareaInput
            label="Other Information"
            name="otherInfo"
            placeholder="Describe here..."
            onChange={handleChange}
          />
        </FormSection>

        {/* Hardware Tools Required */}
        <FormSection title="Hardware Tools Required">
          <div className="grid grid-cols-1 gap-6">
            <InputField
              name="toolName"
              label="Tool Name"
              placeholder="e.g. Multimeter, Pipe Wrench"
              onChange={handleChange}
              inputClassName={inputClass()}
              required
            />

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Tool Image<span className="text-red-500">*</span>
              </label>
              <FileUploadArea
                title="Upload Tool Image"
                acceptedFormats="PDF, JPG, PNG"
                onFileSelect={(file) => handleFileChange("toolImage", file)}
              />
            </div>

            <InputField
              name="additionalBudget"
              label="Additional Budget for the Tool"
              placeholder="e.g. $50"
              onChange={handleChange}
              inputClassName={inputClass()}
              required
            />
          </div>
        </FormSection>

        {/* Rate Card */}
        <FormSection title="Rate Card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Skill"
              name="skillsRequired"
              placeholder="Select a Skill"
              onChange={handleChange}
              options={SKILLS}
            />

            <SelectField
              label="Experience Level"
              name="experienceLevel"
              placeholder="Experience Level"
              onChange={handleChange}
              options={EXPERIENCE_LEVELS}
            />

            <SelectField
              label="Engagement Model"
              name="engagementModel"
              placeholder="Engagement Model"
              onChange={handleChange}
              options={ENGAGEMENT_MODELS}
            />

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Project Deadline<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="projectDeadline"
                  value={formData.projectDeadline}
                  onChange={handleChange}
                  placeholder="MM/DD/YYYY"
                  className={inputClass()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <InputField
                name="milestoneStructure"
                label="Milestone Structure"
                placeholder="e.g. 50% upfront, 50% on completion"
                onChange={handleChange}
                inputClassName={inputClass()}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Attachments (Guidelines, Docs)
                <span className="text-red-500">*</span>
              </label>
              <FileUploadArea
                title="Upload Attachments"
                acceptedFormats="PDF, JPG, PNG"
                onFileSelect={(file) => handleFileChange("attachments", file)}
              />
            </div>

            <div className="md:col-span-2">
              <SelectField
                label="Job Visibility"
                name="jobVisibility"
                placeholder="Job Visibility"
                onChange={handleChange}
                options={JOB_VISIBILITY}
              />
            </div>
          </div>
        </FormSection>

        <button
          type="submit"
          className="mt-6 px-6 py-3 rounded-lg font-medium bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
        >
          Review Job Posting
        </button>
      </div>
    </FormContainer>
  );
};

export default JobPostForm;
