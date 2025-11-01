import React, { useState } from "react";
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
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { Controller, useForm } from "react-hook-form";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import type { FormData } from "../types";
import { TimeInput } from "@/shared/components/commonUI/inputs/TimeInput";
import {
  validateJobTitile,
  validateDateRange,
  validateJobTimePeriod,
  validateAlphabeticText,
  validateCurrencyText,
  validateProjectDeadline,
} from "../validates";

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
    },
    mode: "onSubmit",
  });

  const [showReview, setShowReview] = useState<boolean>(false);

  const handleSubmit = (data: FormData) => {
    console.log("Form Data:", data);
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
          formData={method.getValues()}
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
      <div className="w-full p-4 md:p-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        {/* Basic Information */}
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField
                name="jobTitle"
                label="Job Title"
                placeholder="e.g. Field Technician, HVAC Specialist"
                inputClassName={inputClass()}
                required
                rules={{ validate: (v: string) => validateJobTitile(v) }}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaInput
                name="jobDescription"
                label="Job Description"
                placeholder="Describe the job responsibilities, expectations, and requirements..."
                required
                minLength={50}
                maxLength={2000}
              />
            </div>

            <div>
              <SelectField
                label="Job Type"
                name="jobType"
                placeholder="Select Job Type"
                options={JOB_TYPES}
                required
              />
            </div>

            <div>
              <SelectField
                label="Country"
                name="country"
                placeholder="Select a Country"
                options={COUNTRIES}
                required
              />
            </div>

            <div>
              <SelectField
                label="State"
                name="state"
                placeholder="Select a State"
                options={STATES}
                required
              />
            </div>

            <div>
              <SelectField
                label="City"
                name="city" // ✅ lowercase to match formData
                placeholder="Select a City"
                options={CITIES}
                required
              />
            </div>

            <div>
              <div className="relative">
                <Controller
                  name="startDate"
                  rules={{
                    validate: (value) =>
                      validateDateRange(value, method.getValues("startDate")),
                  }}
                  control={method.control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <DatePickerInput
                        label="Start Date"
                        placeholder="Select start date"
                        {...field}
                        required
                      />
                      {error && (
                        <p className="text-red-600 text-sm">{error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <TimeInput label="Start Time" name="startTime" required />
            </div>

            <div>
              <SelectField
                label="Number of Vacancies"
                name="numberOfVacancy"
                placeholder="Select number"
                options={VACANCIES}
                required
              />
            </div>

            <div>
              <InputField
                name="timePeriod"
                label="Time Period of Job"
                placeholder="e.g. 8 hours"
                inputClassName={inputClass()}
                required
                rules={{ validate: (v: string) => validateJobTimePeriod(v) }}
              />
            </div>

            <div className="md:col-span-2">
              <InputField
                name="skillsRequired"
                label="Skills Required"
                placeholder="e.g. Electrical, Plumbing, HVAC"
                inputClassName={inputClass()}
                rules={{
                  validate: (v: string) =>
                    validateAlphabeticText(v, {
                      minLength: 2,
                      maxLength: 500,
                      required: true,
                      maxSpaces: 10,
                    }),
                }}
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
            minLength={50}
            maxLength={2000}
            required
          />
        </FormSection>

        {/* Other Details */}
        <FormSection title="Other Details">
          <TextareaInput
            label="Other Information"
            name="otherInfo"
            placeholder="Describe here..."
            minLength={50}
            maxLength={2000}
            required
          />
        </FormSection>

        {/* Hardware Tools Required */}
        <FormSection title="Add Hardware Tools Required">
          <div className="grid grid-cols-1 gap-6">
            <InputField
              name="toolName"
              label="Tool Name"
              placeholder="e.g. Multimeter, Pipe Wrench"
              inputClassName={inputClass()}
              rules={{
                  validate: (v: string) =>
                    validateAlphabeticText(v, {
                      minLength: 2,
                      maxLength: 50,
                      required: true,
                      maxSpaces: 10,
                    }),
                }}
              required
            />

            <div>
              <FileUpload
                name="toolImage"
                label="Document"
                placeholder="Upload Tool Image"
                accept=".pdf,.jpg,.png"
                maxPages={5}
                validatePDF={true}
                required
              />
            </div>

            <InputField
              name="additionalBudget"
              label="Additional Budget for the Tool"
              placeholder="e.g. $50"
              inputClassName={inputClass()}
              rules={{
                  validate: (v: string) =>
                    validateCurrencyText(v, {
                      minLength: 2,
                      maxLength: 50,
                      required: true,
                      maxSpaces: 10,
                    }),
                }}
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
              options={SKILLS}
              required
            />

            <SelectField
              label="Experience Level"
              name="experienceLevel"
              placeholder="Experience Level"
              options={EXPERIENCE_LEVELS}
              required
            />

            <SelectField
              label="Engagement Model"
              name="engagementModel"
              placeholder="Engagement Model"
              options={ENGAGEMENT_MODELS}
              required
            />

            <div>
              <div className="relative">
                <Controller
                  name="projectDeadline"
                  rules={{
                    validate: (value) =>
                      validateProjectDeadline(value, method.getValues("startDate")),
                  }}
                  control={method.control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <DatePickerInput
                        label="Project Deadline"
                        placeholder="Select project deadline"
                        required
                        {...field}
                      />
                      {error && (
                        <p className="text-red-600 text-sm">{error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="md:col-span-2">
             
              <SelectField
                label="Milestone Structure"
                name="milestoneStructure"
                placeholder="e.g. 50% upfront, 50% on completion"
                options={[
              { value: "1", label: "Option1" },
              { value: "2", label: "Option2" },
              { value: "3", label: "Option3" },
            ]}
                required
              />

            </div>

            <div className="md:col-span-2">
              <FileUpload
                name="attachments"
                label="Attachments (Guidelines, Docs)"
                accept=".pdf,.jpg,.png"
                maxPages={5}
                validatePDF={true}
                required
              />
            </div>

            <div className="md:col-span-2">
              <SelectField
                label="Job Visibility"
                name="jobVisibility"
                placeholder="Job Visibility"
                options={JOB_VISIBILITY}
                required
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
