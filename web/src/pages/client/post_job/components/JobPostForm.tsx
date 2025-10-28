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

interface FormData {
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDate: string;
  startTime: string;
  numberOfVacancy: string;
  timePeriod: string;
  skillsRequired: string;
  requirements: string;
  otherInfo: string;
  toolName: string;
  toolImage: File | null;
  additionalBudget: string;
  requiredSkill: string;
  experienceLevel: string;
  engagementModel: string;
  projectDeadline: string;
  milestoneStructure: string;
  attachments: File | null;
  jobVisibility: string;
}

const JobPostForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
    requiredSkill: "",
    experienceLevel: "",
    engagementModel: "",
    projectDeadline: "",
    milestoneStructure: "",
    attachments: null,
    jobVisibility: "",
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

  const inputClass = (isError = false) => `
    w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800
    ${isError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
    bg-white dark:bg-gray-800 text-gray-800 dark:text-white
    focus:border-emerald-500 dark:focus:border-emerald-500
  `;

  const selectClass = (isError = false) => `
    w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800
    ${isError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
    bg-white dark:bg-gray-800 text-gray-800 dark:text-white
    focus:border-emerald-500 dark:focus:border-emerald-500
  `;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <form onSubmit={handleSubmit}>
        {!showReview && (<><FormSection title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Job Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g Field Technician, HVAC Specialist"
                className={inputClass()}
                // required
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Job Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, expectations, and requirements..."
                className={`${inputClass()} min-h-[100px]`}
                // required
              />
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Job Type<span className="text-red-500">*</span>
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {JOB_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Country<span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {COUNTRIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                State<span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {STATES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                City<span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {CITIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
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
                  // required
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
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
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
                  // required
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
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Number of vacancy<span className="text-red-500">*</span>
              </label>
              <select
                name="numberOfVacancy"
                value={formData.numberOfVacancy}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {VACANCIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Time period of Job<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleChange}
                placeholder="8 hours"
                className={inputClass()}
                // required
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Skills Required<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="e.g. Electrical, Plumbing, HVAC"
                className={inputClass()}
                // required
              />
            </div>
          </div>
        </FormSection>

        {/* REQUIREMENTS */}
        <FormSection title="Requirement">
          <div>
            <label
              className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
            >
              Requirements/Deliverable<span className="text-red-500">*</span>
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Describe here.."
              className={`${inputClass()} min-h-[150px]`}
              // required
            />
          </div>
        </FormSection>

        {/* OTHER DETAILS */}
        <FormSection title="Other Details">
          <div>
            <label
              className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
            >
              Other Information<span className="text-red-500">*</span>
            </label>
            <textarea
              name="otherInfo"
              value={formData.otherInfo}
              onChange={handleChange}
              placeholder="Describe here.."
              className={`${inputClass()} min-h-[150px]`}
              // required
            />
          </div>
        </FormSection>

        {/* HARDWARE TOOLS REQUIRED */}
        <FormSection title="Add Hardware Tools Required">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Tool Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="toolName"
                value={formData.toolName}
                onChange={handleChange}
                placeholder="e.g Field Technician, HVAC Specialist"
                className={inputClass()}
                // required
              />
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Tool Image<span className="text-red-500">*</span>
              </label>
              <FileUploadArea
                title="Upload Tool Image"
                acceptedFormats="PDF, JPG, PNG"
                onFileSelect={(file) => handleFileChange("toolImage", file)}
              />
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Additional budget for the tool
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="additionalBudget"
                value={formData.additionalBudget}
                onChange={handleChange}
                placeholder="Set budget"
                className={inputClass()}
                // required
              />
            </div>
          </div>
        </FormSection>

        {/* RATE CARD */}
        <FormSection title="Rate Card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Required Skill<span className="text-red-500">*</span>
              </label>
              <select
                name="requiredSkill"
                value={formData.requiredSkill}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {SKILLS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Experience Level<span className="text-red-500">*</span>
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {EXPERIENCE_LEVELS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Engagement Model<span className="text-red-500">*</span>
              </label>
              <select
                name="engagementModel"
                value={formData.engagementModel}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {ENGAGEMENT_MODELS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Project Deadline<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="projectDeadline"
                  value={formData.projectDeadline}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className={inputClass()}
                  // required
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
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Milestone Structure<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="milestoneStructure"
                value={formData.milestoneStructure}
                onChange={handleChange}
                placeholder="E.g 50% upfront"
                className={inputClass()}
                // required
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Attachments (Guidelines, Docs)
                <span className="text-red-500">*</span>
              </label>
              <FileUploadArea
                title="Attachments (Guidelines, Docs)"
                acceptedFormats="PDF, JPG, PNG"
                onFileSelect={(file) => handleFileChange("attachments", file)}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Job Visibility<span className="text-red-500">*</span>
              </label>
              <select
                name="jobVisibility"
                value={formData.jobVisibility}
                onChange={handleChange}
                className={selectClass()}
                // required
              >
                {JOB_VISIBILITY.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div></FormSection></>)}
         {showReview ? (
          <JobReviewPage
            onBack={() => setShowReview(false)}
            onSubmit={() => {
              alert("Job posted successfully!");
              // Redirect or reset form here
              // e.g., navigate('/jobs') or reset form state
            }}
          />
        ) : (
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-medium bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
          >
            Review Job Posting
          </button>
        )}
       
      </form>
    </div>
  );
};

export default JobPostForm;
