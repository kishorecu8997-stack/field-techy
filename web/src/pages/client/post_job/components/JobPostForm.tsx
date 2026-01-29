import React from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import FormSection from "./FormSection";

import {
  VACANCIES,
  JOB_VISIBILITY,
} from "@/dummy_data/jobFormOptions";
import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { TimeInput } from "@/shared/components/commonUI/inputs/TimeInput";
import {
  validateJobTitile,
  validateJobTimePeriod,
  validateAlphabeticText,
  validateCurrencyText,
  validateAlphabeticTextArea,
  validateTime,
  normalize,
  validateStartDate,
  validateProjectDeadline,
} from "../Validates";

/**
 * @description A form component for creating a new job post.
 * This component handles the first step of the multi-step job posting process,
 * collecting basic information, requirements, and other details about the job.
 * It uses `react-hook-form` for form state management and validation.
 */
const JobPostForm: React.FC = () => {
  /**
   * @description Initializes `react-hook-form` with default values and submission mode.
   * This hook provides methods for form registration, submission, and state management.
   */

  const methods = useFormContext();
  /**
   * @description A helper function to generate consistent CSS classes for form inputs.
   * @returns {string} A string of Tailwind CSS classes for styling input fields.
   */
  const inputClass = () =>
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500";

  const selectedCountry = methods.watch("country");
  const selectedState = methods.watch("state");

  const { data: jobTypesData } = useLookupData("employmentTypes");
  const { data: countriesData } = useLookupData("countries");
  const { data: statesData } = useLookupData("states", selectedCountry);
  const { data: citiesData } = useLookupData("cities", selectedState);
  const { data: skillsData } = useLookupData("skills");
  const { data: experienceLevelsData } = useLookupData("educationLevels");
  const { data: engagementModelsData } = useLookupData("engagementModels");

  const jobTypeOptions = React.useMemo(
    () =>
      jobTypesData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [jobTypesData],
  );

  const countryOptions = React.useMemo(
    () =>
      countriesData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [countriesData],
  );

  const stateOptions = React.useMemo(
    () =>
      statesData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [statesData],
  );

  const cityOptions = React.useMemo(
    () =>
      citiesData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [citiesData],
  );

  const skillOptions = React.useMemo(
    () =>
      skillsData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [skillsData],
  );

  const experienceLevelOptions = React.useMemo(
    () =>
      experienceLevelsData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [experienceLevelsData],
  );

  const engagementModelOptions = React.useMemo(
    () =>
      engagementModelsData?.map((item) => ({
        label: item.name,
        value: String(item.id),
      })) || [],
    [engagementModelsData],
  );

  React.useEffect(() => {
    methods.setValue("state", "");
    methods.setValue("city", "");
  }, [selectedCountry, methods]);

  React.useEffect(() => {
    methods.setValue("city", "");
  }, [selectedState, methods]);

  React.useEffect(() => {
    const date = methods.watch("startDate");
    const time = methods.watch("startTime");

    if (!date || !time) return;

    const now = new Date();
    const selected = new Date(date);
    const [h, m] = time.split(":").map(Number);
    selected.setHours(h, m);

    // Prevent past time for today
    if (selected <= now && selected.toDateString() === now.toDateString()) {
      methods.setValue(
        "startTime",
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")}`,
      );
    }
  }, [methods.watch("startDate"), methods.watch("startTime")]);

  return (
    <>
      <FormProvider {...methods}>
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
                  rules={{
                    validate: (v: string) =>
                      validateAlphabeticTextArea(v, {
                        minLength: 50,
                        maxLength: 2000,
                        required: true,
                      }),
                  }}
                  required
                />
              </div>

              <div>
                <SelectField
                  label="Job Type"
                  name="jobType"
                  placeholder="Select Job Type"
                  options={jobTypeOptions}
                  required
                />
              </div>

              <div>
                <SelectField
                  label="Country"
                  name="country"
                  placeholder="Select a Country"
                  options={countryOptions}
                  required
                />
              </div>

              <div>
                <SelectField
                  label="State"
                  name="state"
                  placeholder="Select a State"
                  options={stateOptions}
                  required
                />
              </div>

              <div>
                <SelectField
                  label="City"
                  name="city" // ✅ lowercase to match formData
                  placeholder="Select a City"
                  options={cityOptions}
                  required
                />
              </div>
              <div>
                <DatePickerInput
                  name="startDate"
                  label="Start Date"
                  placeholder="DD/MM/YYYY"
                  minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  maxDate={
                    normalize(methods.watch("projectDeadline")) || undefined
                  }
                  rules={{
                    validate: (value) =>
                      validateStartDate(
                        value,
                        methods.getValues("projectDeadline"),
                        normalize,
                      ),
                  }}
                  required
                />
              </div>

              <div>
                <TimeInput
                  label="Start Time"
                  name="startTime"
                  required
                  rules={{
                    validate: (value) =>
                      validateTime(methods.watch("startDate"), value),
                  }}
                />
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
                  name="skillsRequire"
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
              rules={{
                validate: (v: string) =>
                  validateAlphabeticTextArea(v, {
                    minLength: 50,
                    maxLength: 2000,
                    required: true,
                  }),
              }}
              required
            />
          </FormSection>

          {/* Other Details */}
          <FormSection title="Other Details">
            <TextareaInput
              label="Other Information"
              name="otherInfo"
              placeholder="Describe here..."
              rules={{
                validate: (v: string) =>
                  validateAlphabeticTextArea(v, {
                    minLength: 50,
                    maxLength: 2000,
                    required: true,
                  }),
              }}
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
                      maxLength: 5,
                      required: true,
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
                options={skillOptions}
                required
              />

              <SelectField
                label="Experience Level"
                name="experienceLevel"
                placeholder="Experience Level"
                options={experienceLevelOptions}
                required
              />

              <SelectField
                label="Engagement Model"
                name="engagementModel"
                placeholder="Engagement Model"
                options={engagementModelOptions}
                required
              />

              <div>
                <DatePickerInput
                  name="projectDeadline"
                  label="Project Deadline"
                  placeholder="DD/MM/YYYY"
                  required
                  minDate={
                    normalize(methods.watch("startDate")) ||
                    new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  rules={{
                    validate: (value) =>
                      validateProjectDeadline(
                        value,
                        methods.getValues("startDate"),
                        normalize,
                      ),
                  }}
                />
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
        </div>
      </FormProvider>
    </>
  );
};

export default JobPostForm;
