import { absoluteUrls } from "@/config/urls";
import {
  interviewerData,
  pointOfContactData,
} from "@/dummy_data/admin/post_a_Job";
import { countries, statesByCountry, citiesByState } from "@/dummy_data/countries";
import { skills, experienceLevel } from "@/dummy_data/client";
import { serviceCategories } from "@/dummy_data/serviceCategories";
import { Button } from "@/shared/components/commonUI/Buttons";
import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { RadioField } from "@/shared/components/commonUI/inputs/RadioField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import TagSelectField from "@/shared/components/commonUI/inputs/TagSelectField";
import MapWithSearch from "@/shared/components/MapWithSearch";
import { usePopupStore } from "@/shared/store/popupStore";
import usePostAJobStore, { CurrentLocation } from "@/shared/store/postAJobStore";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { validateDescription } from "@/pages/engineer/home/validation";
import { ENGAGEMENT_MODELS } from "@/dummy_data/jobFormOptions";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormContext } from "react-hook-form";
import ClientInterviewerCard from "../client_Interview/ClientInterviewerCard";
import ClientInterviewerSection from "../client_Interview/ClientInterviewerSection";
import PointOfContactPage from "../client_Interview/PointOfContactPage";
import SectionHeader from "../SectionHeader";
import BackFills from "./BackFills";
import BasicInfo from "./BasicInfo";
import Budget from "./Budget";
import Languages from "./Languages";
import LocationPage from "./LocationPage";
import OtherDetails from "./OtherDetails";
import Requirements from "./Requirements";
import SchedulingPage from "./SchedulingPage";

/*
 *  PostAJobFields
 *    - Displays a form to add post a job details
 * @returns {JSX.Element} The rendered PostAJobFields
 * @constructor
 */
const PostAJobFields = ({ isDisable }: { isDisable: boolean }) => {
  const { setActiveKey, setISOpenSidebar, setSelectedId } = useDrawerStore();
  const { currentLocation } = usePostAJobStore();
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();
  const {
    watch,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [toolEntries, setToolEntries] = useState<
    {
      name: string;
      budget: string;
      images: { name: string; url: string }[];
    }[]
  >([]);
  const [toolImageInputKey, setToolImageInputKey] = useState(0);
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null);

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const startDateValue = watch("startDate") as Date | null;
  const locationType = watch("locationType");
  const selectedToolFiles = watch("toolImages") as FileList | undefined;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const stateOptions = useMemo(
    () => statesByCountry[selectedCountry] || [],
    [selectedCountry],
  );

  const cityOptions = useMemo(
    () => citiesByState[selectedState] || [],
    [selectedState],
  );

  useEffect(() => {
    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry, setValue]);

  useEffect(() => {
    setValue("city", "");
  }, [selectedState, setValue]);

  const handleDeleteInterviewer = async () => {
    await showPopup({
      title: "Delete Client Interviewer",
      body: "Are you sure you want to delete this interviewer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            close(true);
            toast.success("client interviewer deleted successfully");
          },
        },
      ],
    });
  };

  const pointOfContactSection = pointOfContactData.map((item) => ({
    title: `Point of Contact`,
    items: [
      { label: "First Name", value: item.firstName },
      { label: "Last Name", value: item.lastName },
      { label: "Email ID", value: item.email },
      { label: "Mobile Number", value: item.mobile },
      { label: "Contact Type", value: item.contactType },
    ],
    onEdit: () => {
      setActiveKey("editPointOfContent");
      setISOpenSidebar(true);
      setSelectedId(item.id);
    },
    onDelete: handleDeleteInterviewer,
  }));

  const interviewerValue = interviewerData.map((item) => ({
    title: `Client Interviewer`,
    items: [
      { label: "First Name", value: item.firstName },
      { label: "Last Name", value: item.lastName },
      { label: "Email ID", value: item.email },
      { label: "Mobile Number", value: item.mobile },
      { label: "Available Date", value: item.startDate?.toDateString() },
      { label: "Available Time", value: item.startTime },
    ],
    onEdit: () => {
      setActiveKey("editClientInterviewer");
      setISOpenSidebar(true);
      setSelectedId(Number(item.id));
    },
    onDelete: handleDeleteInterviewer,
  }));

  const formattedInterviewerSections = interviewerValue.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, value: item.value })),
  }));

  useEffect(() => {
    register("toolEntriesCount", {
      validate: (val) => (Number(val) > 0 ? true : "Add at least one tool entry before submitting"),
    });
  }, [register]);

  useEffect(() => {
    setValue("toolEntriesCount", toolEntries.length, { shouldValidate: true });
  }, [setValue, toolEntries.length]);

  const getLabel = (
    options: { value: string; label: string }[],
    value?: string,
  ) => {
    if (!value) return "-";
    return options.find((opt) => opt.value === value)?.label || "-";
  };

  const summaryServiceCategory = watch("serviceCategory");
  const summaryExperienceLevel = watch("experienceLevel");
  const summaryEngagementModel = watch("engagementModel");
  const summaryCountry = watch("country");
  const summaryRate = "₹2000/Week";

  const handleAddToolEntry = () => {
    const name = (watch("tools") as string | undefined)?.trim();
    const budget = (watch("toolBudgetNotes") as string | undefined)
      ?.replace(/\D+/g, "")
      ?.trim();
    const files = watch("toolImages") as FileList | undefined;

    if (!name) {
      toast.error("Please enter tool details before adding");
      return;
    }

    const newImages = files && files.length > 0
      ? Array.from(files).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
      : undefined;

    if (editingToolIndex !== null) {
      setToolEntries((prev) => {
        const next = [...prev];
        const existingImages = prev[editingToolIndex]?.images || [];
        next[editingToolIndex] = {
          name,
          budget: budget || "-",
          images: newImages ?? existingImages,
        };
        return next;
      });
      setEditingToolIndex(null);
    } else {
      setToolEntries((prev) => [
        ...prev,
        { name, budget: budget || "-", images: newImages ?? [] },
      ]);
    }

    setValue("tools", "");
    setValue("toolBudgetNotes", "");
    setValue("toolImages", undefined);
    setToolImageInputKey((key) => key + 1);
    clearErrors(["tools", "toolBudgetNotes", "toolImages"]);
  };

  // Sync tool budget total to form whenever toolEntries change
  useEffect(() => {
    const total = toolEntries.reduce((sum, entry) => {
      const num = Number(entry.budget.replace(/\D/g, ""));
      return sum + (Number.isNaN(num) ? 0 : num);
    }, 0);
    setValue("toolBudgetTotal", total);
  }, [toolEntries, setValue]);

  const handleRemoveToolEntry = (index: number) => {
    setToolEntries((prev) => prev.filter((_, idx) => idx !== index));
    if (editingToolIndex === index) {
      setEditingToolIndex(null);
      setValue("tools", "");
      setValue("toolBudgetNotes", "");
      setValue("toolImages", undefined);
      setToolImageInputKey((key) => key + 1);
    }
  };

  const handleEditToolEntry = (index: number) => {
    const entry = toolEntries[index];
    setEditingToolIndex(index);
    setValue("tools", entry.name);
    setValue("toolBudgetNotes", entry.budget === "-" ? "" : entry.budget);
    setValue("toolImages", undefined);
    setToolImageInputKey((key) => key + 1);
  };

  if (currentLocation === CurrentLocation.fullTime || currentLocation === CurrentLocation.onDemand) {
    return (
      <div className="flex gap-4 flex-row p-2">
        <div className="w-2/3 space-y-8 bg-white dark:bg-gray-900 rounded-lg p-4">
          <div className="space-y-3">
            <SectionHeader title="Job Details" />
            <InputField
              name="jobTitle"
              label="Job Title"
              placeholder="Enter Job Title"
              required
              disabled={isDisable}
            />
            <TextareaInput
              name="description"
              label="Job Description"
              placeholder="Describe the role"
              required
              disabled={isDisable}
              rules={validateDescription(5, 2000, "Job Description")}
            />
          </div>

          <div className="space-y-3">
            <SectionHeader title="Location" />
            <div className="flex flex-row w-full gap-4 items-start">
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1 mb-1">
                  Service Type
                  <span className="text-red-500">*</span>
                </label>
                <div
                  className={`w-full rounded-md px-4 py-2 flex items-center gap-4 border text-base ${
                    errors.locationType
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <RadioField
                    name="locationType"
                    direction="horizontal"
                    options={[
                      { label: "On-site", value: "onsite" },
                      { label: "Remote", value: "remote" },
                      { label: "Hybrid", value: "hybrid" },
                    ]}
                    isShowLabel={false}
                    rules={{ required: "Service Type is required" }}
                    containerClassName="w-full [&_p.mt-1]:hidden"
                    disabled={isDisable}
                  />
                </div>
                {errors.locationType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.locationType.message as string}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-1 mb-1">
                  Country
                  <span className="text-red-500">*</span>
                </label>
                <SelectField
                  label="Country"
                  isShowLabel={false}
                  name="country"
                  placeholder="Select Country"
                  options={countries}
                  required
                  disabled={isDisable}
                />
              </div>
            </div>
            <div className="flex flex-row w-full gap-4 items-center">
              <div className="w-1/2">
                <SelectField
                  label="State"
                  name="state"
                  placeholder="Select State"
                  options={stateOptions}
                  disabled={isDisable}
                />
              </div>
              <div className="w-1/2">
                <SelectField
                  label="City"
                  name="city"
                  placeholder="Select City"
                  options={cityOptions}
                  disabled={isDisable}
                />
              </div>
            </div>
            {locationType !== "remote" && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="p-3">
                  <SectionHeader title="Work Location" />
                </div>
                <div className="px-3 pb-8">
                  <MapWithSearch className="h-[380px]" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <SectionHeader title="Scheduling" />
            <div className="flex flex-row w-full gap-4 items-center">
              <div className="w-1/2">
                <DatePickerInput
                  label="Start Date"
                  name="startDate"
                  placeholder="Select Start Date"
                  minDate={today}
                  required
                  disabled={isDisable}
                />
              </div>
              <div className="w-1/2">
                <DatePickerInput
                  label="End Date"
                  name="endDate"
                  placeholder="Select End Date"
                  minDate={startDateValue || today}
                  required
                  disabled={isDisable}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeader title="Requirements" />
            <div className="flex flex-col w-full gap-3">
              <InputField
                name="numberOfVacancy"
                label="Number of Vacancies"
                inputMode="number"
                onChange={(val) => {
                  const digitsOnly = val.replace(/\D+/g, "");
                  setValue("numberOfVacancy", digitsOnly);
                }}
                required
                rules={{
                  min: { value: 1, message: "Minimum 1 vacancy" },
                  max: { value: 9999, message: "Too many vacancies" },
                }}
                disabled={isDisable}
              />
              <TagSelectField
                required
                placeholder="Select Skills"
                disabled={isDisable}
                name="skills"
                label="Skills"
                options={skills}
              />
              <SectionHeader title="Tool Details" />
              <InputField
                required={!toolEntries.length}
                name="tools"
                label="Tool Name"
                placeholder="Enter tool name"
                disabled={isDisable}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tool Image (PNG, JPEG, PDF)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 h-28 flex items-center justify-center text-sm text-gray-600 dark:text-gray-200">
                  <input
                    key={toolImageInputKey}
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isDisable}
                    {...register("toolImages")}
                  />
                  <div className="text-center pointer-events-none leading-5">
                    <svg
                      className="w-6 h-6 text-teal-900 mx-auto mb-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 16V8" />
                      <path d="M12 8l-3 3" />
                      <path d="M12 8l3 3" />
                      <path d="M4 16.5V18a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 18v-1.5" />
                    </svg>
                    <div className="font-medium">Upload tool files</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG, PDF</div>
                  </div>
                </div>
                {selectedToolFiles && selectedToolFiles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <div className="font-medium text-sm">Selected file</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {Array.from(selectedToolFiles).map((file) => (
                        <li key={file.name} className="truncate">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <InputField
                name="toolBudgetNotes"
                label="Tool Cost"
                placeholder="Enter tool cost"
                inputMode="number"
                onChange={(val) => {
                  const digitsOnly = val.replace(/\D+/g, "");
                  setValue("toolBudgetNotes", digitsOnly);
                }}
                rules={{
                  validate: (val) => {
                    if (val === undefined || val === null || val === "") return true;
                    const num = Number(val);
                    if (Number.isNaN(num)) return "Enter a valid amount";
                    if (num > 10_000_000) return "Max allowed amount is 10000000";
                    return true;
                  },
                }}
                required={!toolEntries.length}
                disabled={isDisable}
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={handleAddToolEntry}
                  disabled={isDisable}
                >
                  {editingToolIndex !== null ? "Update Tool Entry" : "Add Tool Entry"}
                </Button>
              </div>
              {toolEntries.length > 0 && (
                <div className="space-y-2">
                  <SectionHeader title="Tool Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {toolEntries.map((entry, idx) => (
                      <div
                        key={`${entry.name}-${idx}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 text-sm text-gray-900 dark:text-gray-100">
                            <div>
                              <span className="font-semibold">Tool Name:</span> <span className="font-normal">{entry.name}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Tool Cost:</span> <span className="font-normal">{entry.budget}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              className="rounded-md px-2.5 py-1 text-xs h-8"
                              onClick={() => handleEditToolEntry(idx)}
                              disabled={isDisable}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              className="rounded-md px-2.5 py-1 text-xs h-8"
                              onClick={() => handleRemoveToolEntry(idx)}
                              disabled={isDisable}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        {entry.images.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              <span className="font-semibold">Tool Image:</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                            {entry.images.map((img, imageIdx) => (
                              <div
                                key={`${img.name}-${imageIdx}`}
                                className="h-11 w-11 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                              >
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeader title="Rate Card" />
            <div className="flex flex-col w-full gap-3">
              <SelectField
                label="Service Category"
                name="serviceCategory"
                placeholder="Select Service Category"
                options={serviceCategories}
                required
                disabled={isDisable}
              />
              <div className="flex flex-row w-full gap-4 items-center">
                <div className="w-1/2">
                  <SelectField
                    label="Engineer Experience Level"
                    name="experienceLevel"
                    placeholder="Select Experience Level"
                    options={experienceLevel}
                    required
                    disabled={isDisable}
                  />
                </div>
                <div className="w-1/2">
                  <SelectField
                    label="Engagement Model"
                    name="engagementModel"
                    placeholder="Select Engagement Model"
                    options={ENGAGEMENT_MODELS}
                    required
                    disabled={isDisable}
                  />
                </div>
              </div>
              <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-teal-900 text-white text-sm font-semibold px-4 py-2 grid grid-cols-5">
                  <div>Service Category</div>
                  <div>Experience Level</div>
                  <div>Engagement Model</div>
                  <div>Country</div>
                  <div>Rate</div>
                </div>
                <div className="text-sm px-4 py-3 grid grid-cols-5 gap-2 bg-white dark:bg-gray-800">
                  <div>{getLabel(serviceCategories, summaryServiceCategory)}</div>
                  <div>{getLabel(experienceLevel, summaryExperienceLevel)}</div>
                  <div>{getLabel(ENGAGEMENT_MODELS, summaryEngagementModel)}</div>
                  <div>{getLabel(countries, summaryCountry)}</div>
                  <div>{summaryRate}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeader title="Other Details" />
            <div className="flex flex-col w-full gap-3">
              <TextareaInput
                name="otherInfo"
                label="Additional Details"
                placeholder="Add any additional guidelines or notes"
                disabled={isDisable}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Additional Attachments (Guidelines, Docs)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 h-32 flex items-center justify-center text-sm text-gray-600 dark:text-gray-200">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isDisable}
                    {...register("attachments")}
                  />
                  <div className="text-center pointer-events-none leading-5">
                    <svg
                      className="w-6 h-6 text-teal-900 mx-auto mb-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 16V8" />
                      <path d="M12 8l-3 3" />
                      <path d="M12 8l3 3" />
                      <path d="M4 16.5V18a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 18v-1.5" />
                    </svg>
                    <div className="font-medium">Attachments (Guidelines, Docs)</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isDisable && (
            <div className="flex justify-end gap-2 mt-2">
              <Button
                isScrollToTop
                variant="outline"
                className="rounded-md"
                onClick={() => {
                  navigate(absoluteUrls.client.home.my_jobs);
                }}
              >
                Cancel
              </Button>
              <Button
                isScrollToTop
                className="rounded-md"
                type="submit"
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-row p-2">
      <div className="w-2/3 space-y-2 bg-white dark:bg-gray-900 rounded-lg p-4">
        <BasicInfo isDisable={isDisable} />
        <LocationPage isDisable={isDisable} />
        <SchedulingPage isDisable={isDisable} />
        <Requirements isDisable={isDisable} />
        {currentLocation === CurrentLocation.dedicated && (
          <>
            <BackFills isDisable={isDisable} />
            <Budget isDisable={isDisable} />
          </>
        )}
        <Languages isDisable={isDisable} />
        <OtherDetails isDisable={isDisable} />
        {!isDisable && (
          <div className="flex justify-end gap-2 mt-2">
            <Button
              isScrollToTop
              variant="outline"
              className="rounded-full"
              onClick={() => {
                navigate(absoluteUrls.client.home.my_jobs);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isScrollToTop
              className="rounded-full"
              onClick={(event) => {
                const form = event.currentTarget.form;
                if (form && !form.reportValidity()) {
                  event.preventDefault();
                }
              }}
            >
              Review Job Posting
            </Button>
          </div>
        )}
      </div>

      <div className="w-1/3">
        {currentLocation === CurrentLocation.dedicated ? (
          <>
            {interviewerData.length ? (
              <ClientInterviewerSection
                disabled={isDisable}
                title="Client Interviewer"
                sections={formattedInterviewerSections}
                addAction={
                  <Button
                    onClick={() => {
                      setActiveKey("clientInterviewer");
                      setISOpenSidebar(true);
                    }}
                    className="rounded-full"
                  >
                    Add Client Interviewer
                  </Button>
                }
              />
            ) : (
              <ClientInterviewerCard />
            )}
          </>
        ) : (
          <>
            {pointOfContactData.length ? (
              <ClientInterviewerSection
                disabled={isDisable}
                sections={pointOfContactSection}
                title="Point of Contact"
                addAction={
                  <Button
                    onClick={() => {
                      setActiveKey("addPointOfContact");
                      setISOpenSidebar(true);
                    }}
                    className="rounded-full"
                  >
                    Add Point of Contact
                  </Button>
                }
              />
            ) : (
              <PointOfContactPage />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostAJobFields;
